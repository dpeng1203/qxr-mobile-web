<template>
  <div class="open-detail">
    <div class="bg"></div>
    <div class="box-wrap">
      <div class="box" v-if="current == 0">
        <div class="title">基本信息</div>
        <div class="item">
          <div class="name">确信编号：</div>
          <div class="desc">{{ obj.crclNo }}</div>
        </div>
        <div class="item">
          <div class="name">开立方：</div>
          <div class="desc">{{ obj.openCompanyName }}</div>
        </div>
        <div class="item">
          <div class="name">投资人：</div>
          <div class="desc">{{ obj.investCompanyName }}</div>
        </div>
        <div class="item">
          <div class="name">确信金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.crclAmt) }}</div>
        </div>
        <div class="item">
          <div class="name">可用净额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.kyjeAmt) }}</div>
        </div>
        <div class="item">
          <div class="name">拟融资金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.planAmt) }}</div>
        </div>
        <div class="item">
          <div class="name">承诺付款日：</div>
          <div class="desc">{{ obj.acceptDate }}</div>
        </div>
        <div class="item">
          <div class="name">到期天数(天)：</div>
          <div class="desc">{{ obj.days }}</div>
        </div>
        <div class="item">
          <div class="name">融资付息模式：</div>
          <div class="desc">
            {{ obj.financePaymentPattern == 1 ? "买方付息" : "融资人付息" }}
          </div>
        </div>
      </div>
      <div class="box" v-if="current == 0">
        <div class="title">询价信息</div>
        <div class="item">
          <div class="name">预计融资利率：</div>
          <div class="desc">{{ obj.rate }}</div>
        </div>
        <div class="item">
          <div class="name">银行手续费率：</div>
          <div class="desc">{{ obj.bankRate }}</div>
        </div>
        <div class="item">
          <div class="name">银行手续费金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.bankChargesValue) }}</div>
        </div>
        <div class="item">
          <div class="name">保荐费率：</div>
          <div class="desc">{{ obj.sponsorRate }}</div>
        </div>
        <div class="item">
          <div class="name">报价人：</div>
          <div class="desc">{{ obj.investCompanyName }}</div>
        </div>
        <div class="item">
          <div class="name">报价日期：</div>
          <div class="desc">{{ obj.quoteTime }}</div>
        </div>
        <div class="item">
          <div class="name">失效日期：</div>
          <div class="desc">{{ obj.expireDate }}</div>
        </div>
      </div>
      <div class="box" v-if="current == 1">
        <div class="title">申请详情</div>
        <div class="item">
          <div class="name">产品类型：</div>
          <div class="desc">确信保理</div>
        </div>
        <div class="item">
          <div class="name">融资金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.applyValue) }}</div>
        </div>
        <div class="item">
          <div class="name">预计融资利率：</div>
          <div class="desc">{{ obj.applyDiscRate }}</div>
        </div>
        <div class="item">
          <div class="name">预计融资净额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.applyNetFinValue) }}</div>
        </div>
        <div class="item">
          <div class="name">接收方：</div>
          <div class="desc">{{ obj.factorCustName }}</div>
        </div>
        <div class="item">
          <div class="name">融资付息模式：</div>
          <div class="desc">
            {{ obj.financePaymentPattern == 1 ? "买方付息" : "融资人付息" }}
          </div>
        </div>
        <div class="item">
          <div class="name">申请日期：</div>
          <div class="desc">{{ obj.applyTime }}</div>
        </div>
        <div class="item">
          <div class="name">状态：</div>
          <div class="desc">{{ obj.auditCount == 0 ? "保存" : "退回" }}</div>
        </div>
      </div>
      <div class="box" v-if="current == 3">
        <div class="title">放款异常详情</div>
        <div class="item" v-if="obj.investWay == 1">
          <div class="name">融资类型：</div>
          <div class="desc">
            {{ obj.factorType == 4 ? "直接保理" : "再保理" }}
          </div>
        </div>
        <div class="item">
          <div class="name">业务单号：</div>
          <div class="desc">{{ obj.proNumber }}</div>
        </div>
        <div class="item">
          <div class="name">确信编号：</div>
          <div class="desc">{{ obj.crclNo }}</div>
        </div>
        <div class="item">
          <div class="name">开立方：</div>
          <div class="desc">{{ obj.openName }}</div>
        </div>
        <div class="item">
          <div class="name">保荐方：</div>
          <div class="desc">{{ obj.sponsorName }}</div>
        </div>
        <div class="item">
          <div class="name">申请方：</div>
          <div class="desc">{{ obj.applyName }}</div>
        </div>
        <div class="item">
          <div class="name">确信金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.crclAmt) }}</div>
        </div>
        <div class="item">
          <div class="name">融资金额(元)：</div>
          <div class="desc">{{ publicFun.format(obj.applyValue) }}</div>
        </div>
        <div class="item">
          <div class="name">融资付息模式：</div>
          <div class="desc">
            {{ obj.financePaymentPattern == 1 ? "买方付息" : "融资人付息" }}
          </div>
        </div>
        <div class="item">
          <div class="name">融资付款日：</div>
          <div class="desc">{{ obj.factorLoanDate }}</div>
        </div>
        <div class="item">
          <div class="name">到期日：</div>
          <div class="desc">{{ obj.expireDate }}</div>
        </div>
        <div class="item">
          <div class="name">状态：</div>
          <div class="desc">
            {{
              obj.status == -1
                ? "已退回"
                : obj.status == 0
                ? "删除"
                : obj.status == 1
                ? "待申请"
                : obj.status == 2
                ? "待审核"
                : obj.status == 3 || obj.status == 4
                ? "待确认"
                : obj.status == 5
                ? "银行处理中"
                : obj.status == 6
                ? "放款成功"
                : "未知"
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { priceDetail } from "@/api/finance";
export default {
  data() {
    return {
      id: "",
      current: "",
      obj: {},
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.current = options.current;
    if (this.id) {
      this.getDetail(this.id);
    }
    if ("params" in options) {
      this.obj = JSON.parse(decodeURIComponent(options.params));
      this.current = this.obj.current;
      console.log(this.obj);
    }
  },
  methods: {
    getDetail(id) {
      priceDetail({ priceId: id })
        .then((res) => {
          this.obj = res.data;
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
        flex-shrink: 0;
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
        width: 166rpx;
        font-size: 28rpx;
      }
      .tr2 {
        width: 96rpx;
        font-size: 28rpx;
      }
      .tr3 {
        width: 198rpx;
        font-size: 28rpx;
      }
      .tr4 {
        flex: 1;
        font-size: 28rpx;
      }
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
