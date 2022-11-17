<template>
  <!-- 多列表项组件 -->
  <div style="display: flex;justify-content: center">
    <el-scrollbar v-loading="loading.value"
                  element-loading-text="Loading this maybe cast seconds..."
                  style="height:350px;margin-bottom: 20px; overflow-y: hidden">
      <div class="todoList_container">
        <div :class='small?"lists":"list"' v-for="(item,index) in listData" :key="index">
          <el-table :data="item.items" max-height="300px"
                    :cell-style="ItemStyle" stripe>
            <el-table-column class="list_tittle" prop="name" :label="item.colum"/>
            <el-table-column align="right">
              <template #header>
                <el-button
                    size="small"
                    type="danger"
                    @click="DialogConfirm(index)"
                    :icon="Delete"
                />
              </template>
              <template #default="scope">
                <el-button size="small" @click="ItemDetail(scope.$index, scope.row)" :icon="Edit"
                />
                <el-button
                    size="small"
                    :icon="Delete"
                    @click="deleteItem(index,scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-button class="mt-4" style="width: 100%;" @click="ShowItemDw(index)"
          >Add Item
          </el-button>
        </div>
      </div>

    </el-scrollbar>
    <el-button @click=" drawer2 = true;">New colum</el-button>
  </div>
  <div class="list_drawer_contrainer">
    <!--  列表项的抽屉  -->
    <el-drawer
        v-model="drawer1"
        title="Give  basic  info"
        :direction="direction"
        :before-close="handleClose"
    >
      <el-form ref="formRef" :model="form" label-width="20px">
        <el-form-item prop="name" class="deepInput">
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
          <el-button type="primary" @click="addItem">Create</el-button>
          <el-button @click="CancelAdd">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer
        v-model="drawer2"
        title="Give  basic  info"
        :direction="direction"
    >
      <el-input style="margin-bottom: 20px" v-model="newColum" placeholder="give colum a name"/>
      <el-button type="primary" @click="addListColum">Create</el-button>
      <el-button @click="drawer2=false">Cancel</el-button>
    </el-drawer>
  </div>
  <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
    <span>
      You are deleting a list, please confirm. This is an operation that cannot be undone!!
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deletList(columIndex)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="ListView">
import {computed, h, onBeforeMount, reactive, ref} from "vue";
import Axios from "@/utils/request";
import NoteStore from "../store/index"
import {ElNotification} from "element-plus";
import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'

const centerDialogVisible = ref(false)
const columIndex = ref();
const DialogConfirm = function (index) {
  console.log("弹出dialog")
  centerDialogVisible.value = true;
  columIndex.value = index;
}
const newColum = ref(null);
const formRef = ref(null)
const form = reactive({
  name: undefined,
  date: ref(""),
  desc: "",
  type: "note",
  index: undefined
})
const drawer1 = ref(false)
const drawer2 = ref(false)
const small = computed({
  get() {
    console.log("style", listData.value.length > 1)
    if (listData.value.length > 1)
      return true;
    return false;
  }
})
const ItemStyle = reactive({
  // "color": "inherit",
  // " text-decoration": "none",
  // "box-shadow": " rgb(15 15 15 / 10%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 2px 4px",
  // "border-radius": "4px",
  // "background": "white",
  // "overflow": "hidden",
  // "transition": "background 100ms ease-out 0s",
  "height": "40px",
  "margin-bottom": " 10px",
  // "position": "static"
})
const direction = ref('rtl')
const handleClose = (done) => {
  //抽屉关闭
  done()
  formRef.value.resetFields();
}
const CancelAdd = function () {
  formRef.value.resetFields();
  drawer1.value = false;
}
const addItem = function () {
  if (form.name === undefined) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, '添加失败，名字不可为空'),
    })
    return;
  }
  NoteStore.dispatch("addItem", form)
  formRef.value.resetFields();
  drawer1.value = false;
}
const addListColum = function () {

  if (newColum.value === null) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, '添加失败，名字不可为空'),
    })
    return;
  }
  const list = {
    colum: newColum,
    items: []
  }
  NoteStore.dispatch("addListColum", list);

  drawer2.value = false;
}
const loading = computed({
  get() {
    if (NoteStore.getters.getCurrentViewData.datas != undefined)
      return true;
    else {
      return false;
    }
  }
})
const listData = computed({
  get() {
    return NoteStore.getters.getCurrentViewData.datas;
  }
})
onBeforeMount(() => {
  console.log("list beforemount")
  AskListData()
})
//index是下标位置，row是一个Proxy
const deletList = function (index) {
  centerDialogVisible.value = false;
  // console.log("deleteList", index)
  NoteStore.dispatch("deleteList", index)
}
const deleteItem = function (Lindex, index, row) {
  // console.log("deleteItem", Lindex, index, row)
  const param = {
    Lindex,
    index, row
  }
  NoteStore.dispatch("deleteListItem", param);
}
const ItemDetail = function () {

}

function AskListData() {
  const vid = NoteStore.getters.getCurrentView.id;
  console.log("getElist", NoteStore.getters.getCurrentView)
  Axios.get("/elist/getEList", {
    params: {
      viewId: vid
    }
  }).then((res) => {
    if (res.code === 200) {
      console.log("ask for elist", res);
      const elist = {
        id: res.data.elist.id,
        viewId: res.data.elist.viewId,
        datas: res.data.elist.datas
      }
      NoteStore.commit("saveCurrentViewData", elist)
    }
  }).catch(function (error) {
    console.log(error);
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, '加载失败，请重试'),
    })
  });
}

const ShowItemDw = (index) => {
  drawer1.value = true;
  form.index = index
  form.date = Date.now();
}
</script>

<style lang="scss" scoped>

.list_drawer_contrainer {
  :deep( .el-drawer.rtl ) {
    height: auto;
    margin-top: 350px;
    margin-bottom: 20px;
  }

  position: relative;
  height: auto;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-scrollbar__wrap) {
  width: 100% !important;
}

.todoList_container {
  flex-shrink: 0;
  display: flex;
  height: 50px;
  margin: 10px;
  text-align: center;


  border-radius: 4px;
}


.list { //单列表样式
  flex-shrink: 0;
  border-radius: 4px;
  width: 500px;
  margin-left: 10px;
  margin-right: 10px;
}

.lists { //多列表样式
  flex-shrink: 0;
  text-align: center;
  border-radius: 4px;
  width: 290px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>