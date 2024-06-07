<template>
  <view class="login-wrap">
    <image class="login-bg" src="/static/login-bg.png"></image>
    <view>
      <view class="title">用信联，联众信</view>
      <view class="tip">您好！欢迎来到信联服务平台</view>
    </view>
    <view
      class="tabs active"
      :class="{ bgleft: active == 1, bgright: active == 2 }"
    >
      <view class="tab" :class="{ active: active == 1 }" @click="active = 1"
        >密码登录 <view class="line" v-show="active == 1"></view>
      </view>
      <view class="tab" :class="{ active: active == 2 }" @click="active = 2"
        >手机验证码登录
        <view class="line" v-show="active == 2"></view>
      </view>
    </view>
    <view class="login">
      <input
        class="login-input"
        type="number"
        placeholder="请输入手机号"
        @blur="handleBlue"
        maxlength="11"
        v-model="phone"
      />
      <view class="code-wrap" v-if="active == 1">
        <input
          type="password"
          class="login-input"
          placeholder="请输入密码"
          v-model="password"
        />
      </view>
      <view class="sms-login" v-if="active == 2">
        <input
          type="number"
          class="login-input"
          placeholder="请输入验证码"
          v-model="code"
        />
        <text class="btn">
          <text v-if="showVerficationBtn" @click.stop="getCode"
            >获取验证码</text
          >
          <text v-else>{{ waitSecond }} s</text>
        </text>
      </view>
      <view class="login-btn" @click="handleLogin">登录</view>
      <view class="pw-wrap">
        <!-- <view>忘记密码</view> -->
        <view></view>
        <view @click="handleRegister">立即注册</view>
      </view>
      <view class="footer">
        <view>本服务由杭州云链趣链数字科技有限公司提供</view>
        <view>客服电话：400 609 8668</view>
      </view>
    </view>
  </view>
</template>

