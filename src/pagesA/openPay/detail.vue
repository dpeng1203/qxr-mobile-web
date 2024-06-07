<template>
  <div class="open-detail">
    <div class="bg"></div>
    <div class="box-wrap">
      <div class="box">
        <div class="item">
          <div class="name">确信编号：</div>
          <div class="desc">{{ obj.crclNo }}</div>
        </div>
        <div class="item">
          <div class="name">确信金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.crclAmt) }}</div>
        </div>
        <div class="item" v-if="obj.payAmt">
          <div class="name">支付金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.payAmt) }}</div>
        </div>
        <div class="item" v-if="obj.payCompanyName">
          <div class="name">支付方：</div>
          <div class="desc">{{ obj.payCompanyName }}</div>
        </div>
        <div class="item">
          <div class="name">开立方：</div>
          <div class="desc">{{ obj.openCompanyName }}</div>
        </div>
        <div class="item">
          <div class="name">承诺付款日：</div>
          <div class="desc">
            {{ publicFun.timestampToDateTime(obj.acceptDate) }}
          </div>
        </div>
        <div class="item" v-if="obj.kyjeAmt">
          <div class="name">可用净额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.kyjeAmt) }}</div>
        </div>
        <div class="item">
          <div class="name">融资付息模式：</div>
          <div class="desc">{{ obj.financePaymentPatternText }}</div>
        </div>
        <div class="item">
          <div class="name">额度名称：</div>
          <div class="desc">{{ obj.limitSource }}</div>
        </div>
        <div class="item" v-if="obj.operName">
          <div class="name">经办人：</div>
          <div class="desc">{{ obj.operName }}</div>
        </div>
        <div class="item" v-if="obj.operDate">
          <div class="name">经办日期：</div>
          <div class="desc">
            {{ publicFun.timestampToDateTime(obj.operDate) }}
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
  padding-bottom: 60rpx;
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
    .list {
      padding-bottom: 30rpx;
      border-bottom: 1px solid #f2f2f2;
    }
    .title {
      height: 85rpx;
      line-height: 85rpx;
      border-bottom: 1px solid #ebebeb;
    }
    .item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20rpx;
      .name {
        font-size: 28rpx;
        width: 220rpx;
        color: #999;
      }
      .info-name {
        width: 180rpx;
        flex-shrink: 0;
      }
      .desc {
        font-size: 28rpx;
      }
    }
    .content {
      padding-top: 30rpx;
    }
  }
}
</style>
