import { BASE_URL } from './config.js'

/**
 * 统一请求封装
 */
export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res.data || { message: '请求失败' })
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 每日签到接口
 * @param {Object} data - { nickname: 姓名, email: 联系人邮箱 }
 */
export function checkIn(data) {
  return request({
    url: '/api/check-in',
    method: 'POST',
    data
  })
}
