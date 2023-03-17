<template>
  <div style="display: flex;flex-direction: row;align-items: end">
    <el-upload
        v-show="(picNotNull||show)"
        style="align-items: start"
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :http-request="UpLoadOnePic"
        :before-upload="beforeAvatarUpload"
    >
      <el-image fit="contain" loading="lazy" v-if="picture.text" :src="picture.text" class="avatar"/>
      <el-icon v-else class="avatar-uploader-icon">
        <Plus/>
      </el-icon>
    </el-upload>
    <el-button v-show="show" size="small" @click="deletePageComponent" :icon="Delete"/>
  </div>
</template>

<script setup>
// 图片上传成功的操作
import {ElNotification} from "element-plus";
import {computed, inject, onMounted, toRef, watch} from "vue";
import {Plus, Delete} from '@element-plus/icons-vue'
// import Mitt from "@/EventBus/mitt";
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
const picture = toRef(props, "data")
const picNotNull = computed({
  get() {
    return picture.value.text !== undefined || picture.value.text !== "";
  }
})
const show = inject("show")
const savePic = function () {
  const pic = {
    text: picture.value.text,//图片的请求路径
    index: props.id
  }
  if (picture.value.text !== undefined)
    Mitt.emit("saveContent", pic);
}
const deletePageComponent = function () {
  Mitt.emit("deletePageItem", props.id)
}
// 图片上传前的判断
const beforeAvatarUpload = function (file) {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt3M = file.size / 1024 / 1024 / 1024 < 5;
  if (!isJPG && !isPNG) {
    ElNotification({
      title: 'Info',
      message: "不支持此格式",
      type: "warning"
    })
    return false;
  }
  if (!isLt3M) {
    ElNotification({
      title: 'Info',
      message: "图片大小不能超过5MB",
      type: "warning"
    })
    return false;
  }
  return true;
}

const UpLoadOnePic = function (item) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'lm-token': localStorage.getItem("token")
    }
  }
  let formData = new FormData()
  formData.append('file', item.file)
  formData.append('userId', UserStore.getters.getUser.id)
  formData.append('viewId', NoteStore.getters.getCurrenNote.id)
  if (picture.value.text !== undefined && picture.value.text !== "") {
    formData.append('lastPath', picture.value.text)
    Axios.post('/page/changePic', formData, config).then(res => {
      if (res.code === 200) {
        picture.value.text = res.data.url;
      } else {
        ElNotification({
          title: 'Info',
          message: res.msg,
          type: "error"
        })
      }
    }).catch(err => {
      console.log(err)
    })
  } else {
    Axios.post('/page/upload', formData, config).then(res => {
      if (res.code === 200) {
        picture.value.text = res.data.url;
        savePic()
      } else {
        ElNotification({
          title: 'Info',
          message: res.msg,
          type: "error"
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

}
onMounted(() => {
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
  justify-content: flex-start;
  align-items: flex-start;
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
