<template>
  <!-- 单列表组件 -->
  <div style="margin-left: 80px">
    <div class="singleList_container" v-loading="loading.value"
         element-loading-text="Loading this maybe cast seconds...">
      <div class="list" v-for="(item,index) in listData" :key="index">
        <el-table :data="item.items" max-height="300px"
                  :cell-style="ItemStyle" stripe>
          <el-table-column style="width: 400px" prop="name" :label="item.colum">
            <template #default="scope">
              <div class="singleList_Item">
                <div class="Item_info" @click="ItemDetail(scope.$index, scope.row)">
                  <h2 class="deepInput" readonly v-text="scope.row.name"></h2>
                  <input style="width: 400px; "
                         class="deepInput" readonly v-model="scope.row.des"/>
                </div>
                <el-button
                    size="small"
                    :icon="Delete"
                    @click="deleteItem(index,scope.$index, scope.row)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="mt-4" style="width: 100%;" @click="ShowItemDw(index)"
        >Add Item
        </el-button>
      </div>
    </div>
  </div>
  <div class="drawer1">
    <!--  添加 列表项的抽屉  -->
    <el-drawer
        v-model="drawer1"
        title="Give  basic  info"
        :direction="direction"
        :before-close="handleClose"
    >
      <el-form ref="formRef" :model="form" label-width="20px">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="Simple information is required"/>
        </el-form-item>
        <el-form-item prop="date">
          <el-col :span="11">
            <el-date-picker
                v-model="form.date"
                type="date"
                readonly
                placeholder="Pick current date !!"
                style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
                v-model="form.date"
                readonly
                type="time"
                placeholder="Pick current time !!"
                style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item class="inputDeep">
          <el-input v-model="form.desc" type="textarea" placeholder="please give a  description or not"/>
        </el-form-item>
        <el-form-item>
          <el-upload

              ref="upLoadRef"
              :auto-upload="false"
              drag
              :http-request="submitUpLoad"
              action="#"
              :on-change="handleChange"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG,.mp4"
              :before-upload="beforeUploadHandle"
              :on-exceed="handleExceed"
              :limit=1
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                mp4 is less than 120MB / jpg or png is less than 5MB / one
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addItem">Create</el-button>
          <el-button @click="CancelAdd">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
  <div class="drawer2">
    <CardView :drawer="drawer2" :data="ItemData.data" :index="ItemData.index"></CardView>
  </div>
</template>

<script setup name="sListView">
// eslint-disable-next-line no-unused-vars
import {computed, h, onMounted, reactive, ref} from "vue";
import NoteStore from "../store/index"
import {ElNotification} from "element-plus";
import {
  Delete,
} from '@element-plus/icons-vue'
import UserStore from "@/store";
import Axios from "@/utils/request";
import CardView from "@/components/CardView";
import Mitt from "@/EventBus/mitt";

