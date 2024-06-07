<template>
  <div class="register">
    <div class="info">
      <uni-forms
        ref="baseForm"
        :label-width="90"
        :rules="rules"
        :modelValue="formData"
      >
        <uni-forms-item label="用户姓名" required name="employeeName">
          <uni-easyinput
            v-model="formData.employeeName"
            maxlength="20"
            placeholder="请输入"
          />
        </uni-forms-item>
        <uni-forms-item label="手机号码" required name="mobile">
          <uni-easyinput v-model="formData.mobile" placeholder="请输入" />
        </uni-forms-item>
        <uni-forms-item label="输入密码" required name="password">
          <uni-easyinput
            type="password"
            v-model="formData.password"
            placeholder="请输入"
          />
        </uni-forms-item>
        <uni-forms-item label="确认密码" required name="repeatPassword">
          <uni-easyinput
            v-model="formData.repeatPassword"
            placeholder="请输入"
            type="password"
          />
        </uni-forms-item>
        <uni-forms-item label="图形验证码" required name="imgVerifyCode">
          <div class="wrap">
            <uni-easyinput
              v-model="formData.imgVerifyCode"
              placeholder="请输入"
              class="input-code"
            />
            <image
              :src="imgUrl"
              alt=""
              class="img-code"
              @click="getImgCode"
            ></image>
          </div>
        </uni-forms-item>
        <uni-forms-item label="手机验证码" required name="mobileVerifyCode">
          <div class="wrap">
            <uni-easyinput
              v-model="formData.mobileVerifyCode"
              placeholder="请输入"
              class="input-code"
            />
            <text class="btn">
              <text v-if="showVerficationBtn" @click.stop="getCode"
                >获取验证码</text
              >
              <text v-else>{{ waitSecond }} s</text>
            </text>
          </div>
        </uni-forms-item>
      </uni-forms>
    </div>
    <div style="margin-bottom: 120rpx">
      <checkbox
        :checked="checked"
        @click="checked = !checked"
        style="transform: scale(0.7)"
      />
      <span>我已阅读</span>
      <span style="color: #007bff" @click="handleDown('YHZCXY')"
        >《用户注册协议》
      </span>
      <span style="color: #007bff" @click="handleDown('YSXY')"
        >《隐私协议》
      </span>
    </div>
    <div class="btn-wrap">
      <button type="primary" class="btn" @click="submit('baseForm')">
        提交
      </button>
    </div>
    <uni-popup ref="popup" type="center" background-color="#fff">
      <view class="popup-content">
        <text class="text">{{ popupContent }}</text>
      </view>
    </uni-popup>
  </div>
</template>

