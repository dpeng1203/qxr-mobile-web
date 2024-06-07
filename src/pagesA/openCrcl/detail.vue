<template>
  <div class="open-detail">
    <div class="bg"></div>
    <div class="box-wrap">
      <div class="box">
        <div class="content">
          <div class="item">
            <div class="name">付款承诺函编号：</div>
            <div class="desc">{{ obj.applyNo }}</div>
          </div>
          <div class="item">
            <div class="name">接收方：</div>
            <div class="desc">{{ obj.holdCompanyName }}</div>
          </div>
          <div class="item">
            <div class="name">金额(元)：</div>
            <div class="desc">{{ publicFun.format(obj.crclAmt) }}</div>
          </div>
          <div class="item">
            <div class="name">承诺付款日：</div>
            <div class="desc">
              {{ publicFun.timestampToDateTime(obj.acceptDate) }}
            </div>
          </div>
          <div class="item">
            <div class="name">融资付息模式：</div>
            <div class="desc">{{ financModel[obj.financePaymentPattern] }}</div>
          </div>
          <div class="item">
            <div class="name">额度名称：</div>
            <div class="desc">{{ obj.limitSource }}</div>
          </div>
          <div class="item" v-if="obj.active == 0">
            <div class="name">状态：</div>
            <div class="desc">{{ obj.statusStr }}</div>
          </div>
          <div class="item" v-if="obj.active == 0">
            <div class="name">经办人：</div>
            <div class="desc">{{ obj.openOperName }}</div>
          </div>
          <div class="item" v-if="obj.active == 2">
            <div class="name">经办人：</div>
            <div class="desc">{{ obj.operatorName }}</div>
          </div>
          <div class="item" v-if="obj.active == 2">
            <div class="name">审核人：</div>
            <div class="desc">{{ obj.auditName }}</div>
          </div>
          <div class="item" v-if="obj.active == 2">
            <div class="name">审核时间：</div>
            <div class="desc">
              {{ publicFun.timestampToDateTime(obj.auditDate, true) }}
            </div>
          </div>
          <div class="item" v-if="obj.active == 2">
            <div class="name">失败原因：</div>
            <div class="desc">{{ obj.failReason }}</div>
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
      obj: null,
      financModel: {
        0: "融资人付息",
        1: "买方付息",
      },
    };
  },
  onLoad(options) {
    if ("params" in options) {
      this.obj = JSON.parse(decodeURIComponent(options.params));
      console.log(this.obj);
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
    .title {
      height: 85rpx;
      line-height: 85rpx;
      border-bottom: 1px solid #ebebeb;
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
