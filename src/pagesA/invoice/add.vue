<template>
  <div class="invoice-add">
    <div class="upload-wrap">
      <!-- <uni-file-picker limit="1"></uni-file-picker> -->
      <img :src="imgSrc" alt="" />
      <uni-icons
        type="checkbox-filled"
        :color="primaryColor"
        size="50"
        class="icon"
      ></uni-icons>
    </div>
    <div class="info">
      <uni-forms
        ref="baseForm"
        :label-width="120"
        :rules="rules"
        :modelValue="baseFormData"
      >
        <uni-forms-item label="发票号码" required name="invoiceNo">
          <uni-easyinput
            v-model="baseFormData.invoiceNo"
            placeholder="请输入"
          />
        </uni-forms-item>
        <uni-forms-item label="发票代码" required name="invoiceCode">
          <uni-easyinput
            v-model="baseFormData.invoiceCode"
            placeholder="请输入"
          />
        </uni-forms-item>
        <uni-forms-item
          :label="uploadType == 1102 ? '购买方' : '销售方'"
          required
          name="buyers"
        >
          <uni-easyinput v-model="baseFormData.buyers" placeholder="请输入" />
        </uni-forms-item>
        <uni-forms-item label="开票日期" required name="invoiceDate">
          <uni-datetime-picker
            type="date"
            v-model="baseFormData.invoiceDate"
            placeholder="请选择"
          />
        </uni-forms-item>
        <uni-forms-item label="含税金额(元)" required name="invoicePrice">
          <uni-easyinput
            v-model="baseFormData.invoicePrice"
            placeholder="请输入"
          />
        </uni-forms-item>
        <uni-forms-item
          label="不含税金额(元)"
          required
          name="invoicePriceNotax"
        >
          <uni-easyinput
            v-model="baseFormData.invoicePriceNotax"
            placeholder="请输入"
          />
        </uni-forms-item>
      </uni-forms>
    </div>
    <div class="btn-wrap">
      <button type="primary" class="btn" @click="submit('baseForm')">
        提交
      </button>
      <span class="cancel" @click="back">取消</span>
    </div>
  </div>
</template>

<script>
import { invoiceOcr, ocrBatchSave } from "@/api/invoice";
import { primaryColor } from '@/utils/theme.js'
export default {
  data() {
    return {
      baseFormData: {},
      primaryColor,
      imgSrc: "",
      fileDownloadUrl: "",
      // fileNo: "",
      uploadType: "",
      fileObj: {},
      // 校验规则
      rules: {
        invoiceNo: {
          rules: [
            {
              required: true,
              errorMessage: "请输入发票号码",
            },
          ],
        },
        invoiceCode: {
          rules: [
            {
              required: true,
              errorMessage: "请输入发票代码",
            },
          ],
        },
        buyers: {
          rules: [
            {
              required: true,
              errorMessage:
                this.uploadType == 1102 ? "请输入购买方" : "请输入销售方",
            },
          ],
        },
        invoiceDate: {
          rules: [
            {
              required: true,
              errorMessage: "请选择日期",
            },
          ],
        },
        invoicePrice: {
          rules: [
            {
              required: true,
              errorMessage: "请输入含税金额",
            },
            {
              format: "number",
              errorMessage: "金额只能输入数字",
            },
          ],
        },
        invoicePriceNotax: {
          rules: [
            {
              required: true,
              errorMessage: "请输入含税金额",
            },
            {
              format: "number",
              errorMessage: "金额只能输入数字",
            },
          ],
        },
      },
    };
  },
  onLoad(options) {
    if ("params" in options) {
      const obj = JSON.parse(decodeURIComponent(options.params));
      this.fileObj = obj;
      this.imgSrc = obj.previewUrl;
      this.fileDownloadUrl = obj.downLoadUrl;
      this.uploadType = obj.uploadType;
      this.getInvoiceInfo(obj);
    }
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    getInvoiceInfo(options) {
      invoiceOcr({ fileNo: options.fileNo, uploadType: options.uploadType })
        .then((res) => {
          this.baseFormData = res.data;
          if (res.data.invoiceDate) {
            this.baseFormData.invoiceDate = res.data.invoiceDate
              .replace("年", "-")
              .replace("月", "-")
              .replace("日", "");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submit(ref) {
      if (this.baseFormData.invoiceNo?.length != 20) {
        this.rules.invoiceCode = {
          rules: [
            {
              required: true,
              errorMessage: "请输入发票代码",
            },
          ],
        };
      } else {
        this.rules.invoiceCode = null;
      }
      this.$refs[ref]
        .validate()
        .then(() => {
          const data = [
            {
              fileDownloadUrl: this.fileDownloadUrl,
              // checkId: "0",
              dataBuyer: this.baseFormData.buyers,
              checkCode: this.baseFormData.checkCode,
              dataCode: this.baseFormData.invoiceCode,
              dataNo: this.baseFormData.invoiceNo,
              dataAmt: this.baseFormData.invoicePrice,
              dataAmtExclTax: this.baseFormData.invoicePriceNotax,
              dataTime: this.baseFormData.invoiceDate,
              fileList: [this.fileObj],
            },
          ];
          ocrBatchSave({
            data: data,
            uploadType: this.uploadType,
          })
            .then((res) => {
              uni.showToast({
                title: res.msg,
              });
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //上一页页面实例
              prevPage.$vm.refresh(); //上一页面的刷新方法
              setTimeout(() => uni.navigateBack(), 1000);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import url(../../theem.less);
.invoice-add {
  background: #f2f2f2;
  padding-top: 30rpx;
  padding-bottom: 50rpx;
  min-height: 100vh;
  .upload-wrap {
    background: #fff;
    width: 360rpx;
    height: 360rpx;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 30rpx;
    position: relative;
    // padding: 20rpx;
    img {
      width: 100%;
      height: 100%;
    }
    .icon {
      position: absolute;
      top: 135rpx;
      left: 130rpx;
    }
  }
  .info {
    background: #fff;
    padding: 30rpx 30rpx 10rpx;
  }
}
.btn-wrap {
  text-align: center;
  padding: 76rpx 60rpx;
  .btn {
    background: @primary;
  }
  .cancel {
    font-size: 30rpx;
    color: #666666;
    line-height: 30rpx;
    margin-top: 40rpx;
    display: inline-block;
  }
}
</style>
