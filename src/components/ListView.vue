<template>
  <!-- 多列表项组件 -->
  <div style="display: flex;justify-content: center">
    <el-scrollbar v-loading="loading.value"
                  element-loading-text="Loading this maybe cast seconds..."
                  style="height:350px;margin-bottom: 20px; overflow-y: hidden">
      <div class="todoList_container">
        <div :class='small?"lists":"list"' v-for="(item,index) in listData.value" :key="index">
          <el-table :data="item.items" max-height="300px"
                    :cell-style="ItemStyle" stripe>
            <el-table-column class="list_tittle" prop="name" :label="item.colum"/>
            <el-table-column align="right">
              <!--自定义表头-->
              <template #header>
                <el-button
                    size="small"
                    type="danger"
                    @click="DialogConfirm(index)"
                    :icon="Delete"
                />
              </template>
              <!--自定义表项 -->
              <template #default="scope">
                <el-button size="small" @click="ItemDetail(scope.$index, scope.row)" :icon="Edit"
                />
                <el-button
                    size="small"
                    :icon="Delete"
                    @click="deleteItem(index,scope.$index)"
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
      你正在删除一个动态列表，这是一个不可撤销的操作!!
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
  <CardView :drawer="drawer3" :data="ItemData.data" :index="ItemData.index"></CardView>
</template>

<script setup name="ListView">
import {computed, h, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import NoteStore from "../store/index"
import {ElNotification} from "element-plus";
import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import Axios from "@/utils/request";
import CardView from "@/components/CardView";
import Mitt from "@/EventBus/mitt";

const centerDialogVisible = ref(false)
const columIndex = ref();
const newColum = ref(null);
const formRef = ref(null)
const direction = ref('rtl')
const drawer1 = ref(false)
const drawer2 = ref(false)
const drawer3 = ref(false)
//{id:,vid:,items:[{colum:,items[{name:},{name:}....]},{colum:,items[]}.....]}  ListData
const listData = reactive({})
const ItemData = reactive({
  data: {},
  index: -1
});
// eslint-disable-next-line no-unused-vars
const listInfo = reactive({
  id: "",
  viewId: ""
})
const form = reactive({
  name: undefined,
  date: ref(""),
  des: "",
  type: "note",
  index: undefined
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
const small = computed({
  get() {
    //   console.log("style", listData.value.length > 1)
    if (listData.value.length > 1)
      return true;
    return false;
  }
})

const loading = computed({
  get() {
    return listData.value !== undefined;
  }
})
const lastvid = computed({
  get() {
    return NoteStore.getters.getCurrentView.id;
  }
})
const DialogConfirm = function (index) {
  console.log("弹出dialog")
  centerDialogVisible.value = true;
  columIndex.value = index;
}
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
  const tmp = {
    id: listInfo.id,
    viewId: listInfo.viewId,
    datas: listData.value
  }
  console.log("addItem", tmp)
  tmp.datas[form.index].items.push({
    name: form.name,
    date: form.date,
    des: form.desc
  })
  Axios.post("/elist/saveEList", {
    elist: tmp,
    url: ""
  }).then((res) => {
    if (res.code === 200) {
      console.log(res);
      listData.value = res.data.elist.datas;
    }
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, res.msg),
    })

  }).catch(function (error) {
    console.log(error);
    // alert('系统繁忙请联系管理员');
  });
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
  const tmp = {
    id: listInfo.id,
    viewId: listInfo.viewId,
    datas: listData.value
  }
  console.log("addlistColum", tmp)
  tmp.datas.push(list);
  Axios.post("/elist/saveEList", {elist: tmp, url: ""}, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    if (res.code === 200) {
      console.log("listAddColum", res);
      listData.value = res.data.elist.datas;
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, '添加失败'),
      })
      return;
    }
  }).catch(function (error) {
    console.log(error);
    // alert('系统繁忙请联系管理员');
  });
  drawer2.value = false;
}

const askData = function () {
  const vid = NoteStore.getters.getCurrentView.id;
  console.log("getElist", NoteStore.getters.getCurrentView)
  Axios.get("/elist/getEList", {
    params: {
      viewId: vid
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    if (res.code === 200) {
      console.log("ask for list", res);
      const elist = {
        id: res.data.elist.id,
        viewId: res.data.elist.viewId,
        datas: res.data.elist.datas
      }
      listData.value = elist.datas;
      listInfo.id = elist.id;
      listInfo.viewId = elist.viewId;
      console.log("ok", listData)
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
  console.log("listview mounted", listData)
  Mitt.on("CloseCardView", function () {
    drawer3.value = false;
  })
  if (listData.value === undefined) {
    askData()
  }
  watch(lastvid, (newValue, old) => {
    console.log("old vid", old)
    console.log("new value", newValue)
    if (newValue !== old && listData.value !== undefined) {
      const tmp = NoteStore.getters.getCurrenNote;
      for (let i of tmp.children) {
        console.log(i)
        if (i.id === newValue && i.component === "ListView") {
          askData()
        }
      }
    }
  })
})
onUnmounted(() => {
  Mitt.off("CloseCardView")
})
//index是下标位置，row是一个Proxy
const deletList = function (index) {
  centerDialogVisible.value = false;
  // console.log("deleteList", index)
  const tmp = {
    id: listInfo.id,
    viewId: listInfo.viewId,
    datas: listData.value
  }
  tmp.datas.splice(index, 1);
  console.log("deleteL", tmp.datas, index)
  Axios.post("/elist/saveEList", {elist: tmp, url: ""}, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    if (res.code === 200) {
      console.log("listAddColum", res);
      listData.value = res.data.elist.datas;
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, '删除失败'),
      })
      return;
    }
  }).catch(function (error) {
    console.log(error);
    // alert('系统繁忙请联系管理员');
  });
}
const deleteItem = function (Lindex, index) {
  // console.log("deleteItem", Lindex, index, row)
  const l = Lindex;
  const tmp = {
    id: listInfo.id,
    viewId: listInfo.viewId,
    datas: listData.value
  }
  let url = "";
  let poster = "";
  if (tmp.datas[l].items[index].url !== undefined) {
    url = tmp.datas[l].items[index].url;
  }
  if (tmp.datas[l].items[index].poster !== undefined) {
    poster = tmp.datas[l].items[index].poster;
  }
  // console.log("deleteListItem", tmp, index)
  tmp.datas[l].items.splice(index, 1);
  Axios.post("/elist/saveEList", {
    elist: tmp,
    url,
    poster
  }, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    if (res.code === 200) {
      console.log("deleteListItem", res);
      listData.value = res.data.elist.datas;
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, '删除失败'),
      })
      return;
    }
  }).catch(function (error) {
    console.log(error);
    // alert('系统繁忙请联系管理员');
  });
}
const ItemDetail = function (index, row) {
  drawer3.value = true;
  console.log(index, row)
  ItemData.data = row;
  ItemData.index = index;
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