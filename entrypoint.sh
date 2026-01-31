#!/bin/bash
# Sealos DevBox 应用启动脚本
# 好着没后端 - 监听 0.0.0.0:8080
cd 项目文档/死了吗-api
npm install --production
export HOST=0.0.0.0
export PORT=8080
exec node server.js
