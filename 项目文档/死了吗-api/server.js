/**
 * 好着没 - 后端 API
 * 功能：每日签到、连续2天未签到时发送邮件提醒
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

// 数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'dbconn.usw-1.sealos.app',
  port: parseInt(process.env.DB_PORT || '34575', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'kvzhr2m4',
  database: process.env.DB_NAME || 'areyoudead',
  waitForConnections: true,
  connectionLimit: 10,
});

// 微信 code 换 openid
async function getOpenId(code) {
  const appid = process.env.WECHAT_APPID;
  const secret = process.env.WECHAT_SECRET;
  if (!appid || !secret) {
    throw new Error('WECHAT_APPID / WECHAT_SECRET 未配置');
  }
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.openid) resolve(json.openid);
          else reject(new Error(json.errmsg || '获取 openid 失败'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 邮件发送
let transporter = null;
function getTransporter() {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
      return null;
    }
    transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }
  return transporter;
}

// ========== 接口 ==========

// 健康检查
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ code: 0, message: 'OK', data: { db: 'connected' } });
  } catch (err) {
    res.status(500).json({ code: 50001, message: err.message });
  }
});

// 每日签到
app.post('/api/check-in', async (req, res) => {
  try {
    const { code, nickname, email } = req.body || {};
    if (!code || !nickname || !email) {
      return res.status(400).json({ code: 40001, message: '请输入姓名和邮箱' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ code: 40001, message: '邮箱格式不正确' });
    }

    let openid;
    try {
      openid = await getOpenId(code);
    } catch (e) {
      return res.status(401).json({ code: 40101, message: '登录已过期，请重新打开小程序' });
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // 查询或创建用户
    let [users] = await pool.query('SELECT id, status FROM users WHERE openid = ?', [openid]);
    let userId;
    if (users.length === 0) {
      const [r] = await pool.query(
        'INSERT INTO users (openid, email, nickname, status) VALUES (?, ?, ?, 1)',
        [openid, email, nickname]
      );
      userId = r.insertId;
    } else {
      const u = users[0];
      if (u.status === 0) {
        return res.status(403).json({ code: 40301, message: '账号已停用' });
      }
      userId = u.id;
      await pool.query(
        'UPDATE users SET email = ?, nickname = ?, updated_at = NOW() WHERE id = ?',
        [email, nickname, userId]
      );
    }

    // 检查今日是否已签到
    const [existing] = await pool.query(
      'SELECT id FROM check_ins WHERE user_id = ? AND check_in_date = ?',
      [userId, today]
    );
    if (existing.length > 0) {
      return res.status(200).json({
        code: 0,
        message: '今日已签到',
        data: { checkInDate: today, message: '今日已签到过了' },
      });
    }

    await pool.query(
      'INSERT INTO check_ins (user_id, check_in_date) VALUES (?, ?)',
      [userId, today]
    );

    res.json({
      code: 0,
      message: '签到成功',
      data: { checkInDate: today },
    });
  } catch (err) {
    console.error('check-in error:', err);
    res.status(500).json({ code: 50001, message: '签到失败，请稍后重试' });
  }
});

// ========== 定时任务：连续2天未签到的用户发邮件 ==========
const REMINDER_CONTENT = process.env.EMAIL_REMINDER_CONTENT || '我连续2天都不好，快给我打个电话吧！';

async function sendReminderEmails() {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[cron] 邮件未配置 SMTP，跳过提醒');
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  // 连续2天未签到：最后签到日 < today - 1
  const [users] = await pool.query(`
    SELECT u.id, u.email, u.nickname
    FROM users u
    LEFT JOIN (
      SELECT user_id, MAX(check_in_date) AS last_date
      FROM check_ins
      GROUP BY user_id
    ) c ON u.id = c.user_id
    WHERE u.status = 1
      AND (c.last_date IS NULL OR c.last_date < DATE_SUB(?, INTERVAL 1 DAY))
      AND NOT EXISTS (
        SELECT 1 FROM email_notifications en
        WHERE en.user_id = u.id AND DATE(en.sent_at) = ?
      )
  `, [today, today]);

  for (const u of users) {
    const [countRows] = await pool.query(
      'SELECT COUNT(*) AS cnt FROM email_notifications WHERE user_id = ?',
      [u.id]
    );
    const sequence = (countRows[0]?.cnt || 0) + 1;

    const fromAddr = process.env.SMTP_FROM || 'noreply@example.com';
    const fromMatch = fromAddr.match(/<([^>]+)>/);
    const fromEmail = fromMatch ? fromMatch[1] : fromAddr;

    try {
      await transport.sendMail({
        from: process.env.SMTP_FROM || fromEmail,
        to: u.email,
        subject: '好着没 - 记得签到哦',
        text: REMINDER_CONTENT,
        html: `<p>${REMINDER_CONTENT.replace(/\n/g, '<br>')}</p>`,
      });

      await pool.query(
        `INSERT INTO email_notifications (user_id, sequence, sent_at, recipient_email, send_status, content, reason)
         VALUES (?, ?, NOW(), ?, 1, ?, 'consecutive_2_days')`,
        [u.id, sequence, u.email, REMINDER_CONTENT]
      );
      console.log(`[cron] 已向 ${u.email} 发送提醒邮件`);
    } catch (err) {
      console.error(`[cron] 发送失败 ${u.email}:`, err);
      await pool.query(
        `INSERT INTO email_notifications (user_id, sequence, sent_at, recipient_email, send_status, content, reason)
         VALUES (?, ?, NOW(), ?, 2, ?, 'consecutive_2_days')`,
        [u.id, sequence, u.email, REMINDER_CONTENT]
      );
    }
  }
}

// 每天 20:00 执行
cron.schedule('0 20 * * *', () => {
  console.log('[cron] 执行连续2天未签到提醒');
  sendReminderEmails().catch(console.error);
});

// 手动触发接口（测试用，生产可删除或加鉴权）
app.post('/api/cron/reminder', async (req, res) => {
  try {
    await sendReminderEmails();
    res.json({ code: 0, message: '已执行' });
  } catch (err) {
    res.status(500).json({ code: 50001, message: err.message });
  }
});

// 启动（必须监听 0.0.0.0 才能被 Sealos 网关访问）
const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, HOST, () => {
  console.log(`[OK] 好着没后端已启动`);
  console.log(`[OK] 监听地址: ${HOST}:${PORT} （0.0.0.0 才能被外网访问）`);
  console.log('签到: POST /api/check-in');
  console.log('健康: GET /api/health');
});
