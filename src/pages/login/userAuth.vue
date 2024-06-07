<template>
  <div class="user-auth">
    <uni-section title="认证审核未通过" type="line" v-if="auditResult">
      <uni-notice-bar :text="auditResult" />
    </uni-section>
    <uni-section title="身份证人像面" type="line">
      <view class="example-body">
        <upload
          fileType="front"
          @fileObj="getFileInfo"
          :url="frontFile.previewUrl"
        ></upload>
      </view>
    </uni-section>
    <uni-section title="身份证国徽面" type="line">
      <view class="example-body">
        <upload
          fileType="back"
          @fileObj="getFileInfo"
          :url="backFile.previewUrl"
        ></upload>
      </view>
    </uni-section>
    <div class="info">
      <uni-forms
        ref="baseForm"
        :label-width="90"
        :rules="rules"
        :modelValue="formData"
      >
        <uni-forms-item label="真实姓名" required name="employeeName">
          <uni-easyinput
            v-model="formData.employeeName"
            maxlength="20"
            placeholder="请输入"
          />
        </uni-forms-item>
        <uni-forms-item label="证件号码" required name="idNumber">
          <uni-easyinput v-model="formData.idNumber" placeholder="请输入" />
        </uni-forms-item>
        <uni-forms-item label="证件有效期" required name="range">
          <uni-datetime-picker
            returnType="timestamp"
            v-model="formData.range"
            type="daterange"
          />
        </uni-forms-item>
      </uni-forms>
    </div>
    <div class="btn-wrap">
      <button type="primary" class="btn" @click="submit('baseForm')">
        提交
      </button>
    </div>
  </div>
</template>

<script>
import upload from './upload'
import { saveUserAuth, ocrAuthCheck, queryUserAuthInfo } from '@/api/login'
export default {
  components: {
    upload,
  },
  data() {
    return {
      auditResult: '',
      formData: {
        employeeName: '',
        idNumber: '',
        range: null,
      },
      rules: {
        employeeName: {
          rules: [
            {
              required: true,
              errorMessage: '姓名不能为空',
            },
            {
              pattern: '^[\\u4e00-\\u9fa5a-zA-Z]+$',
              errorMessage: '由中文和英文字母组成',
            },
          ],
        },
        idNumber: {
          rules: [
            {
              required: true,
              errorMessage: '证件号不能为空',
            },
          ],
        },
        range: {
          rules: [
            {
              required: true,
              errorMessage: '证件有效期号不能为空',
            },
          ],
        },
      },
      frontFile: {},
      backFile: {},
      userFileList: [],
    }
  },
  onLoad() {
    this.queryUserAuthInfo()
  },
  methods: {
    queryUserAuthInfo() {
      queryUserAuthInfo()
        .then((res) => {
          if (res.data.userAuditStatus == 4) {
            this.auditResult = res.data.auditResult
            this.formData.employeeName = res.data.employeeName
            this.formData.idNumber = res.data.idNumber
            this.formData.range = [res.data.validStart, res.data.validEnd]
            res.data.userFiles.forEach((element) => {
              if (element.flag == 0) {
                this.frontFile = element
              } else if (element.flag == 1) {
                this.backFile = element
              }
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取上传状态
    getFileInfo(obj) {
      console.log(obj)
      if (obj.fileType == 'front') {
        this.frontFile = obj
        this.frontFile.flag = 0
      } else {
        this.backFile = obj
        this.backFile.flag = 1
      }
      ocrAuthCheck({
        fileNo: obj.fileNo,
        towardCode: obj.fileType,
      })
        .then((res) => {
          if (res.data.name) {
            this.formData.employeeName = res.data.name
          }
          if (res.data.citizenNumber) {
            this.formData.idNumber = res.data.citizenNumber
          }
          if (res.data.issueDate && res.data.expiryDate) {
            this.formData.range = [res.data.issueDate, res.data.expiryDate]
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    submit(ref) {
      if (!this.frontFile.fileNo) {
        uni.showToast({
          title: '请上传身份证人像面',
          icon: 'none',
        })
        return
      }
      if (!this.backFile.fileNo) {
        uni.showToast({
          title: '请上传身份证国徽面',
          icon: 'none',
        })
        return
      }
      console.log(this.formData)
      this.$refs[ref]
        .validate()
        .then(() => {
          saveUserAuth({
            employeeName: this.formData.employeeName,
            idNumber: this.formData.idNumber,
            operCardtype: 1,
            auditType: 1,
            sourceType: 1,
            validStart: this.formData.range[0],
            validEnd: this.formData.range[1],
            validForever: 0,
            userFileList: [this.frontFile, this.backFile],
            commitflag: '',
          })
            .then((res) => {
              uni.showToast({
                title: '实名认证审核中，请耐心等待！',
                icon: 'none',
              })
              setTimeout(() => {
                uni.reLaunch({
                  url: '/pages/login/index',
                })
              }, 2000)
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
  },
}
</script>

<style lang="less" scoped>
@import url(../../theem.less);
.user-auth {
  padding: 30rpx;
  .info {
    margin-top: 30rpx;
  }
}
.btn {
  background: @primary;
}
</style>
