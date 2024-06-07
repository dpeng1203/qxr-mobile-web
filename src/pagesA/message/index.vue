<template>
  <view class="pay">
    <div class="search">
      <input
        type="text"
        class="search-input"
        v-model="keyword"
        confirm-type="search"
        @confirm="doSearch"
        placeholder="请输入关键字"
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
          <span class="red" :class="{ white: item.readStatus == 1 }"></span>
          <span class="text">{{ item.title }}</span>
          <span class="time">{{ item.createTime }}</span>
        </div>
        <div class="content">{{ item.webMsgContent.content }}</div>
      </div>
      <div v-if="list.length == 0" class="no-data">暂无数据~</div>
    </div>
  </view>
</template>

<script>
import { toQueryMessage, readMessage } from '@/api/message'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
import { primaryColor } from '@/utils/theme.js'
export default {
  data() {
    return {
      items: ['待办消息', '重大消息', '即时消息', '转让通知'],
      current: 0,
      activeColor: primaryColor,
      page: 1,
      keyword: '',
      list: [],
      total: 0,
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
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
        this.page = 1
        this.list = []
        this.keyword = ''
        this.getList()
      }
    },
    doSearch() {
      this.page = 1
      this.list = []
      this.getList()
    },
    handleItem(item) {
      if (item.readStatus == 1) {
        uni.navigateTo({
          url: `./detail?id=${item.id}`,
        })
      } else {
        readMessage({ ids: [item.id], dataType: 1 })
          .then((res) => {
            item.readStatus = 1
            uni.navigateTo({
              url: `./detail?id=${item.id}`,
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    getList() {
      const params = {
        dataType: 1,
        keyword: this.keyword,
        msgType: this.current + 1,
        page: this.page,
        rows: 20,
      }
      toQueryMessage(params)
        .then((res) => {
          if (this.page == 1) {
            this.list = res.data
          } else {
            this.list = [...this.list, ...res.data]
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
  }
  .icon1 {
    position: absolute;
    top: 35rpx;
    left: 50rpx;
  }
}
.tabs {
  background: #fff;
}
.wrap {
  margin-top: 20rpx;
  .list {
    padding: 0 30rpx 30rpx;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    .title {
      height: 88rpx;
      display: flex;
      align-items: center;
      color: #222;
      font-size: 28rpx;
      .red {
        width: 16rpx;
        height: 16rpx;
        background: #ff5555;
        border-radius: 50%;
      }
      .white {
        background: #fff;
      }
      .text {
        margin-left: 16rpx;
        margin-right: 12rpx;
        font-size: 30rpx;
        color: #222;
        flex: 1;
      }
      .time {
        font-size: 22rpx;
        color: #a0a0a0;
      }
    }
    .content {
      font-weight: 400;
      font-size: 26rpx;
      color: #999999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 32rpx;
    }
  }
}
</style>