<script>
import {
  imgCode,
  sendMobileVerifyCode,
  verifyImgVerifyCode,
  registerUser,
  downloadResource,
} from '@/api/login'
import { yhysxy, ysxy } from './yhysxy'
import md5 from 'js-md5'
export default {
  data() {
    return {
      popupContent: '',
      checked: false,
      imgUrl: '',
      //是否展示显示按钮
      showVerficationBtn: true,
      imgMark: '',
      waitSecond: 60,
      formData: {
        employeeName: '',
        mobile: '',
        password: '',
        repeatPassword: '',
        imgVerifyCode: '',
        mobileVerifyCode: '',
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
              errorMessage: '由中文或英文字母组成',
            },
          ],
        },
        mobile: {
          rules: [
            {
              required: true,
              errorMessage: '手机号不能为空',
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: '密码不能为空',
            },
          ],
        },
        repeatPassword: {
          rules: [
            {
              required: true,
              errorMessage: '密码不能为空',
            },
          ],
        },
        imgVerifyCode: {
          rules: [
            {
              required: true,
              errorMessage: '图形验证码不能为空',
            },
          ],
        },
        mobileVerifyCode: {
          rules: [
            {
              required: true,
              errorMessage: '手机验证码不能为空',
            },
          ],
        },
      },
    }
  },
  onLoad() {
    this.getImgCode()
  },
  methods: {
    handleDown(type) {
      this.popupContent = type == 'YHZCXY' ? yhysxy : ysxy
      this.$refs.popup.open('center')
      // const url = downloadResource + '?fileType=' + type
      // console.log('url', url)
      // uni.downloadFile({
      //   url: url,
      //   success: (res) => {
      //     console.log(res)
      //     if (res.statusCode === 200) {
      //       // 预览文件
      //       uni.openDocument({
      //         filePath: res.tempFilePath,
      //         showMenu: true,
      //         fileType: 'docx',
      //         success: function (file) {
      //           console.log('打开文档成功')
      //         },
      //         fail: function (file) {
      //           console.log('file-err', file)
      //         },
      //       })
      //     }
      //   },
      // })
    },
    close() {
      this.$refs.popup.close()
    },
    submit(ref) {
      this.$refs[ref]
        .validate()
        .then(() => {
          console.log(this.formData)
          if (this.formData.password != this.formData.repeatPassword) {
            uni.showToast({
              title: '两次输入密码不一致',
              icon: 'none',
            })
            return
          }
          if (!this.checked) {
            uni.showToast({
              title: '请先阅读协议',
              icon: 'none',
            })
            return
          }
          registerUser({
            employeeName: this.formData.employeeName,
            mobile: this.formData.mobile,
            password: md5(md5(this.formData.password)),
            repeatPassword: md5(md5(this.formData.repeatPassword)),
            mobileVerifyCode: this.formData.mobileVerifyCode,
            platformType: 1,
            encrypt: true,
          })
            .then((res) => {
              uni.showToast({
                title: '注册成功，请登录',
                icon: 'none',
              })
              uni.reLaunch({
                url: '/pages/login/index',
              })
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    getImgCode() {
      imgCode()
        .then((res) => {
          this.imgUrl = 'data:image/png;base64,' + res.data.image
          this.imgUrl = this.imgUrl.replace(/[\r\n]/g, '')
          this.imgMark = res.data.imgMark
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    getCode() {
      let reg = /^1\d{10}$/
      if (!reg.test(this.formData.mobile)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
        })
        return
      }
      if (!this.formData.imgVerifyCode) {
        uni.showToast({
          title: '请输入图形验证码',
          icon: 'none',
        })
        return
      }
      verifyImgVerifyCode({
        imgVerifyCode: this.formData.imgVerifyCode,
        imgMark: this.imgMark,
      })
        .then((code) => {
          console.log('code', code)
          this.waitSecond = 60
          sendMobileVerifyCode({
            mobile: this.formData.mobile,
            imgVerifyCode: this.formData.imgVerifyCode,
            templateType: 2,
            imgMark: this.imgMark,
            platformType: 1,
          })
            .then((res) => {
              this.showVerficationBtn = false
              let that = this
              let timer = setInterval(function () {
                if (that.waitSecond >= 1) {
                  that.waitSecond -= 1
                } else {
                  clearInterval(timer)
                  that.showVerficationBtn = true
                }
              }, 1000)
              uni.showToast({
                title: res.msg,
                icon: 'none',
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log('err', err)
          if (err && err.status == 'M0500') {
            setTimeout(() => {
              this.getImgCode()
              this.formData.imgVerifyCode = ''
            }, 1000)
          }
        })
    },
  },
}
</script>

<style lang="less" scoped>
@import url(../../theem.less);
.register {
  padding: 100rpx 30rpx;
  .info {
    .wrap {
      display: flex;
      align-items: center;
      .input-code {
        flex: 1;
      }
      .img-code {
        width: 180rpx;
        height: 70rpx;
      }
      .btn {
        width: 180rpx;
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        background: #eff3f7;
        border-radius: 8rpx;
        font-size: 24rpx;
      }
    }
  }
}
.popup-content {
  overflow: auto;
  height: 68vh;
  width: 80vw;
  padding: 30rpx 20rpx;
  border-radius: 10rpx;
}
.btn {
  background: @primary;
}
</style>
