/**
 * 创建数据库和表（首次运行）
 */
const mysql = require('mysql2/promise');

const config = {
  host: 'dbconn.usw-1.sealos.app',
  port: 34575,
  user: 'root',
  password: 'kvzhr2m4',
};

async function setup() {
  const conn = await mysql.createConnection(config);
  try {
    console.log('连接 Sealos MySQL...');
    await conn.query('CREATE DATABASE IF NOT EXISTS areyoudead DEFAULT CHARSET utf8mb4');
    console.log('数据库 areyoudead 已创建');
    await conn.query('USE areyoudead');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
        openid VARCHAR(64) NOT NULL COMMENT '小程序 openid',
        unionid VARCHAR(64) NULL,
        email VARCHAR(255) NOT NULL,
        nickname VARCHAR(64) NULL,
        avatar_url VARCHAR(512) NULL,
        status TINYINT NOT NULL DEFAULT 1 COMMENT '1正常 0禁用',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_openid (openid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS check_ins (
        id BIGINT NOT NULL AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        check_in_date DATE NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_user_date (user_id, check_in_date),
        KEY idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS email_notifications (
        id BIGINT NOT NULL AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        sequence SMALLINT NOT NULL,
        sent_at DATETIME NOT NULL,
        recipient_email VARCHAR(255) NOT NULL,
        send_status TINYINT NOT NULL DEFAULT 0,
        content TEXT NULL,
        reason VARCHAR(32) DEFAULT 'consecutive_2_days',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_user_sent (user_id, sent_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('表 users, check_ins, email_notifications 已创建');
  } finally {
    await conn.end();
  }
}

setup().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
