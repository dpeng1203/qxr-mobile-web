<template>
  <view class="open">
    <view class="card">
      <view class="title">确信额度(元)</view>
      <view class="amt">{{ publicFun.format(limitInfo.totalShare) }}</view>
      <view class="wrap">
        <view
          class="item"
          :class="{
            customWwidth:
              limitInfo.totalCrcl && limitInfo.totalCrcl.length > 10,
          }"
        >
          <view class="sub-title">已用额度(元)</view>
          <view class="sub-amt">{{
            publicFun.format(limitInfo.totalCrcl)
          }}</view>
        </view>
        <view
          class="item"
          :class="{
            customWwidth:
              limitInfo.totalAvailable && limitInfo.totalAvailable.length > 10,
          }"
        >
          <view class="sub-title">可用额度(元)</view>
          <view class="sub-amt">{{
            publicFun.format(limitInfo.totalAvailable)
          }}</view>
        </view>
      </view>
    </view>
    <view>
      <view class="uni-padding-wrap uni-common-mt">
        <uni-segmented-control
          :current="current"
          :values="items"
          style-type="text"
          :active-color="activeColor"
          @clickItem="onClickItem"
        />
      </view>
      <view>
        <view v-if="current === 0" class="search">
          <text
            class="btn"
            :class="{ activeColor: active === 0 }"
            @click="handleTab(0)"
            >开立中</text
          >
          <text
            class="btn"
            :class="{ activeColor: active === 1 }"
            @click="handleTab(1)"
            >已开立</text
          >
          <text
            class="btn"
            :class="{ activeColor: active === 2 }"
            @click="handleTab(2)"
          >
            开立失败
          </text>
          <text class="text" @click="handleSearch">搜索</text>
          <uni-icons type="search" size="15" @click="handleSearch"></uni-icons>
        </view>
        <view v-if="current === 1">
          <view class="content-wrap">
            <view class="title">
              <view class="name">应还金额（元）</view>
              <view class="date" v-if="lastRepayDate"
                >近7日最近还款日
                {{ publicFun.timestampToDateTime(lastRepayDate) }}</view
              >
            </view>
            <view class="price">{{ publicFun.format(totalAmt) }}</view>
          </view>
          <view class="search">
            <uni-data-select
              v-model="value"
              :clear="false"
              :localdata="range"
              @change="change"
            ></uni-data-select>
            <text class="text" @click="handleSearch">搜索</text>
            <uni-icons
              type="search"
              size="15"
              @click="handleSearch"
            ></uni-icons>
          </view>
        </view>
      </view>
    </view>
    <view
      class="list"
      v-for="(item,index) in crclList"
      :key="index"
      @click="handleItem(item)"
    >
      <view class="header">
        <view class="text" v-if="current == 0">{{ item.applyNo }}</view>
        <view class="text" v-else>{{ item.crclNo }}</view>
        <view class="status" v-if="current === 0 && active === 0">开立中</view>
        <view class="status green" v-if="current === 0 && active === 1"
          >已开立</view
        >
        <view class="status red" v-if="current === 0 && active === 2"
          >开立失败</view
        >
      </view>
      <view class="content">
        <view class="item">
          <text class="text">接收方：</text>
          <text class="desc" v-if="current == 0">{{
            item.holdCompanyName
          }}</text>
          <text class="desc" v-else>{{ item.receiveComName }}</text>
        </view>
        <view class="item" v-if="current == 0 && active == 0">
          <text class="text">额度名称：</text>
          <text class="desc">{{ item.limitSource }}</text>
        </view>
        <view class="item">
          <text class="text">金额(元)：</text>
          <text class="desc">{{ publicFun.format(item.crclAmt) }}</text>
        </view>
        <view class="item" v-if="current == 1">
          <text class="text">还款金额(元)：</text>
          <text class="desc">{{ publicFun.format(item.repayAmt) }}</text>
        </view>
        <view class="item">
          <text class="text">承诺付款日：</text>
          <text class="desc">{{
            publicFun.timestampToDateTime(item.acceptDate)
          }}</text>
        </view>
        <view class="item" v-if="current == 0 && active == 1">
          <text class="text">开立日期：</text>
          <text class="desc">{{ item.openDate }}</text>
        </view>
        <view class="item" v-if="current == 0 && active == 2">
          <text class="text">失败原因：</text>
          <text class="desc">{{ item.failReason }}</text>
        </view>
        <view class="item" v-if="current == 1">
          <text class="text">附言</text>
          <text class="desc">{{ item.note }}</text>
        </view>
      </view>
    </view>
    <view v-if="crclList.length == 0" class="no-data">暂无数据~</view>
    <view>
      <!-- 普通弹窗 -->
      <popup-bottom ref="popup">
        <view class="popup-content">
          <uni-section title="接收方" type="line"></uni-section>
          <input
            class="uni-input"
            placeholder="请输入关键字"
            v-model="searchContext"
          />
          <uni-section title="承诺付款日" type="line"></uni-section>
          <view class="example-body">
            <uni-datetime-picker
              v-model="range1"
              return-type="timestamp"
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
  </view>
