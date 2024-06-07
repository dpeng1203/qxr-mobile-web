<template>
  <view class="pay">
    <div class="search">
      <input
        type="text"
        class="search-input"
        v-model="dataNo"
        confirm-type="search"
        @confirm="doSearch"
        placeholder="请输入发票号码"
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
          <span class="code">开票日期 {{ item.dataTime }}</span>
          <span class="status">{{ invoiceType[item.dataStatus] }}</span>
        </div>
        <div class="content">
          <div class="item">
            <div class="company">{{ item.dataBuyer }}</div>
          </div>
          <div class="item">
            <div class="name">含税金额：</div>
            <div class="value">
              ￥ <span class="price">{{ publicFun.format(item.dataAmt) }}</span>
            </div>
          </div>
          <div class="item">
            <div class="name">不含税金额：</div>
            <div class="value">
              ￥ {{ publicFun.format(item.dataAmtExclTax) }}
            </div>
          </div>
          <div class="item">
            <div class="name">发票号码：</div>
            <div class="value">{{ item.dataNo }}</div>
          </div>
          <div class="item">
            <div class="name">发票代码：</div>
            <div class="value">{{ item.dataCode }}</div>
          </div>
        </div>
      </div>
      <div v-if="list.length == 0" class="no-data">暂无数据~</div>
    </div>
    <div class="ocr">
      <uni-file-picker
        ref="upload"
        :limit="1"
        :del-icon="false"
        :auto-upload="false"
        disable-preview
        :imageStyles="imageStyles"
        file-mediatype="image"
        @select="select"
      >
        <div>
          <uni-icons type="scan" size="16" color="#fff"></uni-icons>
          <div class="text">OCR上传</div>
        </div>
      </uni-file-picker>
    </div>
  </view>
</template>

<script>
import { invoicelist, uploadUrl } from '@/api/invoice'
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
import { primaryColor } from '@/utils/theme.js'
export default {
  data() {
    return {
      imageStyles: {
        width: 76,
        height: 76,
        border: {
          radius: '50%',
        },
      },
      page: 1,
      dataNo: '',
      items: ['销项发票', '进项发票'],
      list: [],
      total: 0,
      current: 0,
      activeColor: primaryColor,
      // 发票状态数据
      invoiceType: {
        1201: '有效',
        1202: '冲红',
        1203: '作废',
      },
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
    // 获取上传状态
    select(e) {
      console.log(e)
      let _this = this
      const tempFilePaths = e.tempFilePaths[0]
      uni.uploadFile({
        url: uploadUrl,
        filePath: tempFilePaths,
        name: 'file',
        formData: {
          bizType: 'bizType',
        },
        success: function (res) {
          _this.$refs.upload.clearFiles()
          if (res.statusCode == 200) {
            const fileObj = JSON.parse(res.data).data
            const uploadType = _this.current == 1 ? 1101 : 1102
            const params = encodeURIComponent(
              JSON.stringify({ ...fileObj, uploadType: uploadType })
            )
            uni.navigateTo({
              url: `/pagesA/invoice/add?params=${params}`,
            })
          }
        },
        fail: function (err) {
          _this.$refs.upload.clearFiles()
          console.log(err)
        },
      })
    },
    handleItem(item) {
      const params = encodeURIComponent(JSON.stringify(item))
      uni.navigateTo({
        url: `/pagesA/invoice/detail?params=${params}`,
      })
    },
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
        this.page = 1
        this.dataNo = ''
        this.list = []
        this.getList()
      }
    },
    getList() {
      invoicelist({
        dataNo: this.dataNo,
        dataType: 1,
        uploadType: this.current == 1 ? 1101 : 1102,
        page: this.page,
        pageRow: 20,
      })
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
    handleClick() {
      uni.navigateTo({
        url: 'add',
      })
    },
    refresh() {
      this.page = 1
      this.dataNo = ''
      this.list = []
      this.getList()
    },
    doSearch() {
      this.page = 1
      this.list = []
      this.getList()
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
        font-size: 30rpx;
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
    }
    .content {
      .item {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
        .company {
          font-weight: 600;
          font-size: 30rpx;
          color: #222222;
          line-height: 32rpx;
          margin: 10rpx 0;
        }
        .name {
          width: 188rpx;
          color: #999;
          font-size: 28rpx;
        }
        .value {
          flex: 1;
          color: #222;
          font-size: 28rpx;
          .price {
            font-weight: 700;
            font-size: 42rpx;
            color: #222222;
          }
        }
      }
    }
  }
}
.ocr {
  position: fixed;
  bottom: 240rpx;
  right: 52rpx;
  // width: 120rpx;
  // height: 120rpx;
  text-align: center;
  background: @primary;
  border-radius: 50%;
  // padding-top: 18rpx;
  // box-sizing: border-box;
  // overflow: hidden;
  box-shadow: 0 6rpx 12rpx 0 #2c7ffa66;
  .text {
    font-size: 22rpx;
    color: #fff;
  }
}
</style>