const upLoadRef = ref({});
const formRef = ref(null)
const form = reactive({
  name: undefined,
  date: ref(""),
  desc: "",
  url: undefined,
  index: undefined
})
const drawer1 = ref(false)
const drawer2 = ref(false)
const ItemStyle = reactive({
  "height": "40px",
  "margin-bottom": " 10px",
})
const ItemData = reactive({
  data: {},
  index: -1
});
const upList = ref(undefined)
const direction = ref('rtl')
const beforeUploadHandle = function (file) {
  console.log(file.type)
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isMP4 = file.type === "video/mp4";
  const isLt3M = file.size / 1024 / 1024 / 1024 < 5;
  const isLt150M = file.size / 1024 / 1024 / 1024 < 120;
  if (!isJPG && !isPNG && !isMP4) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "不支持此格式"),
    })
    return false;
  }
  if ((isPNG || isJPG) && !isLt3M) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "图片大小不能超过5MB"),
    })
    return false;
  }
  if (isMP4 && !isLt150M) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "视频大小不得大于120MB"),
    })
    return false;
  }
  return true;
}
const handleExceed = function () {
  ElNotification({
    title: '提示',
    message: h('i', {style: 'color: teal'}, "单列表只允许上传一个图片或视频"),
  })
}
const handleClose = (done) => {
  //抽屉关闭
  formRef.value.resetFields();
  form.desc = "";
  done()

}
const handleChange = function (file, fileList) {
  console.log(file, fileList);
  upList.value = fileList.length;
}
const CancelAdd = function () {
  formRef.value.resetFields();
  form.desc = "";
  drawer1.value = false;
}
const ShowItemDw = (index) => {
  drawer1.value = true;
  form.index = index
  form.date = Date.now();
}
const submitUpLoad = function (item) {
  const tmp =NoteStore.getters.getCurrentViewData;
  console.log("submitCard", form)
  tmp.datas[form.index].items.push({
    name: form.name,
    date: form.date,
    des: form.desc,
  })
  console.log("addItemWithResource", tmp)
  const len = tmp.datas[form.index].items.length;
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  let formData = new FormData()
  formData.append("file", item.file);
  formData.append('userId', UserStore.getters.getUser.id)
  formData.append('elistString', JSON.stringify(tmp))
  formData.append('index', len - 1)
  Axios.post('/elist/upload', formData, config).then(res => {
    console.log("upCard", res)
    if (res.code === 200) {
      NoteStore.commit("saveCurrentViewData", tmp)
      form.desc = "";
      formRef.value.resetFields();
      drawer1.value = false;
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, res.msg),
      })
    }
  }).catch(err => {
    console.log(err)
  })
  upLoadRef.value.clearFiles();
}
const addItem = function () {
  if (form.name === undefined) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, '添加失败，名字不可为空'),
    })
    return;
  }
  if (upList.value === undefined || upList.value === 0) {
    NoteStore.dispatch("addItem", form)
    form.desc = "";
    formRef.value.resetFields();
    drawer1.value = false;
  } else {
    upLoadRef.value.submit()
  }
}
const loading = computed({
  get() {
    return NoteStore.getters.getCurrentViewData.datas !== undefined;
  }
})
const listData = computed({
  get() {
    return NoteStore.getters.getCurrentViewData.datas;
  }
})
onMounted(() => {
  Mitt.on("CloseCardView", function () {
    drawer2.value = false;
  })
  console.log("listview mounted")
  if (listData.value === undefined) {
    NoteStore.dispatch("askViewData")
  }
})
const deleteItem = function (Lindex, index, row) {
  // console.log("deleteItem", Lindex, index, row)
  const param = {
    Lindex,
    index, row
  }
  NoteStore.dispatch("deleteListItem", param);
}
const ItemDetail = function (index, row) {
  drawer2.value = true;
  console.log(index, row)
  ItemData.data = row;
  ItemData.index = index;
}
</script>

<style lang="scss" scoped>
.deepInput {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: transparent;
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
  cursor: default;
  border: none;
}

.singleList_Item {
  display: flex;
}

.drawer1 {
  :deep( .el-drawer ) {
    background-color: #f1f5f7;
    border-radius: 15px;
    box-shadow: var(--el-alert-bg-color);
    width: 25% !important;
  }

  :deep( .el-drawer.rtl ) {
    height: auto;
    margin-top: 200px;
    margin-bottom: 20px;
  }

  position: relative;
  height: auto;
}

.drawer2 {
  :deep( .el-overlay) {
    background-color: transparent !important;
    margin-right: 20px;
  }

  :deep(.el-drawer__header) {
    margin-bottom: 0px !important;
  }

  :deep( .el-drawer.rtl ) {
    height: auto;
    margin-top: 100px;
    margin-bottom: 20px;
  }

  :deep( .el-drawer ) {
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: var(--el-alert-bg-color);
    width: 37% !important;
  }

  position: relative;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-scrollbar__wrap) {
  width: 100% !important;
}

.singleList_container {
  height: 350px;
  overflow-y: hidden;
  flex-shrink: 0;
  display: flex;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
}

.inputDeep {
  :deep(.el-textarea__inner) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    resize: none;
    cursor: default;
    font-weight: 500;
  }
}

.list { //单列表样式
  flex-shrink: 0;
  border-radius: 4px;
  width: 500px;
  margin-left: 10px;
  margin-right: 10px;
}

</style>