</template>

<script>
import popupBottom from '@/components/popupBottom.vue'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
import { primaryColor } from '@/utils/theme.js'
import {
  getCrclLimitTotal,
  crclList,
  alreadyOpenCrclist,
  backCrcllist,
  getRepayInfoList,
  getRepayHomePage,
} from '@/api/openCrcl'
export default {
  components: {
    popupBottom,
  },
  data() {
    return {
      totalAmt: '', //全部待还金额
      lastRepayDate: '', // 最近还款日
      items: ['已开凭证', '凭证还款'],
      limitInfo: {},
      crclList: [],
      current: 0,
      activeColor: primaryColor,
      active: 0,
      value: 1,
      range: [
        { value: 1, text: '待还款' },
        { value: 2, text: '审批中' },
        { value: 3, text: '还款中' },
        { value: 4, text: '已还款' },
      ],
      range1: null,
      searchContext: '',
      page: 1,
      total: 0,
    }
  },
  onShareAppMessage,
  onShareTimeline,
  onLoad() {
    this.getCrclLimitTotal()
    this.getCrclList()
  },
  onPullDownRefresh() {
    console.log('onPullDownRefresh')
    this.handleTab(this.active)
  },
  methods: {
    handleItem(item) {
      const obj = { ...item, active: this.active }
      const params = encodeURIComponent(JSON.stringify(obj))
      if (this.current == 0) {
        if (this.active != 1) {
          uni.navigateTo({
            url: `/pagesA/openCrcl/detail?params=${params}`,
          })
        } else {
          const id = item.id
          uni.navigateTo({
            url: `/pagesA/openCrcl/openDetail?id=${id}`,
          })
        }
      } else {
        const crclNo = item.crclNo
        uni.navigateTo({
          url: `/pagesA/openCrcl/repayDetail?crclNo=${crclNo}`,
        })
      }
    },
    getCrclLimitTotal() {
      getCrclLimitTotal()
        .then((res) => {
          this.limitInfo = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getCrclList() {
      let params = {
        searchQueryType: 1,
        searchContext: this.searchContext,
        page: this.page,
        pageRow: 20,
        startDate: this.range1 && this.range1[0] ? this.range1[0] : '',
        endDate: this.range1 && this.range1[1] ? this.range1[1] : '',
      }
      crclList(params)
        .then((res) => {
          if (this.page == 1) {
            this.crclList = res.data.crclList
          } else {
            this.crclList = [...this.crclList, ...res.data.crclList]
          }
          this.total = res.data.total
          uni.stopPullDownRefresh()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    alreadyOpenCrclist() {
      let params = {
        searchQueryType: 1,
        searchContext: this.searchContext,
        page: this.page,
        pageRow: 20,
        acceptStartDate: this.range1 && this.range1[0] ? this.range1[0] : '',
        acceptEndDate: this.range1 && this.range1[1] ? this.range1[1] : '',
      }
      alreadyOpenCrclist(params)
        .then((res) => {
          this.crclList = [...this.crclList, ...res.data.crclList]
          this.total = res.data.total
          uni.stopPullDownRefresh()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    backCrcllist() {
      let params = {
        searchQueryType: 1,
        searchContext: this.searchContext,
        page: this.page,
        pageRow: 20,
        startDate: this.range1 && this.range1[0] ? this.range1[0] : '',
        endDate: this.range1 && this.range1[1] ? this.range1[1] : '',
      }
      backCrcllist(params)
        .then((res) => {
          this.crclList = [...this.crclList, ...res.data.crclList]
          this.total = res.data.total
          uni.stopPullDownRefresh()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
        if (e.currentIndex == 0) {
          this.handleTab(0)
        }
        if (e.currentIndex == 1) {
          this.handleSearchRepay()
          this.getRepayHomePage()
        }
      }
    },
    handleSearchRepay() {
      this.page = 1
      this.crclList = []
      this.searchContext = ''
      this.range1 = null
      this.getRepayInfoList()
    },
    getRepayHomePage() {
      let params = {
        page: 1,
        pageRow: 20,
        beforDay: 7,
      }
      getRepayHomePage(params)
        .then((res) => {
          this.totalAmt = res.data.totalAmt
          this.lastRepayDate = res.data.lastRepayDate
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRepayInfoList() {
      // 包含当天时间
      const endDateTime =
        this.range1 && this.range1[1]
          ? Number(this.range1[1]) + 24 * 60 * 60 * 1000
          : ''
      let params = {
        queryFlag: this.value,
        distribType: 0,
        searchQueryFlag: 2,
        searchContent: this.searchContext,
        page: this.page,
        pageRow: 20,
        acceptDateStart: this.range1 && this.range1[0] ? this.range1[0] : '',
        acceptDateEnd: endDateTime,
      }
      getRepayInfoList(params)
        .then((res) => {
          this.crclList = [...this.crclList, ...res.data.repayInfoList]
          this.total = res.data.total
          uni.stopPullDownRefresh()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleTab(e) {
      this.active = e
      this.range1 = null
      this.crclList = []
      this.searchContext = ''
      this.page = 1
      if (e == 0) {
        this.getCrclList()
      } else if (e == 1) {
        this.alreadyOpenCrclist()
      } else if (e == 2) {
        this.backCrcllist()
      }
    },
    handleConfirm() {
      this.page = 1
      this.crclList = []
      if (this.current == 0) {
        if (this.active == 0) {
          this.getCrclList()
        } else if (this.active == 1) {
          this.alreadyOpenCrclist()
        } else if (this.active == 2) {
          this.backCrcllist()
        }
      } else {
        this.getRepayInfoList()
      }

      this.$refs.popup.handleClose()
    },
    change(e) {
      console.log('e:', e)
      this.handleSearchRepay()
    },

    handleSearch() {
      this.$refs.popup.toggle()
    },
  },
  onReachBottom() {
    console.log('onReachBottom')
    if (this.total > this.crclList.length) {
      this.page++
      if (this.active == 0) {
        this.getCrclList()
      } else if (this.active == 1) {
        this.alreadyOpenCrclist()
      } else if (this.active == 2) {
        this.backCrcllist()
      }
    }
  },
}
</script>

<style lang="less" scoped>
@import url(../../theem.less);
.open {
  background: #f2f2f2;
  min-height: 100vh;
  .card {
    padding: 40rpx 30rpx;
    background-image: linear-gradient(146deg, @primary 0%, #4a93ff 100%);
    box-shadow: 0 4rpx 24rpx 0 #000014;
    border-radius: 30rpx;
    margin: 20rpx;
    color: #ffffff;
    .title {
      font-size: 32rpx;
    }
    .amt {
      font-family: DINAlternate-Bold;
      font-weight: 600;
      font-size: 70rpx;
      padding: 10rpx 0 30rpx;
    }
    .wrap {
      border-top: 1rpx solid rgba(255, 255, 255, 0.5);
      // padding-top: 30rpx;
      .item {
        width: 50%;
        margin-top: 30rpx;
        display: inline-block;
      }
      .customWwidth {
        width: 100%;
      }
      .sub-title {
        font-size: 26rpx;
      }
      .sub-amt {
        font-family: DINAlternate-Bold;
        font-weight: 600;
        font-size: 48rpx;
        padding-top: 12rpx;
      }
    }
  }
}
.search {
  height: 94rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-right: 30rpx;
  padding-left: 20rpx;
  .btn {
    width: 138rpx;
    height: 54rpx;
    line-height: 54rpx;
    background: #ffffff;
    border-radius: 8rpx;
    color: #666666;
    font-size: 26rpx;
    margin-right: 20rpx;
    text-align: center;
  }
  .activeColor {
    background: @primary;
    color: #fff;
  }
  .text {
    flex: 1;
    text-align: right;
    color: #222222;
    font-size: 28rpx;
    margin-right: 6rpx;
  }
}
.list {
  background: #fff;
  padding: 0 30rpx 18rpx;
  margin-bottom: 20rpx;
  .header {
    color: #222222;
    display: flex;
    align-items: center;
    height: 87rpx;
    border-bottom: 1rpx solid #ebebeb;
    .text {
      flex: 1;
    }
    .status {
      color: #2c7ffa;
      font-size: 26rpx;
      padding: 2rpx 10rpx;
      background: rgba(44, 127, 250, 0.16);
    }
    .green {
      color: #3bc14e;
      background: rgba(59, 193, 78, 0.16);
    }
    .red {
      color: #ff5555;
      background: rgba(255, 85, 85, 0.16);
    }
  }
  .content {
    .item {
      margin-top: 18rpx;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      margin-top: 18rpx;
    }
    .text {
      color: #999999;
      width: 188rpx;
    }
    .desc {
      flex: 1;
      color: #222222;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.popup-title {
  display: flex;
  align-items: center;
  padding: 30rpx;
  .title {
    flex: 1;
    text-align: center;
    padding-left: 40rpx;
    font-size: 32rpx;
    color: #222222;
    font-family: PingFangSC-Medium;
    font-weight: 500;
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
.uni-padding-wrap {
  background: #fff;
}
.content-wrap {
  margin: 20rpx;
  padding: 30rpx 0 30rpx 40rpx;
  background: #ffffff;
  .title {
    display: flex;
    align-items: center;
    .name {
      flex: 1;
      font-size: 26rpx;
      color: #222222;
    }
    .date {
      background: rgba(255, 85, 85, 0.1);
      border-radius: 100rpx 0 0 100rpx;
      padding: 10rpx 20rpx;
      color: #ff5555;
      font-size: 24rpx;
    }
  }
  .price {
    font-family: DINAlternate-Bold;
    font-weight: 700;
    font-size: 60rpx;
    color: #222222;
    margin-top: 16rpx;
  }
}

/deep/ .uni-select {
  border: none !important;
  border-bottom: none !important;
}
/deep/ .uni-select__input-text {
  width: 130rpx !important;
}
</style>
