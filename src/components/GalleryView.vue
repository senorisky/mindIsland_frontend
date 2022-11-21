<template>
  <div>
    <el-upload action="#"
               :data="upLoadData"
               v-model:file-list="pictureList"
               list-type="picture-card"
               accept=".jpg,.jpeg,.png,.JPG,.JPEG"
               :multiple=true
               :http-request="UpLoadOnePic"
               :before-upload="beforeUploadHandle"
               :on-exceed="handleExceed"
               :limit=200
    >
      <el-icon>
        <Plus/>
      </el-icon>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
          <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in/></el-icon>
          </span>
          <span
              v-if="!data.disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download/></el-icon>
          </span>
          <span
              v-if="!data.disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete/></el-icon>
          </span>
        </span>
        </div>
      </template>
    </el-upload>
    <el-dialog class="picPreVIew" v-model="data.dialogVisible">
      <img class="PreImg" w-full :src="data.dialogImageUrl" alt="Preview Image"/>
    </el-dialog>
  </div>
</template>

<script setup name="GalleryView">
// eslint-disable-next-line no-unused-vars
import {computed, h, onMounted, reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import UserStore from "../store/index"
import NoteStore from "../store/index"
import Axios from "@/utils/request";
import {nanoid} from "nanoid";
// import NoteStore from "../store/index"

// const url = ref("http://localhost:8081/gallery/upload")
const upLoadData = reactive({
  userId: UserStore.getters.getUser.id,
  viewId: NoteStore.getters.getCurrentView.id
})
const pictureList = computed({
  get() {
    console.log("getPics", NoteStore.getters.getCurrentViewData.datas)
    return NoteStore.getters.getCurrentViewData.datas
  },
  set(value) {
    console.log(value)
  }
})
const beforeUploadHandle = function (file) {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt3M = file.size / 1024 / 1024 / 1024 < 5;
  if (!isJPG && !isPNG) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "不支持此格式"),
    })
    return  false;
  }
  if (!isLt3M) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "图片大小不能超过5MB"),
    })
    return false;
  }
  console.log("beforeUpLoad", pictureList.value)
  let len = pictureList.value.length;
  for (let i in pictureList.value) {
    if ((pictureList.value[i].name === file.name) && (i !== len - 1)) {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, "已存在同名图片"),
      })
      return false;
    }
  }
  return true;
}
const data = reactive({
  dialogImageUrl: '',
  dialogVisible: false,
  disabled: false
})
onMounted(() => {
  console.log("listview mounted")
  if (pictureList.value === undefined) {
    NoteStore.dispatch("askViewData")
  }
})
const UpLoadOnePic = function (item) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  let formData = new FormData()
  formData.append('file', item.file)
  formData.append('userId', UserStore.getters.getUser.id)
  formData.append('viewId', NoteStore.getters.getCurrentView.id)
  Axios.post('/gallery/upload', formData, config).then(res => {
    if (res.code === 200) {
      const lastPic = {
        'name': res.data.name,
        'url': res.data.url
      }
      NoteStore.commit("saveLastGalleryPic", lastPic);
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, "上传失败"),
      })
    }
  }).catch(err => {
    console.log(err)
  })
}
const handleRemove = function (file) {
  console.log("galleryDeleteOnePic", file);
  NoteStore.dispatch("galleryDeleteOnePic", file)
}
const handlePictureCardPreview = function (file) {
  data.dialogImageUrl = file.url;
  data.dialogVisible = true;
}
const handleExceed = function () {

}
const handleDownload = function (file) {
  const uid = UserStore.getters.getUser.id;
  console.log("downPic", file);
  Axios.get("/gallery/downSinglePic", {
    params: {
      userId: uid,
      name: file.name,
    },
    responseType: 'blob'
  }).then((res) => {
    // console.log(res)
    // 封装 Blob ，创建 下载链接
    let blob = new Blob([res], {type: 'image/jpeg'});
    console.log(blob)
    // 通过创建的blob创建下载的链接
    const href = window.URL.createObjectURL(blob);
    console.log(href)
    // 创建 a 标签
    const link = document.createElement('a');
    // 设置a标签参数
    link.href = href;
    link.style.display = "none";
    // 把a标签加入到body中去
    const tmpName = nanoid(16);
    link.setAttribute("download", uid + tmpName + ".jpeg"); // 设置文件 name
    document.body.appendChild(link);
    // 触发标签的点击事件，直接执行下载
    link.click();
    // 下载完成后要移除对应的标签
    document.body.removeChild(link);
    // 释放blob对象创建的链接地址
    window.URL.revokeObjectURL(href);
  }).catch(function (error) {
    console.log(error);
  })
}
</script>

<style lang="scss" scoped>
.picPreVIew {
  display: flex;
  overflow: auto;
}

.PreImg {
  width: 100%;
}
</style>