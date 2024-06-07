<template>
  <div>
    <uni-file-picker
      v-model="FileList"
      :value="FileList"
      ref="upload"
      limit="1"
      :auto-upload="false"
      file-mediatype="image"
      @select="select"
    ></uni-file-picker>
  </div>
</template>

<script>
import { uploadUrl } from '@/api/invoice'
export default {
  props: {
    fileType: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fileObj: {},
      FileList: [],
    }
  },
  watch: {
    url(newValue, oldValue) {
      console.log('message的值从', oldValue, '变为了', newValue)
      if (newValue) {
        this.FileList = [{ url: newValue }]
      }
    },
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
          if (res.statusCode == 200) {
            _this.fileObj = JSON.parse(res.data).data
            _this.FileList = [
              {
                ..._this.fileObj,
                url: _this.fileObj.previewUrl,
              },
            ]
            _this.$emit('fileObj', {
              ..._this.fileObj,
              fileType: _this.fileType,
            })
          }
        },
        fail: function (err) {
          _this.$refs.upload.clearFiles()
          console.log(err)
        },
      })
    },
  },
}
</script>

<style></style>
