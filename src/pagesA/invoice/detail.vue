<template>
  <div class="open-detail">
    <div class="bg"></div>
    <div class="box-wrap">
      <div class="box">
        <img class="img" :src="obj.filePreviewUrl" alt="" />
        <div class="content">
          <div class="item">
            <div class="name">发票号码：</div>
            <div class="desc">{{ obj.dataNo }}</div>
          </div>
          <div class="item">
            <div class="name">发票代码：</div>
            <div class="desc">{{ obj.dataCode }}</div>
          </div>
          <div class="item">
            <div class="name">销售方：</div>
            <div class="desc">{{ obj.dataBuyer }}</div>
          </div>
          <div class="item">
            <div class="name">开票日期：</div>
            <div class="desc">{{ obj.dataTime }}</div>
          </div>
          <div class="item">
            <div class="name">含税金额(元)：</div>
            <div class="desc">{{ publicFun.format(obj.dataAmt) }}</div>
          </div>
          <div class="item">
            <div class="name">不含税金额(元)：</div>
            <div class="desc">{{ publicFun.format(obj.dataAmtExclTax) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {},
    };
  },
  onLoad(options) {
    if ("params" in options) {
      this.obj = JSON.parse(decodeURIComponent(options.params));
      // this.fileObj = obj;
      // this.imgSrc = obj.previewUrl;
      // this.fileDownloadUrl = obj.downLoadUrl;
      // this.uploadType = obj.uploadType;
    }
  },
};
</script>

<style lang="less" scoped>
@import url(../../theem.less);
.open-detail {
  // position: relative;
  background: #f2f2f2;
  min-height: 100vh;
  .bg {
    width: 750rpx;
    height: 374rpx;
    background-image: linear-gradient(180deg, @primary 0%, #4a93ff00 100%);
  }
  .box-wrap {
    margin-top: -334rpx;
  }
  .box {
    margin-left: 30rpx;
    margin-right: 30rpx;
    padding: 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    color: #222222;
    border-radius: 8rpx;
    .img {
      width: 100%;
      height: 406rpx;
    }
    .item {
      display: flex;
      align-items: center;
      margin-top: 20rpx;
      .name {
        font-size: 28rpx;
        width: 224rpx;
        color: #999;
      }
      .desc {
        font-size: 28rpx;
      }
    }
  }
}
</style>
