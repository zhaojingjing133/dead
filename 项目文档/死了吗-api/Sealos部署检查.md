# Sealos 部署 Pending 排查

Public Address 一直 Pending，按下面逐项检查。

---

## 1. 确认服务已启动

在 **DevBox 终端** 执行：

```bash
cd ~/project/项目文档/死了吗-api
npm install
npm start
```

或 `npm run dev`。保持终端不关，看到 `[OK] 好着没后端已启动` 才算启动成功。

---

## 2. 确认监听地址

启动后日志需包含：

```
[OK] 监听地址: 0.0.0.0:8080 （0.0.0.0 才能被外网访问）
```

`.env` 中必须为：

```
HOST=0.0.0.0
PORT=8080
```

若是 `127.0.0.1` 或 `localhost`，外网无法访问。

---

## 3. 确认端口一致

Sealos 网络里配置的端口（8080）必须和 `.env` 的 `PORT=8080` 一致。

---

## 4. DevBox 与部署方式

**若使用 Sealos 应用部署（非 DevBox）：**

- DevBox 只是开发环境，应用部署是独立服务
- 需要在 Sealos 控制台创建/配置应用，把后端代码部署上去
- 镜像或启动命令要能执行 `npm start`，并监听 `0.0.0.0:8080`

**若使用 DevBox 作为运行环境：**

- 在 DevBox 里 `npm start` 后，Sealos 会转发到该实例
- 确保 DevBox 没有休眠或重启导致进程退出

---

## 5. 自检命令

在 DevBox 里执行：

```bash
# 检查进程是否在监听 8080
curl -s http://127.0.0.1:8080/api/health
```

返回 `{"code":0,...}` 表示本机已可访问。

---

## 6. DevBox 和 Sealos 应用的区别

- **DevBox**：开发环境，你 SSH 进去写代码、跑命令
- **Sealos 应用/服务**：单独部署的应用，有独立公网地址

你看到的 Network（端口 8080、Public Address Pending）可能是 **Sealos 应用** 的配置，而不是 DevBox。  
如果是这样，需要：

1. 在 Sealos 控制台找到该应用（如 areyoudead）
2. 配置 **启动命令**：`cd 项目文档/死了吗-api && npm install && npm start`
3. 或使用 Docker 镜像部署，确保容器内监听 `0.0.0.0:8080`

仅在 DevBox 里 `npm start`，不一定能让这个应用的 Public Address 生效。

---

## 7. 仍未解决时

- 在 Sealos 控制台检查该服务/应用是否在运行
- 查看应用日志是否有报错
- 对照 Sealos 官方文档确认应用的部署方式
