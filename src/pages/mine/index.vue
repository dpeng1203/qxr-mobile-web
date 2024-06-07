<template>
  <view class="mine">
    <view class="user">
      <view class="logo">
        <img :src="headPhoto" alt="" v-if="headPhoto" />
        <img v-else src="/static/user.png" alt="" />
      </view>
      <view class="info">
        <view class="item"> {{ info.employeeName }} </view>
        <view class="item">
          {{
            info.mobile
              ? info.mobile.substring(0, 3) + '****' + info.mobile.substring(7)
              : ''
          }}
        </view>
      </view>
    </view>
    <view>
      <view class="wrap">
        <view class="item">
          <view class="name">当前登录企业</view>
          <view class="desc">{{ info.companyName }}</view>
        </view>
        <view class="item">
          <view class="name">企业角色</view>
          <view class="desc">{{ info.companyRole }}</view>
        </view>
        <view class="item">
          <view class="name">邮箱</view>
          <view class="desc">{{ email }}</view>
        </view>
      </view>
    </view>
    <view class="login-btn" @click="handleClick">退出登录</view>
  </view>
</template>

<script>
import { findCompanyUserInfo, logout, queryUserBase } from '@/api/login'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
export default {
  data() {
    return {
      headPhoto: '',
      email: '',
      info: {},
    }
  },
  // onLoad() {
  //   this.getInfo();
  // },
  onShow() {
    this.getInfo()
    this.getUserBase()
  },
  onShareAppMessage,
  onShareTimeline,
  methods: {
    handleClick() {
      uni.showModal({
        title: '提示', // 标题
        content: '确定退出登录吗?', // 提示内容
        labelColor: '#3385e3', // 确认按钮文字颜色
        cancelText: '取消', // 取消按钮的文字
        confirmText: '确认', // 确认按钮的文字
        showCancel: true, // 是否显示取消按钮，默认为 true
        confirmColor: '#f55850',
        cancelColor: '#39B54A',
        success(res) {
          if (res.confirm) {
            //点击确定之后执行的代码
            logout()
              .then((res) => {
                uni.removeStorageSync('token')
                uni.showToast({
                  title: '退出成功！',
                })
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/login/index',
                  })
                }, 1000)
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            //点击取消之后执行的代码
          }
        },
      })
    },
    getInfo() {
      findCompanyUserInfo({ platformType: 1 })
        .then((res) => {
          this.info = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getUserBase() {
      queryUserBase()
        .then((res) => {
          this.email = res.data.email
          this.headPhoto = res.data.headPhoto
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style lang="less" scoped>
@import url(../../theem.less);
.mine {
  padding-bottom: 100rpx;
  .user {
    display: flex;
    align-items: center;
    padding-top: 60rpx;
    .logo {
      width: 260rpx;
      text-align: center;
      img {
        width: 156rpx;
        height: 156rpx;
        border-radius: 50%;
      }
    }
    .info {
      margin-left: 30rpx;
      .item {
        line-height: 50rpx;
      }
    }
  }
  .wrap {
    padding: 60rpx 30rpx;
    .item {
      display: flex;
      // height: 90rpx;
      padding: 30rpx 0;
      border-top: 1px solid #f2f2f2;
      align-items: flex-start;
      .name {
        width: 200rpx;
        flex-shrink: 0;
      }
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
    margin: 0 auto;
    margin-top: 280rpx;
  }
}
</style>
