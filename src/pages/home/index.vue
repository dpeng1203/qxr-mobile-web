<template>
  <view class="home">
    <view class="top">
      <uni-data-select
        v-model="value"
        :clear="false"
        :localdata="range"
        @change="change"
      ></uni-data-select>
      <view class="status">
        <image class="login-bg" src="/static/certified.png"></image>
        <text>已认证</text>
      </view>
    </view>
    <image class="banner" src="/static/banner.png"></image>
    <view class="list">
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="handleItem(item)"
      >
        <img :src="item.src" alt="" />
        <view class="text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCacheCustInfo, switchCompany } from '@/api/login'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
export default {
  data() {
    return {
      title: 'Hello',
      value: 0,
      range: [],
      custCompanyList: [],
      list: [
        {
          src: '/static/preview.png',
          text: '凭证预览',
          id: 1,
          url: '/pages/statistics/index',
        },
        {
          src: '/static/open.png',
          text: '凭证开立',
          id: 2,
          url: '/pagesA/openCrcl/index',
        },
        {
          src: '/static/pay.png',
          text: '凭证流转',
          id: 3,
          url: '/pagesA/openPay/index',
        },
        {
          src: '/static/invoice.png',
          text: '单据管理',
          id: 4,
          url: '/pagesA/invoice/index',
        },
        {
          src: '/static/finance.png',
          text: '融资管理',
          id: 5,
          url: '/pagesA/finance/index',
        },
        {
          src: '/static/message.png',
          text: '消息中心',
          id: 6,
          url: '/pagesA/message/index',
        },
        {
          src: '/static/help.png',
          text: '帮助中心',
          id: 7,
          url: '/pagesA/help/index',
        },
        // { src: "/static/audit.png", text: "审批中心", id: 8 },
        // {
        //   src: '/static/wuquan.png',
        //   text: '物权查询',
        //   id: 9,
        //   url: '/pagesA/propertyInquiry/index',
        // },
      ],
    }
  },
  onShow() {
    this.getCacheCustInfo()
  },
  onShareAppMessage,
  onShareTimeline,
  methods: {
    getCacheCustInfo() {
      getCacheCustInfo()
        .then((res) => {
          this.value = res.data.cid
          this.range = res.data.custCompanyList.map((ele) => {
            return {
              text: ele.custName,
              value: ele.id,
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    change(e) {
      console.log('e:', e)
      switchCompany({ switchCompanyId: e })
        .then(() => {
          this.getCacheCustInfo()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleItem(item) {
      if (item.url) {
        uni.navigateTo({
          url: item.url,
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .uni-select {
  border: none !important;
  border-bottom: none !important;
}
/deep/ .uni-select__input-text {
  width: 320rpx !important;
}
/deep/ .uni-select__selector-item text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home {
  padding: 0 30rpx;
  border-top: 1px solid #ebebeb;
}
.top {
  display: flex;
  align-items: center;
  .status {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    image {
      width: 27rpx;
      height: 32rpx;
    }
    text {
      font-weight: 500;
      font-size: 24rpx;
      color: #3bc14e;
      margin-left: 10rpx;
    }
  }
}
.banner {
  width: 100%;
  height: 320rpx;
}
.list {
  margin-top: 24rpx;
  .item {
    width: 25%;
    display: inline-block;
    text-align: center;
    margin-top: 36rpx;
    img {
      width: 96rpx;
      height: 96rpx;
    }
    .text {
      font-size: 28rpx;
      color: #222222;
    }
  }
}
</style>
