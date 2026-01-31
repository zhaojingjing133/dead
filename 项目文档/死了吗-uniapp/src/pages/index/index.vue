<template>
  <view class="page">
    <view class="header">
      <text class="title">死了吗</text>
      <text class="subtitle">每日签到，连续 2 天未签将邮件提醒</text>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">姓名</text>
        <input
          v-model="nickname"
          class="input"
          type="text"
          placeholder="请输入您的姓名"
          placeholder-class="placeholder"
        />
      </view>
      <view class="form-item">
        <text class="label">联系人邮箱</text>
        <input
          v-model="email"
          class="input"
          type="text"
          placeholder="用于接收未签到提醒"
          placeholder-class="placeholder"
        />
      </view>
    </view>

    <view class="checkin-wrap">
      <button
        class="btn-checkin"
        :class="{ disabled: loading }"
        :disabled="loading"
        @click="onCheckIn"
      >
        <text class="btn-text">今日签到</text>
      </button>
    </view>

    <view v-if="tip" class="tip" :class="tipType">{{ tip }}</view>
  </view>
</template>

<script>
import { checkIn } from '@/common/request.js'

export default {
  data() {
    return {
      nickname: '',
      email: '',
      loading: false,
      tip: '',
      tipType: 'success' // success | error
    }
  },
  methods: {
    async onCheckIn() {
      const name = (this.nickname || '').trim()
      const mail = (this.email || '').trim()

      if (!name) {
        this.showTip('请输入姓名', 'error')
        return
      }
      if (!mail) {
        this.showTip('请输入联系人邮箱', 'error')
        return
      }
      // 简单邮箱格式校验
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailReg.test(mail)) {
        this.showTip('请输入正确的邮箱格式', 'error')
        return
      }

      this.loading = true
      this.tip = ''
      try {
        await checkIn({
          nickname: name,
          email: mail
        })
        this.showTip('签到成功')
      } catch (e) {
        const msg = (e && e.message) ? e.message : '签到失败，请稍后重试'
        this.showTip(msg, 'error')
      } finally {
        this.loading = false
      }
    },
    showTip(text, type = 'success') {
      this.tip = text
      this.tipType = type
      setTimeout(() => {
        this.tip = ''
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 60rpx 48rpx;
  box-sizing: border-box;
  background-color: #ffffff;
}

.header {
  text-align: center;
  margin-bottom: 80rpx;
  .title {
    display: block;
    font-size: 52rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 16rpx;
  }
  .subtitle {
    font-size: 26rpx;
    color: #666;
  }
}

.form {
  margin-bottom: 100rpx;
  .form-item {
    margin-bottom: 40rpx;
    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
    }
    .input {
      height: 88rpx;
      padding: 0 24rpx;
      background: #f5f5f5;
      border-radius: 16rpx;
      font-size: 30rpx;
      color: #333;
    }
    .placeholder {
      color: #999;
    }
  }
}

.checkin-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320rpx;
}

.btn-checkin {
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #667eea, #764ba2);
  box-shadow: 0 16rpx 48rpx rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  &::after {
    border: none;
  }
  .btn-text {
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
  }
  &.disabled {
    opacity: 0.7;
  }
}

.tip {
  position: fixed;
  left: 48rpx;
  right: 48rpx;
  bottom: 120rpx;
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  text-align: center;
  &.success {
    background: #e8f5e9;
    color: #2e7d32;
  }
  &.error {
    background: #ffebee;
    color: #c62828;
  }
}
</style>
