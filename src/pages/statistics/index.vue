<template>
  <div class="statistics">
    <div class="box">
      <div class="title">确信额度</div>
      <div class="content">
        <div class="charts-box">
          <qiun-data-charts
            v-if="showChart1"
            type="ring"
            :opts="opts"
            :chartData="chartData"
          />
        </div>
        <div class="wrap">
          <div class="sub-title">总额度(元)</div>
          <div class="sum">{{ publicFun.format(limitInfo.totalShare) }}</div>
          <div class="item">
            <span class="color"></span>
            <span class="name">已用额度(元)</span>
            <span class="value">{{
              publicFun.format(limitInfo.totalCrcl)
            }}</span>
          </div>
          <div class="item">
            <span class="color color1"></span>
            <span class="name">可用额度(元)</span>
            <span class="value">{{
              publicFun.format(limitInfo.totalAvailable)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="title">融资中项目</div>
      <div class="content">
        <div class="charts-box">
          <qiun-data-charts
            v-if="showChart2"
            type="ring"
            :opts="opts"
            :chartData="chartData1"
          />
        </div>
        <div class="wrap">
          <!-- <div class="sub-title">总额度(元)</div>
          <div class="sum">638849345.00</div> -->
          <div class="item">
            <span class="color"></span>
            <span class="name">申请中笔数(笔)</span>
            <span class="value">{{ statisticsInfo.financingApplyNum }}</span>
          </div>
          <div class="item">
            <span class="color color1"></span>
            <span class="name">审核中笔数(笔)</span>
            <span class="value">{{ statisticsInfo.financingAuditNum }}</span>
          </div>
          <div class="item">
            <span class="color color2"></span>
            <span class="name">待放款笔数(笔)</span>
            <span class="value">{{ statisticsInfo.pendingLoan }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="title">确信统计</div>
      <div class="content">
        <div class="charts-box">
          <qiun-data-charts
            v-if="showChart3"
            type="ring"
            :opts="opts"
            :chartData="chartData2"
          />
        </div>
        <div class="wrap">
          <div class="item">
            <span class="color"></span>
            <span class="name">可用确信(元)</span>
            <span class="value">{{
              publicFun.format(amountInfo.availableCredit)
            }}</span>
          </div>
          <div class="item">
            <span class="color color1"></span>
            <span class="name">已支付(元)</span>
            <span class="value">{{
              publicFun.format(amountInfo.paidAmount)
            }}</span>
          </div>
          <div class="item">
            <span class="color color2"></span>
            <span class="name">已融资(元)</span>
            <span class="value">{{
              publicFun.format(amountInfo.financingAmount)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qiunDataCharts from '@/components/qiun-data-charts/qiun-data-charts1'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
import {
  crclLimit,
  crclStatistics,
  financingStatisticsIn,
} from '@/api/statistics'
export default {
  comments: {
    qiunDataCharts,
  },
  data() {
    return {
      // eopts 配置项
      opts: {
        rotate: false,
        rotateLock: false,
        color: ['#00C7FF', '#5477FF', '#00E3B0'],
        padding: [0, 0, 0, 0],
        dataLabel: false,
        enableScroll: false,
        legend: {
          show: false,
          position: 'right',
          lineHeight: 25,
        },
        title: {
          name: '',
          fontSize: 15,
          color: '#666666',
        },
        subtitle: {
          name: '',
          fontSize: 25,
          color: '#7cb5ec',
        },
        extra: {
          ring: {
            ringWidth: 20,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            linearType: 'custom',
          },
        },
      },
      showChart1: false,
      showChart2: false,
      showChart3: false,
      limitInfo: {},
      statisticsInfo: {},
      amountInfo: {},
      // uchart,data数据
      chartData: {
        series: [
          {
            data: [
              // { name: "已用额度", value: 0 },
              // { name: "可用额度", value: 0 },
            ],
          },
        ],
      },

      chartData1: {
        series: [
          {
            data: [
              // { name: "申请中笔数(笔)", value: 0 },
              // { name: "审核中笔数(笔)", value: 0 },
              // { name: "待放款笔数(笔)", value: 0 },
            ],
          },
        ],
      },
      chartData2: {
        series: [
          {
            data: [
              // { name: "可用确信(元)", value: 0 },
              // { name: "已支付(元)", value: 0 },
              // { name: "已融资(元)", value: 0 },
            ],
          },
        ],
      },
    }
  },
  onShareAppMessage,
  onShareTimeline,
  onLoad() {
    this.getLimit()
    this.getStatistics()
    this.getStatisticsIn()
  },
  methods: {
    getLimit() {
      crclLimit({
        financingRatioYear: 1,
        receiverRankingYear: 1,
        openRankingYear: 1,
        companyType: 1,
      })
        .then((res) => {
          this.limitInfo = res.data
          this.chartData.series[0].data = [
            { name: '已用额度', value: res.data.totalCrcl || 0 },
            { name: '可用额度', value: res.data.totalAvailable || 0 },
          ]
          this.showChart1 = true
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getStatisticsIn() {
      financingStatisticsIn({
        financingRatioYear: 1,
        receiverRankingYear: 1,
        openRankingYear: 1,
        companyType: 1,
      })
        .then((res) => {
          this.statisticsInfo = res.data
          this.chartData1.series[0].data = [
            { name: '申请中笔数(笔)', value: res.data.financingApplyNum || 0 },
            { name: '审核中笔数(笔)', value: res.data.financingAuditNum || 0 },
            { name: '待放款笔数(笔)', value: res.data.pendingLoan || 0 },
          ]
          this.showChart2 = true
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getStatistics() {
      crclStatistics({
        financingRatioYear: 1,
        receiverRankingYear: 1,
        openRankingYear: 1,
        companyType: 1,
      })
        .then((res) => {
          this.amountInfo = res.data
          this.chartData2.series[0].data = [
            { name: '可用确信(元)', value: res.data.availableCredit || 0 },
            { name: '已支付(元)', value: res.data.paidAmount || 0 },
            { name: '已融资(元)', value: res.data.financingAmount || 0 },
          ]
          this.showChart3 = true
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style lang="less" scoped>
.statistics {
  background: #f2f2f2;
  padding: 20rpx;
  min-height: 100vh;
  .title {
    font-family: PingFang-SC-Bold;
    font-weight: 700;
    font-size: 32rpx;
    color: #222222;
    padding-bottom: 20rpx;
  }
  .box {
    padding: 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    box-shadow: 1rpx 6rpx 20rpx 0 #66666614;
    border-radius: 8rpx;
  }
  .content {
    display: flex;
    align-items: center;
  }
  .charts-box {
    width: 260rpx;
    height: 260rpx;
  }
  .wrap {
    flex: 1;
    font-size: 26rpx;
    color: #999999;
    margin-left: 10rpx;
    .sub-title {
      color: #2f2f2f;
    }
    .sum {
      font-weight: 900;
      font-size: 38rpx;
      color: #2f2f2f;
      padding-bottom: 20rpx;
    }
    .item {
      display: flex;
      align-items: center;
      margin-top: 16rpx;
      font-size: 26rpx;
      .color {
        width: 16rpx;
        height: 16rpx;
        border-radius: 2rpx;
        background: #00c7ff;
        margin-right: 12rpx;
      }
      .color1 {
        background: #5477ff;
      }
      .color2 {
        background: #00e3b0;
      }
      .name {
        flex: 1;
      }
    }
  }
}
</style>
