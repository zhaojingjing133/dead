# 好着没 - Sealos 部署说明

已创建 `entrypoint.sh`，用于 Sealos 应用启动。

---

## 部署步骤

### 1. 推送代码

```bash
cd /Users/mia/cursor/死了吗
git add entrypoint.sh Sealos部署说明.md
git commit -m "添加 entrypoint.sh"
git push
```

### 2. 在 Sealos 发布应用

1. 登录 Sealos 控制台
2. 找到你的 **DevBox 项目**（areyoudead）
3. 进入 **发布 (Release)** 流程
4. 确认 `entrypoint.sh` 在项目根目录
5. 完成发布，生成/更新应用

### 3. 部署

1. 在 **应用 (Application)** 或 **部署 (Deploy)** 中
2. 选择刚发布的应用
3. 配置 **端口**：8080
4. 配置 **环境变量**（从 .env 复制）：DB_HOST、DB_USER、DB_PASSWORD、WECHAT_APPID、WECHAT_SECRET、SMTP_* 等
5. 点击部署

### 4. 检查

- 应用状态为 **Running**
- 公网地址可访问
- 访问 `https://你的公网地址/api/health` 应返回 JSON

---

## 若仍使用 DevBox 手动启动

在 DevBox 终端执行：

```bash
cd ~/project
git pull
./entrypoint.sh
```

或：

```bash
cd ~/project/项目文档/死了吗-api
npm install
HOST=0.0.0.0 PORT=8080 node server.js
```

---

**说明**：公网地址指向的是 Sealos 的应用部署，而不是 DevBox 终端。需要按上述步骤完成 **发布 + 部署**，公网才能访问。
