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
      <el-image class="PreImg" w-full :src="data.dialogImageUrl" :lazy=true alt="Preview Image"/>
    </el-dialog>
  </div>
</template>

<script setup name="GalleryView">
// eslint-disable-next-line no-unused-vars
import {computed, h, onMounted, reactive, ref, watch} from "vue";
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
//{id:,viewId:,[{name:,url:},......]}  Gallery
const pictureList = ref([])
const galleryInfo = reactive({
  id: "",
  viewId: ""
})
const lastvid = computed({
  get() {
    return NoteStore.getters.getCurrentView.id;
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
    return false;
  }
  if (!isLt3M) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "图片大小不能超过5MB"),
    })
    return false;
  }
  console.log("beforeUpLoad", pictureList)
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
const askData = function () {
  const vid = NoteStore.getters.getCurrentView.id;
  console.log("askGallery", vid)
  Axios.get("/gallery/getAllpic", {
    params: {
      viewId: vid
    }
  }).then((res) => {
    if (res.code === 200) {
      console.log("ask for gallery", res);
      if (res.data.gallery.datas !== null)
        pictureList.value = res.data.gallery.datas;
      galleryInfo.id = res.data.gallery.id
      galleryInfo.viewId = res.data.gallery.viewId
    }
  }).catch(function (error) {
    console.log(error);
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, '加载失败，请重试'),
    })
  });
}
onMounted(() => {
  console.log("galleryView mounted", pictureList.value)
  if (pictureList.value.length === 0) {
    askData()
  }
  watch(lastvid, (newValue, old) => {
    console.log("old vid", old)
    console.log("new value", newValue)
    if (newValue !== old && pictureList.value !== undefined) {
      const tmp = NoteStore.getters.getCurrenNote;
      for (let i of tmp.children) {
        console.log(i)
        if (i.id === newValue && i.component === "GalleryView") {
          askData()
        }
      }
    }
  })
})
const UpLoadOnePic = function (item) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'lm-token': localStorage.getItem("token")
    }
  }
  console.log("uploadPic", galleryInfo.viewId)
  let formData = new FormData()
  formData.append('file', item.file)
  formData.append('userId', UserStore.getters.getUser.id)
  formData.append('viewId', galleryInfo.viewId)
  Axios.post('/gallery/upload', formData, config).then(res => {
    if (res.code === 200) {
      console.log("上传图片成功", res)
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
const handleRemove = function (file) {
  console.log("galleryDeleteOnePic", file);
  Axios.get("/gallery/deleteOne", {
    params: {
      userId: UserStore.getters.getUser.id,
      viewId: galleryInfo.viewId,
      picName: file.name
    }
  }).then((res) => {
    console.log(res)
    if (res.code === 200) {
      pictureList.value = res.data.gallery.datas;
      galleryInfo.id = data.gallery.id
      galleryInfo.viewId = res.data.gallery.viewId
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, res.msg),
      })
    }
  }).catch(function (error) {
    console.log(error)
  })
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