# 死了吗项目 - 上传 GitHub 说明

## 一、已完成

- ✅ 创建了 `.gitignore`（已忽略 node_modules、dist 等）
- ✅ 初始化了 Git 仓库

## 二、你需要完成的步骤

### 1. 在 GitHub 创建新仓库

1. 打开 https://github.com/new
2. 仓库名填写：`simale` 或 `死了吗`（建议用拼音 `simale`，避免中文）
3. 选择 **Public**，**不要**勾选 "Add a README"
4. 点击 **Create repository**

### 2. 设置 Git 用户信息（首次使用需执行一次）

在终端执行（**替换成你的真实信息**）：

```bash
cd /Users/mia/cursor/死了吗

git config user.email "你的GitHub邮箱"
git config user.name "你的GitHub用户名"
```

### 3. 提交并上传

```bash
cd /Users/mia/cursor/死了吗

git add .
git commit -m "初始提交"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

**示例**：如果你的 GitHub 用户名是 `mia`，仓库名是 `simale`，则：

```bash
git remote add origin https://github.com/mia/simale.git
```

### 4. 如需输入密码

推送时如果要求输入密码，请使用 **GitHub Personal Access Token**（不再支持账号密码）：
- 打开 GitHub → Settings → Developer settings → Personal access tokens
- 生成新 token，勾选 `repo` 权限
- 用 token 替代密码输入
