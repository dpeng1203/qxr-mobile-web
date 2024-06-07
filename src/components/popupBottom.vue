<template>
  <view>
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff" @change="popupChange">
      <view class="popup-title">
        <view class="title">搜索</view>
        <uni-icons type="closeempty" size="20" @click="handleClose"></uni-icons>
      </view>
      <slot></slot>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    popupChange(e) {
      console.log('当前模式：' + e.type + ',状态：' + e.show)
    },
    toggle() {
      // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
      this.$refs.popup.open('bottom')
    },
    handleClose() {
      this.$refs.popup.close()
    },
  },
}
</script>

<style lang="less" scoped>
.popup-title {
  display: flex;
  align-items: center;
  padding: 30rpx;
  .title {
    flex: 1;
    text-align: center;
    padding-left: 40rpx;
    font-size: 32rpx;
    color: #222222;
    font-family: PingFangSC-Medium;
    font-weight: 500;
  }
}
</style>
