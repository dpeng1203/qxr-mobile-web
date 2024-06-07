<template>
  <view class="pay">
    <div class="search">
      <input
        type="text"
        class="search-input"
        confirm-type="search"
        @confirm="doSearch"
        v-model="searchNo"
        placeholder="请输入确信编号"
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
        :key="item.id"
        @click="handleItem(item)"
      >
        <div class="title">
          <span class="code" v-if="current == 0">{{ item.code }}</span>
          <span class="code" v-else>{{ item.crclNo }}</span>
          <span class="type" v-if="item.rate"
            >预计融资利率 {{ item.rate }}%</span
          >
          <span class="type" v-if="item.applyDiscRate"
            >预计融资利率 {{ item.applyDiscRate }}%</span
          >
        </div>
        <div class="content">
          <div class="item" v-if="item.payName">
            <div class="name">支付方：</div>
            <div class="value">{{ item.payName }}</div>
          </div>
          <div class="item" v-if="item.factorCustName">
            <div class="name">接收方：</div>
            <div class="value">{{ item.factorCustName }}</div>
          </div>
          <div class="item" v-if="item.crclAmt">
            <div class="name">确信金额(元)：</div>
            <div class="value">{{ publicFun.format(item.crclAmt) }}</div>
          </div>
          <div class="item" v-if="item.planAmt">
            <div class="name">融资金额(元)：</div>
            <div class="value">{{ publicFun.format(item.planAmt) }}</div>
          </div>
          <div class="item" v-if="item.applyValue">
            <div class="name">融资金额(元)：</div>
            <div class="value">{{ publicFun.format(item.applyValue) }}</div>
          </div>
          <div class="item" v-if="item.openName">
            <div class="name">开立方：</div>
            <div class="value">{{ item.openName }}</div>
          </div>
          <div class="item" v-if="item.acceptDate">
            <div class="name">承诺付款日：</div>
            <div class="value">{{ item.acceptDate }}</div>
          </div>
          <div class="item" v-if="item.applyNetFinValue && current != 2">
            <div class="name">预计融资净额(元)：</div>
            <div class="value">
              {{ publicFun.format(item.applyNetFinValue) }}
            </div>
          </div>
          <div class="item" v-if="item.applyTime">
            <div class="name">申请时间：</div>
            <div class="value">{{ item.applyTime }}</div>
          </div>
          <!-- <div class="item" v-if="item.financePaymentPattern">
            <div class="name">融资付息模式：</div>
            <div class="value">
              {{ item.financePaymentPattern == 1 ? "买方付息" : "融资人付息" }}
            </div>
          </div> -->
        </div>
      </div>
      <div v-if="list.length == 0" class="no-data">暂无数据~</div>
    </div>
    <popup-bottom ref="popup">
      <view class="popup-content">
        <uni-section
          v-if="current == 0"
          title="开立方"
          type="line"
        ></uni-section>
        <uni-section
          v-if="current == 1 || current == 2"
          title="融资金额"
          type="line"
        ></uni-section>
        <uni-section
          v-if="current == 3"
          title="凭证编号"
          type="line"
        ></uni-section>
        <input class="uni-input" v-model="keyword" placeholder="请输入" />
        <uni-section
          v-if="current == 0"
          title="询价日期"
          type="line"
        ></uni-section>
        <uni-section
          v-if="current == 1 || current == 2"
          title="申请时间"
          type="line"
        ></uni-section>
        <uni-section
          v-if="current == 3"
          title="到期日"
          type="line"
        ></uni-section>
        <view class="example-body">
          <uni-datetime-picker
            v-model="range"
            type="daterange"
            rangeSeparator="至"
          />
        </view>
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
  toPriceList,
  priceDetail,
  toPriceList2,
  toPriceList3,
  factorErrList,
} from '@/api/finance'
export default {
  components: {
    popupBottom,
  },
  data() {
    return {
      searchNo: '',
      keyword: '',
      range: null,
      list: [],
      page: 1,
      items: ['询价记录', '申请中', '融资进展', '放款异常'],
      current: 0,
      activeColor: primaryColor,
    }
  },
  onShareAppMessage,
  onShareTimeline,
  onLoad() {
    this.doSearch()
  },
  onReachBottom() {
    console.log('onReachBottom')
    if (this.total > this.list.length) {
      this.page++
      this.getList()
    }
  },
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
        this.page = 1
        this.range = null
        this.keyword = ''
        this.searchNo = ''
        this.list = []
        this.getList()
      }
    },
    handleItem(item) {
      if (this.current == 0) {
        uni.navigateTo({
          url: `/pagesA/finance/detail?id=${item.id}&current=${this.current}`,
        })
      } else if (this.current == 2) {
        uni.navigateTo({
          url: `/pagesA/finance/financeDetail?projId=${item.id}&flag=1`,
        })
      } else {
        const params = encodeURIComponent(
          JSON.stringify({ ...item, current: this.current })
        )
        uni.navigateTo({
          url: `/pagesA/finance/detail?params=${params}`,
        })
      }
    },
    doSearch() {
      this.page = 1
      this.keyword = ''
      this.range = null
      this.list = []
      this.getList()
    },
    getParams() {
      let params = {
        opertion_status: -1,
        startTime: this.range && this.range[0] ? this.range[0] : '',
        endTime: this.range && this.range[1] ? this.range[1] : '',
        page: this.page,
        rows: 10,
      }
      if (this.current == 0) {
        if (this.searchNo) {
          // 2:确信编号查询
          params.type = 2
          params.keyword = this.searchNo
        }
        if (this.keyword) {
          // 4:开立方
          params.type = 4
          params.keyword = this.keyword
        }
      }
      if (this.current == 1 || this.current == 2) {
        params.opertion_status = this.current == 1 ? 10 : 30
        if (this.searchNo) {
          // 1:确信编号查询
          params.type = 1
          params.keyword = this.searchNo
        }
        if (this.keyword) {
          // 2：融资金额
          params.type = 2
          params.keyword = this.keyword
        }
      }
      if (this.current == 3) {
        if (this.searchNo) {
          // 1:确信编号查询
          params.type = 1
          params.keyword = this.searchNo
        }
        if (this.keyword) {
          // 5:开立方
          params.type = 5
          params.keyword = this.keyword
        }
      }
      return params
    },
    getList() {
      let myPromise
      if (this.current == 0) {
        myPromise = toPriceList(this.getParams())
      } else if (this.current == 1) {
        myPromise = toPriceList2(this.getParams())
      } else if (this.current == 2) {
        myPromise = toPriceList3(this.getParams())
      } else if (this.current == 3) {
        myPromise = factorErrList(this.getParams())
      }
      myPromise
        .then((res) => {
          console.log(res)
          if (this.page == 1) {
            if (this.current == 3) {
              this.list = res.data
            } else {
              this.list = res.data.data.result
            }
          } else {
            if (this.current == 3) {
              this.list = [...this.list, ...res.data]
            } else {
              this.list = [...this.list, ...res.data.data.result]
            }
          }
          if (this.current == 3) {
            this.total = res.total
          } else {
            this.total = res.data.data.total
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleConfirm() {
      this.page = 1
      this.searchNo = ''
      this.getList()
      this.$refs.popup.handleClose()
    },
    handleSearch() {
      this.$refs.popup.toggle()
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
    }
    .content {
      .item {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        .name {
          width: 240rpx;
          color: #999;
          font-size: 28rpx;
        }
        .value {
          flex: 1;
          color: #222;
          font-size: 28rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.popup-content {
  padding: 0 30rpx 30rpx;
  .uni-input {
    height: 68rpx;
    background: #f2f2f2;
    border-radius: 8rpx;
    padding: 0 30rpx;
    margin-bottom: 30rpx;
  }
  .confirm {
    background: @primary;
    margin-top: 50rpx;
  }
}
</style>
