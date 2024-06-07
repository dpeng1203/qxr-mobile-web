<template>
  <div class="open-detail">
    <div class="bg"></div>
    <div class="box-wrap">
      <div class="box">
        <div class="title">基础信息</div>
        <div class="content">
          <div class="item">
            <div class="name">确信编号：</div>
            <div class="desc">{{ repayInfo.crclNo }}</div>
          </div>
          <div class="item">
            <div class="name">承诺付款日：</div>
            <div class="desc">
              {{ publicFun.timestampToDateTime(repayInfo.acceptDate) }}
            </div>
          </div>
          <div class="item">
            <div class="name">金额(元)：</div>
            <div class="desc">{{ publicFun.format(repayInfo.crclAmt) }}</div>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="title">还款明细</div>
        <div class="content">
          <div class="item sub-title">
            <div class="num">序号</div>
            <div class="in-name">最终持有方</div>
            <div class="price">最终持有金额(元)</div>
          </div>
          <div class="item" v-for="(item, index) in repayDetail" :key="index">
            <div class="num">{{ index + 1 }}</div>
            <div class="in-name">{{ item.recivename }}</div>
            <div class="price">{{ publicFun.format(item.crclAmt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { repayInfo } from "@/api/openCrcl";
export default {
  data() {
    return {
      crclNo: "",
      repayInfo: {},
      repayDetail: [],
    };
  },
  onLoad(options) {
    this.crclNo = options.crclNo;
    this.getDetail(this.crclNo);
  },
  methods: {
    getDetail(crclNo) {
      repayInfo({ crclNo: crclNo })
        .then((res) => {
          this.repayInfo = res.data.openInfoPo;
          this.repayDetail = res.data.repayList || []; // 还款明细
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
    padding: 0 30rpx 30rpx;
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
      font-size: 28rpx;
      .name {
        font-size: 28rpx;
        width: 224rpx;
        color: #999;
      }
      .desc {
        font-size: 28rpx;
      }
      .num {
        width: 96rpx;
        flex-shrink: 0;
      }
      .in-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .price {
        width: 250rpx;
      }
    }
    .sub-title {
      color: #999;
    }
  }
}
</style>