<script>
import { login, sendUserCode, smsLogin } from '@/api/login'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
import md5 from 'js-md5'
export default {
  data() {
    return {
      active: 1,
      phone: '',
      code: '',
      password: '',
      waitSecond: 60,
      //是否展示显示按钮
      showVerficationBtn: true,
    }
  },

  onShareAppMessage,
  onShareTimeline,
  methods: {
    handleRegister() {
      uni.navigateTo({
        url: './register',
      })
    },
    handleBlue() {
      let reg = /^1\d{10}$/
      if (!reg.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        })
      }
    },
    getCode() {
      let reg = /^1\d{10}$/
      if (!reg.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        })
        return
      }
      this.waitSecond = 60
      sendUserCode({
        mobile: this.phone,
        templateType: 4,
        platformType: 1,
      })
        .then((res) => {
          this.showVerficationBtn = false
          let that = this
          let timer = setInterval(function () {
            if (that.waitSecond >= 1) {
              that.waitSecond -= 1
            } else {
              clearInterval(timer)
              that.showVerficationBtn = true
            }
          }, 1000)
          uni.showToast({
            title: res.msg,
            icon: 'none',
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleLogin() {
      let reg = /^1\d{10}$/
      if (!reg.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        })
        return
      }
      if (this.active == 1) {
        if (this.password.trim().length < 8) {
          uni.showToast({
            title: '密码长度不可少于8位！',
            icon: 'none',
          })
          return
        }
        this.login()
      }
      if (this.active == 2) {
        if (!this.code) {
          uni.showToast({
            title: '请输入验证码！',
            icon: 'none',
          })
          return
        }
        this.smsLogin()
      }
    },
    login() {
      login({
        mobile: this.phone,
        password: md5(md5(this.password)),
        platformType: 1,
        facadeAppCode: 'ZQYL-WEB',
        encrypt: true,
        isApp: true,
      })
        .then((res) => {
          this.loginRes(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    smsLogin() {
      smsLogin({
        mobile: this.phone,
        mobileVerifyCode: this.code,
        platformType: 1,
        isApp: true,
      })
        .then((res) => {
          this.loginRes(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    loginRes(res) {
      if (res.data.token) {
        uni.setStorageSync('token', res.data.token)
      }
      const authStatus = res.data.user && res.data.user.authStatus
      if (authStatus == 1) {
        uni.showToast({
          title: '未实名认证，前往认证',
          icon: 'none',
        })
        setTimeout(() => {
          uni.navigateTo({
            url: './userAuth',
          })
        }, 1000)
        return
      }
      if (authStatus == 2) {
        uni.showToast({
          title: '实名认证审核中，请耐心等待！',
          icon: 'none',
        })
        return
      }
      if (authStatus == 4) {
        uni.navigateTo({
          url: './userAuth',
        })
        return
      }
      if (res.data.companyList && res.data.companyList.length > 0) {
        if (authStatus == 3) {
          uni.switchTab({
            url: '../home/index',
          })
        }
      } else {
        uni.showToast({
          title: '请先在电脑端创建企业，并完成认证',
          icon: 'none',
        })
        return
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import url(../../theem.less);
.login-wrap {
  min-height: 100vh;
  /* background-color: #2c7ffa; */
  padding: 0 30rpx;
  position: relative;
  box-sizing: border-box;
}
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 1624rpx;
  z-index: -1;
}
.title {
  font-size: 56rpx;
  font-weight: 900;
  color: #fff;
  padding-top: 260rpx;
  padding-left: 30rpx;
}
.tip {
  font-weight: 500;
  font-size: 36rpx;
  color: #ffffff;
  letter-spacing: 3rpx;
  margin-bottom: 88rpx;
  margin-top: 12rpx;
  padding-left: 30rpx;
}
.tabs {
  border-radius: 30rpx 30rpx 0rpx 0rpx;
  padding-top: 24rpx;
  height: 126rpx;
  display: flex;
  // background: @primary;
  background: rgba(255, 255, 255, 0.2);
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  .tab {
    flex: 1;
    text-align: center;
    color: #fff;
    position: relative;
    .line {
      position: absolute;
      top: 50rpx;
      right: 152rpx;
      width: 40rpx;
      height: 6rpx;
      background: @primary;
      border-radius: 4rpx;
    }
  }
  .active {
    color: @primary;
  }
}
.bgleft {
  background-image: url(../../static/login-left.png);
  background-size: 100% 100%;
}
.bgright {
  background-image: url(../../static/login-right.png);
  background-size: 100% 100%;
}
.login {
  background: #ffffff;
  height: 916rpx;
  overflow: hidden;
  padding: 38rpx 56rpx;
  position: relative;
  .login-input {
    width: 578rpx;
    height: 92rpx;
    padding-left: 30rpx;
    background: #eff3f7;
    border-radius: 8rpx;
    box-sizing: border-box;
  }
  .code-wrap {
    margin-top: 40rpx;
    position: relative;
    font-size: 30rpx;
    .btn {
      position: absolute;
      top: 25rpx;
      right: 30rpx;
      color: #2c7ffa;
      cursor: pointer;
    }
  }
  .login-btn {
    width: 578rpx;
    height: 92rpx;
    line-height: 92rpx;
    background: @primary;
    border-radius: 8rpx;
    text-align: center;
    color: #fff;
    margin-top: 84rpx;
  }
  .pw-wrap {
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #666666;
  }
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 80rpx;
    text-align: center;
    font-size: 24rpx;
    color: #666;
  }
}
.sms-login {
  display: flex;
  align-items: center;
  // height: ;
  margin-top: 40rpx;
  font-size: 30rpx;
  .btn {
    height: 90rpx;
    line-height: 90rpx;
    color: @primary;
    cursor: pointer;
    width: 260rpx;
    text-align: center;
    background: #eff3f7;
    border-radius: 8rpx;
  }
}
</style>
