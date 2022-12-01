<template>
  <div style="display: flex;flex-direction: row;align-items: end">
    <el-upload
        style="align-items: start"
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :http-request="UpLoadOnePic"
        :before-upload="beforeAvatarUpload"
    >
      <el-image fit="contain" loading="lazy" v-if="picture.data" :src="picture.data" class="avatar"/>
      <el-icon v-else class="avatar-uploader-icon">
        <Plus/>
      </el-icon>
    </el-upload>
    <el-button v-if="show" size="small" :icon="Delete"/>
  </div>
</template>

<script setup>
// 图片上传成功的操作
import {ElNotification} from "element-plus";
import {h, inject, onMounted, watch} from "vue";
import {Plus, Delete} from '@element-plus/icons-vue'
// import Mitt from "@/EventBus/mitt";
import {reactive} from "vue";
import UserStore from "@/store";
import NoteStore from "@/store";
import Axios from "@/utils/request";
import Mitt from "@/EventBus/mitt";

// eslint-disable-next-line no-undef
const props = defineProps({
  data: Object,
  id: Number,
})
// eslint-disable-next-line vue/no-setup-props-destructure
// const deletePageComponent = function () {
//   if (textc.data === "" || textc.data === undefined) {
//     console.log("textc empty")
//     Mitt.emit("deletePageItem", index)
//     textc.data = undefined
//   }
// }
//toRef解决 父子组件之间传递的数据丢失响应式
//或者用provide  inject
const picture = reactive({
  data: props.data.text,
})
const show = inject("show")
const savePic = function () {
  console.log("内容保存")
  const pic = {
    text: picture.data,
    index: props.id
  }
  if (picture.data !== undefined)
    Mitt.emit("saveContent", pic);
}
// 图片上传前的判断
const beforeAvatarUpload = function (file) {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt3M = file.size / 1024 / 1024 / 1024 < 5;
  if (!isJPG && !isPNG) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "不支持此格式"),
    })
    return false;
  }
  if (!isLt3M) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "图片大小不能超过5MB"),
    })
    return false;
  }
  return true;
}

const UpLoadOnePic = function (item) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  let formData = new FormData()
  formData.append('file', item.file)
  formData.append('userId', UserStore.getters.getUser.id)
  formData.append('viewId', NoteStore.getters.getCurrenNote.id)
  if (picture.data !== undefined && picture.data !== "") {
    formData.append('lastPath', picture.data.text)
    Axios.post('/page/changePic', formData, config).then(res => {
      if (res.code === 200) {
        console.log("上传图片成功", res)
        picture.data = res.data.url;
      } else {
        ElNotification({
          title: '提示',
          message: h('i', {style: 'color: teal'}, res.msg),
        })
      }
    }).catch(err => {
      console.log(err)
    })
  } else {
    Axios.post('/page/upload', formData, config).then(res => {
      if (res.code === 200) {
        console.log("上传图片成功", res)
        picture.data = res.data.url;
        savePic()
      } else {
        ElNotification({
          title: '提示',
          message: h('i', {style: 'color: teal'}, res.msg),
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

}
onMounted(() => {
  console.log("pagePicmounted", props)
  watch(show, (newValue, old) => {
    console.log("deleteHide", newValue, old)
  })

})
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  max-width: 300px;
  width: auto;
  height: auto;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  display: inline-flex;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  justify-content: start;
  align-items: start;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>