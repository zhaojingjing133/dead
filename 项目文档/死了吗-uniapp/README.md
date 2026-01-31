# 死了吗 - UniApp 微信小程序

每日签到小程序：用户输入姓名与联系人邮箱，点击「今日签到」向后端提交签到信息；连续 2 天未签到时，系统将向该邮箱发送提醒。

## 怎么运行（微信小程序 mp-weixin）

在项目根目录执行：

```bash
npm install
npm run dev
```

或直接：`npm run dev:mp-weixin`。编译完成后，用**微信开发者工具**导入目录 `dist/dev/mp-weixin` 即可在模拟器里看效果。  
（本项目当前仅配置了 **mp-weixin** 与 **H5**，无小红书 uni-mp-xhs 等其它平台。）

## 在微信开发者工具中查看效果

已安装**微信开发者工具**时，可按下面文档操作，在模拟器中预览效果：

👉 **[在微信开发者工具中查看效果.md](./在微信开发者工具中查看效果.md)**

- **推荐**：用 **HBuilderX** 打开本项目，菜单「运行」→「运行到小程序模拟器」→「微信开发者工具」，自动编译并打开。
- **备选**：命令行执行 `npm run dev:mp-weixin` 后，用微信开发者工具**导入**编译输出目录（如 `dist/dev/mp-weixin`）。

## 技术栈

- **UniApp**（Vue 2）
- 发布平台：**微信小程序**（可同时跑 H5 等）

## 项目结构

```
死了吗-uniapp/
├── pages/
│   └── index/
│       └── index.vue    # 唯一页面：姓名、邮箱、今日签到按钮
├── common/
│   ├── config.js        # 接口 BASE_URL 配置
│   └── request.js       # 请求封装 + 签到接口
├── static/
├── App.vue
├── main.js
├── manifest.json        # 应用配置（含 mp-weixin）
├── pages.json           # 页面路由
├── uni.scss
└── index.html           # H5 入口
```

## 页面功能

1. **姓名**：单行输入，必填。
2. **联系人邮箱**：单行输入，必填，用于接收未签到提醒；前端做简单格式校验。
3. **今日签到**：大尺寸圆形按钮，点击后调用后端 `POST /api/check-in`，请求体为 `{ nickname, email }`。签到中按钮禁用，成功后提示「签到成功」，失败提示错误信息。

## 接口约定

- **签到**：`POST /api/check-in`  
  - Body: `{ "nickname": "用户姓名", "email": "联系人邮箱" }`  
  - 后端需自行结合微信 openid 做用户识别与签到记录落库（参考项目内《数据库设计文档》）。

## 运行方式

### 方式一：HBuilderX（推荐）

1. 安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)。
2. 菜单「文件」→「打开目录」，选择本目录 `死了吗-uniapp`。
3. 菜单「运行」→「运行到小程序模拟器」→「微信开发者工具」。
4. 首次需在「微信开发者工具」中绑定小程序 AppID（在 `manifest.json` → `mp-weixin` → `appid` 中配置）。

### 方式二：命令行

```bash
cd 死了吗-uniapp
npm install
npm run dev:mp-weixin
```

然后用微信开发者工具打开项目下的 `dist/dev/mp-weixin` 目录（具体以实际生成目录为准）。

## 配置

- **接口地址**：在 `common/config.js` 中修改 `BASE_URL`。开发时可改为本地后端地址（如 `http://localhost:3000`）；微信小程序上线前需在微信公众平台配置 request 合法域名。
- **微信 AppID**：在 `manifest.json` → `mp-weixin` → `appid` 中填写你的小程序 AppID。
