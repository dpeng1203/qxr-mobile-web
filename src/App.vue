<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    uni.setLocale('zh-Hans') // 简体中文
  },
  onShow: function () {
    console.log('App Show')
    // #ifdef H5
    uni.onWindowResize((res) => {
      let currentWidth = uni.getStorageSync('currentWindowWidth')
      console.log('currentWidth', currentWidth)
      console.log('windowWidth', res.size.windowWidth)
      if (res.size.windowWidth != currentWidth) {
        uni.setStorageSync('currentWindowWidth', res.size.windowWidth)
        this.$router.go(0)
      }
    })
    // #endif
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
.segmented-control {
  overflow: auto !important;
  height: 90rpx !important;
}
.segmented-control__item {
  min-width: 136rpx !important;
}
/*每个页面公共css */
view,
div {
  font-family: PingFang-SC-Heavy;
  font-size: 30rpx;
}
.no-data {
  text-align: center;
  padding: 30rpx;
  color: #a8a7a7;
}
</style>
