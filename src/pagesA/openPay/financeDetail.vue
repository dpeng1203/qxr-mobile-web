<template>
  <div class="open-detail">
    <div class="bg"></div>
    <div class="box-wrap">
      <div class="box">
        <div class="title">保理申请信息</div>
        <div class="item">
          <div class="name">投资方式：</div>
          <div class="desc">
            {{
              projectInvestPlan.investWay == 1
                ? '保理'
                : projectInvestPlan.investWay == 2
                ? '债权转让'
                : projectInvestPlan.investWay == 3
                ? 'ABS'
                : ''
            }}
          </div>
        </div>
        <div class="item">
          <div class="name">投资方案编号：</div>
          <div class="desc">{{ projectInvestPlan.investmentPlanCode }}</div>
        </div>
        <div class="item">
          <div class="name">保理申请单编号：</div>
          <div class="desc">{{ projectMessage.proNumber }}</div>
        </div>
        <div class="item">
          <div class="name">确信编号：</div>
          <div class="desc">{{ projectMessage.crclNo }}</div>
        </div>
        <div class="item">
          <div class="name">凭证金额(元)：</div>
          <div class="desc">{{ publicFun.format(projectMessage.crclAmt) }}</div>
        </div>
        <div class="item">
          <div class="name">融资金额(元)：</div>
          <div class="desc">
            {{ publicFun.format(projectMessage.applyValue) }}
          </div>
        </div>
        <div class="item">
          <div class="name">综合融资息费率(年化)：</div>
          <div class="desc">{{ projectMessage.factorTotalRate }}</div>
        </div>
        <div class="item">
          <div class="name">综合融资息费总额(元)：</div>
          <div class="desc">
            {{ publicFun.format(projectMessage.factorCostTotal) }}
          </div>
        </div>
        <div class="item">
          <div class="name">融资净额(元)：</div>
          <div class="desc">
            {{ publicFun.format(projectMessage.factorNetFinValue) }}
          </div>
        </div>
        <div class="item">
          <div class="name">融资路径：</div>
          <div class="desc">{{ projectInvestPlan.financingPathName }}</div>
        </div>
        <div class="item">
          <div class="name">融资付息模式：</div>
          <div class="desc">
            {{
              projectMessage.financePaymentPattern == 1
                ? '买方付息'
                : '融资人付息'
            }}
          </div>
        </div>
        <div class="item">
          <div class="name">投资方：</div>
          <div class="desc">{{ projectMessage.custName }}</div>
        </div>
        <div class="item" v-if="projectMessage.loanUse">
          <div class="name">借款用途：</div>
          <div class="desc">{{ projectMessage.loanUse }}</div>
        </div>
      </div>
      <div class="box">
        <div class="title">预计息费详情</div>
        <div class="content">
          <div class="table">
            <div class="td">预计息费总额(元)</div>
          </div>
          <div class="table">
            <div class="td price">
              {{ publicFun.format(projectMessage.applyCostTotal) }}
            </div>
          </div>
          <div class="table">
            <div class="tr1 color-999">息费名称</div>
            <div class="tr2 color-999">预计费率(%)</div>
            <div class="tr3 color-999">预计息费(元)</div>
          </div>
          <div
            class="table"
            v-for="item in projectMessage.listChargeFeeDto"
            :key="item.chargeNo"
          >
            <div class="tr tr1">{{ item.chargeName }}</div>
            <div class="tr tr2">
              {{ item.chargeExpectRate === null ? '' : item.chargeExpectRate }}
            </div>
            <div class="tr tr3">
              {{ publicFun.format(item.chargeExpectValue) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="title">实际息费详情</div>
        <div class="content">
          <div class="table">
            <div class="td">实际息费总额(元)</div>
          </div>
          <div class="table">
            <div class="td price">
              {{ publicFun.format(projectMessage.factorCostTotal) }}
            </div>
          </div>
          <div class="table">
            <div class="tr1 color-999">息费名称</div>
            <div class="tr2 color-999">实际费率(%)</div>
            <div class="tr3 color-999">实际金额(元)</div>
          </div>
          <div
            class="table"
            v-for="item in projectMessage.listChargeFeeDto"
            :key="item.chargeNo"
          >
            <div class="tr tr1">{{ item.chargeName }}</div>
            <div class="tr tr2">
              {{ item.chargeRealRate === null ? '' : item.chargeRealRate }}
            </div>
            <div class="tr tr3">
              {{ publicFun.format(item.chargeRealValue) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="title">审核信息</div>
        <div class="list" v-for="item in auditList" :key="item.auditDate">
          <div class="item">
            <div class="name info-name">操作人</div>
            <div class="desc">{{ item.auditName }}</div>
          </div>
          <div class="item">
            <div class="name info-name">操作时间</div>
            <div class="desc">{{ item.auditDate }}</div>
          </div>
          <div class="item">
            <div class="name info-name">审核意见：</div>
            <div class="desc">{{ item.auditReason }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { financeDetail } from '@/api/openPay'
export default {
  data() {
    return {
      options: {},
      auditList: [],
      projectMessage: {},
      projectInvestPlan: {},
    }
  },
  onLoad(options) {
    console.log(options)
    this.options = options
    this.getDetail()
  },
  methods: {
    getDetail() {
      financeDetail(this.options)
        .then((res) => {
          this.auditList = res.data.auditList
          this.projectMessage = res.data.projectMessage
          this.projectInvestPlan = res.data.projectInvestPlan
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
    padding: 0 30rpx 30rpx;
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
      margin-top: 20rpx;
      .name {
        font-size: 28rpx;
        width: 300rpx;
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
    .table {
      display: flex;
      align-items: center;
      font-size: 28rpx;

      .td {
        flex: 1;
        font-size: 28rpx;
      }
      .tr {
        margin-top: 12rpx;
        font-size: 28rpx;
      }
      .tr1 {
        width: 200rpx;
        font-size: 28rpx;
      }
      .tr2 {
        width: 200rpx;
        font-size: 28rpx;
      }
      .tr3 {
        flex: 1;
        font-size: 28rpx;
      }
      // .tr4 {
      //   flex: 1;
      //   font-size: 28rpx;
      // }
      .price {
        font-weight: 700;
        font-size: 42rpx;
        color: #222222;
        margin: 12rpx 0 60rpx;
      }
      .color-999 {
        color: #999;
      }
    }
  }
}
</style>
