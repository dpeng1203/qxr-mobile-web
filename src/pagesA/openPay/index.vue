<template>
  <view class="pay">
    <div class="search">
      <input
        type="text"
        class="search-input"
        :placeholder="current == 4 ? '请输入接收方企业' : '请输入确信编号'"
        confirm-type="search"
        @confirm="doSearch"
        v-model="crclNo"
      />
      <span @click="handleSearch">筛选</span>
      <img
        src="/static/search.png"
        alt=""
        class="icon2"
        @click="handleSearch"
      />
      <uni-icons type="search" size="16" class="icon1"></uni-icons>
    </div>
    <view class="tabs">
      <uni-segmented-control
        :current="current"
        :values="items"
        style-type="text"
        :active-color="activeColor"
        @clickItem="onClickItem"
      />
    </view>
    <div class="wrap">
      <div
        class="list"
        v-for="item in list"
        :key="item.crclId"
        @click="handleItem(item)"
      >
        <div class="title">
          <span class="code">{{ item.crclNo }}</span>
          <span class="type"></span>
          <span class="status" v-if="current == 0">可用</span>
          <span class="status blue" v-if="current == 1">支付中</span>
          <span class="status grey" v-if="current == 2">已融资</span>
          <span class="status grey" v-if="current == 3">已支付</span>
          <span class="status red" v-if="current == 4">支付失败</span>
          <span class="status red" v-if="current == 5">已到期</span>
        </div>
        <div class="content">
          <div class="item" v-if="item.payCompanyName">
            <div class="name">支付方：</div>
            <div class="value">{{ item.payCompanyName }}</div>
          </div>
          <div class="item" v-if="item.holdCompanyName">
            <div class="name">接收方：</div>
            <div class="value">{{ item.holdCompanyName }}</div>
          </div>
          <div class="item" v-if="item.kyAmt">
            <div class="name">可用额度(元)：</div>
            <div class="value">{{ publicFun.format(item.kyAmt) }}</div>
          </div>
          <div class="item" v-if="current == 0">
            <div class="name">占用额度(元)：</div>
            <div class="value">{{ publicFun.format(item.zfBlAmt) }}</div>
          </div>
          <div class="item" v-if="item.kyjeAmt">
            <div class="name">可用净额(元)：</div>
            <div class="value">{{ publicFun.format(item.kyjeAmt) }}</div>
          </div>
          <div class="item" v-if="current > 1 && item.crclAmt">
            <div class="name">金额(元)：</div>
            <div class="value">{{ publicFun.format(item.crclAmt) }}</div>
          </div>
          <div class="item" v-if="item.payAmt">
            <div class="name">支付金额(元)：</div>
            <div class="value">{{ publicFun.format(item.payAmt) }}</div>
          </div>
          <div class="item" v-if="item.openCompanyName">
            <div class="name">开立方：</div>
            <div class="value">{{ item.openCompanyName }}</div>
          </div>
          <div class="item">
            <div class="name">承诺付款日：</div>
            <div class="value">
              {{ publicFun.timestampToDateTime(item.acceptDate) }}
            </div>
          </div>
          <div class="item" v-if="item.repaymentStatusText">
            <div class="name">还款状态：</div>
            <div class="value">
              {{ item.repaymentStatusText }}
            </div>
          </div>
          <div class="item" v-if="item.failReason">
            <div class="name">失败原因：</div>
            <div class="value">
              {{ item.failReason }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="list.length == 0" class="no-data">暂无数据~</div>
    </div>
    <popup-bottom ref="popup">
      <view class="popup-content">
        <div class="search-item" v-if="current != 4">
          <uni-section title="开立方" type="line"></uni-section>
          <input
            class="uni-input"
            placeholder="请输入开立方企业"
            v-model="openCompanyName"
          />
        </div>
        <div class="search-item" v-if="current != 3 && current != 4">
          <uni-section title="支付方" type="line"></uni-section>
          <input
            class="uni-input"
            placeholder="请输入支付方企业"
            v-model="payCompanyName"
          />
        </div>
        <div class="search-item">
          <uni-section
            v-if="current == 0 || current == 1 || current == 4 || current == 6"
            title="承诺付款日"
            type="line"
          ></uni-section>
          <uni-section
            v-if="current == 2"
            title="保理日期"
            type="line"
          ></uni-section>
          <uni-section
            v-if="current == 3"
            title="支付日期"
            type="line"
          ></uni-section>
          <uni-section
            title="实际付款日"
            type="line"
            v-if="current == 5"
          ></uni-section>
          <view class="example-body">
            <uni-datetime-picker
              v-model="range"
              return-type="timestamp"
              type="daterange"
              rangeSeparator="至"
            />
          </view>
        </div>
        <button type="primary" class="confirm" @click="handleConfirm">
          确定
        </button>
      </view>
    </popup-bottom>
  </view>
</template>

<script>
import popupBottom from '@/components/popupBottom.vue'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
import { primaryColor } from '@/utils/theme.js'
import {
  availableCrclList,
  payingCrclList,
  financeCrclList,
  payedCrcl,
  findFailedCrclList,
  expireCrclList,
  originalCrclList,
} from '@/api/openPay'
export default {
  components: {
    popupBottom,
  },
  data() {
    return {
      openCompanyName: '',
      payCompanyName: '',
      range: null,
      items: [
        '可用',
        '支付中',
        '已融资',
        '已支付',
        '支付失败',
        '已到期',
        '原始',
      ],
      page: 1,
      current: 0,
      activeColor: primaryColor,
      list: [],
      total: 0,
      crclNo: '',
    }
  },
  onLoad() {
    this.getList()
  },
  onShareAppMessage,
  onShareTimeline,
  onReachBottom() {
    console.log('onReachBottom')
    if (this.total > this.list.length) {
      this.page++
      this.getList()
    }
  },
  methods: {
    doSearch() {
      this.page = 1
      this.list = []
      this.getList()
    },
    handleItem(item) {
      const params = encodeURIComponent(JSON.stringify(item))
      if (this.current == 2) {
        uni.navigateTo({
          url: `/pagesA/openPay/financeDetail?projId=${item.projId}&flag=2&type=1`,
        })
      } else if (this.current == 0 || this.current == 1) {
        uni.navigateTo({
          url: `/pagesA/openPay/detail?params=${params}`,
        })
      }
    },
    handleConfirm() {
      this.page = 1
      this.getList()
      this.$refs.popup.handleClose()
    },
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
        this.page = 1
        this.crclNo = ''
        this.openCompanyName = ''
        this.payCompanyName = ''
        this.range = null
        this.list = []
        this.getList()
      }
    },
    handleSearch() {
      this.$refs.popup.toggle()
    },
    getParams() {
      const params = {
        page: this.page,
        pageRow: 20,
        crclNo: this.crclNo,
        openCompanyName: this.openCompanyName,
        payCompanyName: this.payCompanyName,
      }
      const startDateTime = this.range && this.range[0] ? this.range[0] : ''
      // 包含当天时间
      const endDateTime = this.range && this.range[1] ? this.range[1] : ''
      if (this.current == 1) {
        params.policyOrder = 99
      }
      if (this.current == 2) {
        // 保理日期
        params.startFactorDate = startDateTime
        params.endFactorDate = endDateTime
      } else if (this.current == 3) {
        // 支付日期
        params.startPayDate = startDateTime
        params.endPayDate = endDateTime
      } else if (this.current == 5) {
        // 实际付款日
        params.startRealPaymentDate = startDateTime
        params.endRealPaymentDate = endDateTime
      } else {
        params.startAcceptDate = startDateTime
        params.endAcceptDate = endDateTime
      }
      if (this.current == 4) {
        params.holdCompanyName = this.crclNo
      }
      return params
    },
    getList() {
      let myPromise
      if (this.current == 0) {
        myPromise = availableCrclList(this.getParams())
      } else if (this.current == 1) {
        myPromise = payingCrclList(this.getParams())
      } else if (this.current == 2) {
        myPromise = financeCrclList(this.getParams())
      } else if (this.current == 3) {
        myPromise = payedCrcl(this.getParams())
      } else if (this.current == 4) {
        myPromise = findFailedCrclList(this.getParams())
      } else if (this.current == 5) {
        myPromise = expireCrclList(this.getParams())
      } else if (this.current == 6) {
        myPromise = originalCrclList(this.getParams())
      }
      myPromise
        .then((res) => {
          if (this.page == 1) {
            this.list = res.data
          } else {
            thi.list = [...this.list, res.data]
          }
          this.total = res.total
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getPayingCrclList() {
      payingCrclList(this.getParams())
        .then((res) => {
          if (this.page == 1) {
            this.list = res.data
          } else {
            thi.list = [...this.list, ...res.data]
          }
          this.total = res.total
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getFinanceCrclList() {
      financeCrclList(this.getParams())
        .then((res) => {
          if (this.page == 1) {
            this.list = res.data
          } else {
            thi.list = [...this.list, res.data]
          }
          this.total = res.total
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
.pay {
  background: #f2f2f2;
  min-height: 100vh;
}

.search {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 100rpx;
  position: relative;
  font-size: 28rpx;
  color: #222;
  .search-input {
    flex: 1;
    height: 60rpx;
    padding: 0 30rpx 0 60rpx;
    background: #fff;
    border-radius: 30rpx;
    margin-right: 20rpx;
  }
  .icon1 {
    position: absolute;
    top: 35rpx;
    left: 50rpx;
  }

  .icon2 {
    width: 28rpx;
    height: 28rpx;
    margin-left: 8rpx;
  }
}
.tabs {
  background: #fff;
}
.wrap {
  .list {
    margin-top: 20rpx;
    padding: 0 30rpx 30rpx;
    background: #fff;
    .title {
      height: 88rpx;
      display: flex;
      align-items: center;
      color: #222;
      font-size: 28rpx;
      border-bottom: 1px solid #f2f2f2;
      .code {
        margin-right: 12rpx;
      }
      .type {
        color: #666;
        flex: 1;
      }
      .status {
        height: 40rpx;
        line-height: 40rpx;
        padding: 0 10rpx;
        font-size: 26rpx;
        color: #3bc14e;
        background: rgba(59, 193, 78, 0.16);
      }
      .blue {
        color: #2c7ffa;
        background: rgba(44, 127, 250, 0.16);
      }
      .grey {
        color: #666666;
        background: rgba(153, 153, 153, 0.16);
      }
      .red {
        color: #ff5555;
        background: rgba(255, 85, 85, 0.16);
      }
    }
    .content {
      .item {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        .name {
          width: 188rpx;
          color: #999;
          font-size: 28rpx;
        }
        .value {
          flex: 1;
          color: #222;
          font-size: 28rpx;
        }
      }
    }
  }
}
.popup-content {
  padding: 0 30rpx 30rpx;
  .search-item {
    margin-bottom: 30rpx;
  }
  .uni-input {
    height: 68rpx;
    background: #f2f2f2;
    border-radius: 8rpx;
    padding: 0 30rpx;
  }
  .confirm {
    background: @primary;
    margin-top: 50rpx;
  }
}
</style>
