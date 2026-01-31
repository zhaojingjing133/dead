/**
 * 接口基础地址（开发时改为本地或测试环境）
 * 微信小程序需在后台配置 request 合法域名
 */
export const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://your-api-domain.com'
