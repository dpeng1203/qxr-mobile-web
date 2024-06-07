<template>
  <view class="propertyInquiry">
    <view class="head">
      <uni-search-bar
        class="uni-mt-10"
        radius="100px 0px 0px 100"
        placeholder="请输入完整车架号"
        bgColor="#fff"
        clearButton="none"
        cancelButton="none"
        v-model="search"
        @confirm="handleSearch"
      />
      <view class="searchButton" @click="handleSearch">
        <text>查询</text>
      </view>
    </view>
    <view class="content">
      <p class="number">车架号：{{ number }}</p>
      <view class="boxItem" v-for="item in list" :key="item.id">
        <view class="name">
          <p>权属方：{{ item.ownership }}</p>
          <span :class="typeClass[typeKeys.indexOf(item.pledgeStatus)]">{{
            item.pledgeStatus
          }}</span>
        </view>
        <view class="body">
          <view class="msgItem">
            <p class="msgName">业务发生时间：</p>
            <p>{{ item.createTime }}</p>
          </view>
          <view class="msgItem">
            <p class="msgName">数据变更日期：</p>
            <p>{{ item.uploadTime }}</p>
          </view>
          <view class="msgItem">
            <p class="msgName">来源：</p>
            <p>{{ item.source }}</p>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { propertyInquirySearch } from "@/api/propertyInquiry";
import { onShareAppMessage, onShareTimeline } from "@/utils/share.js";
export default {
  data() {
    return {
      number: "-",
      search: "",
      list: [],
      typeClass: ["prepare", "pledged", "revoke", "secure"],
      typeKeys: ["预备质押", "已质押", "撤销预备", "解除质押"],
    };
  },
  onLoad() {},
  onShareAppMessage,
  onShareTimeline,
  methods: {
    handleSearch() {
      this.number = this.search || "-";
      propertyInquirySearch({ frameNumber: this.search })
        .then((res) => {
          const { recordsListBOS } = res.data;
          this.list = recordsListBOS;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.propertyInquiry {
  background: #f2f2f2;
  min-height: calc(100vh - 44px);
  .head {
    display: flex;
    background-color: #2c7ffa;
    padding: 30rpx 20rpx;
    .searchButton {
      background-color: #fff;
      border-radius: 0px 100px 100px 0;
      display: flex;
      align-items: center;

      text {
        font-weight: 400;
        font-size: 26rpx;
        color: #2c7ffa;
        padding: 5px 40rpx 5px 40rpx;
        border-left: 1px solid #cfcfcf;
        letter-spacing: 0.28rpx;
      }
    }
    ::v-deep .uni-searchbar {
      flex: 1;
      padding: 0;
      .uni-searchbar__box {
        height: 74rpx;
      }
    }
  }
  .content {
    .number {
      padding: 20rpx 30rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #2f2f2f;
    }
    .boxItem {
      background-color: #fff;
      padding: 28rpx 30rpx;
      margin-bottom: 20rpx;
      .name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ebebeb;
        padding: 0 0 27rpx 0;
        p {
          font-weight: 400;
          font-size: 30rpx;
          color: #222222;
          letter-spacing: 0;
          line-height: 32rpx;
        }
        span {
          margin-left: 20rpx;
          display: inline-block;
          padding: 1.5rpx 10rpx;
          //   min-width: 98rpx;
          height: 40rpx;
          line-height: 39rpx;
          font-weight: 400;
          font-size: 26rpx;
          letter-spacing: 1rpx;
        }
        .prepare {
          background: #2c7ffa29;
          color: #2c7ffa;
        }
        .pledged {
          background: #3bc14e29;
          color: #3bc14e;
        }
        .revoke {
          background: #ff555529;
          color: #ff5555;
        }
        .secure {
          background: #66666629;
          color: #666666;
        }
      }
      .body {
        .msgItem {
          margin-top: 18rpx;
          display: flex;
          align-items: center;
          align-items: flex-start;
          p {
            font-weight: 400;
            font-size: 28rpx;
            color: #222222;
            line-height: 42rpx;
          }
          .msgName {
            color: #999999;
            min-width: 196rpx;
          }
        }
      }
    }
  }
}
</style>
