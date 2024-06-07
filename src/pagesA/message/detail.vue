<template>
  <div class="message">
    <div class="title">
      <div class="text">{{ detail.title }}</div>
      <div class="time">{{ detail.createTime }}</div>
    </div>
    <div class="content">
      {{ detail.content }}
    </div>
  </div>
</template>

<script>
import { toMessageDetail } from "@/api/message";
export default {
  data() {
    return {
      id: "",
      detail: {},
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      toMessageDetail({ id: this.id, dataType: 1 })
        .then((res) => {
          this.detail = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.message {
  background: #f2f2f2;
  min-height: 100vh;
  padding: 0 30rpx;
  .title {
    padding: 30rpx 0;
    border-bottom: 1px solid #cfcfcf;
    .text {
      font-size: 34rpx;
      color: #222222;
    }
    .time {
      font-size: 26rpx;
      color: #999999;
      margin-top: 20rpx;
    }
  }
  .content {
    margin-top: 30rpx;
    font-size: 26rpx;
    color: #222222;
    line-height: 42rpx;
  }
}
</style>
