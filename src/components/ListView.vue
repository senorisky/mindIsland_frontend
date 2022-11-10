<template>
  <!-- 多列表项组件 -->
  <el-scrollbar v-loading="loading"
                element-loading-text="Loading this maybe cast seconds..."
                style="height:350px;margin-bottom: 20px; overflow-y: hidden">
    <div class="todoList_container">
      <div :class='small?"list":"lists"' v-for="(item,index) in listData.value" :key="index">
        <el-table :data="item.items" max-height="300px" :cell-style="ItemStyle" stripe>
          <el-table-column class="list_tittle" prop="name" :label="item.colum"/>
        </el-table>
        <el-button class="mt-4" style="width: 100%;" @click="ShowItemDw(index)"
        >Add Item
        </el-button>
      </div>
    </div>
  </el-scrollbar>
  <div class="drawer_contrainer">
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
  </div>
</template>

<script setup name="ListView">
import {computed, h, onBeforeMount, reactive, ref, toRaw} from "vue";
import Axios from "@/utils/request";
import NoteStore from "../store/index"
import {ElNotification} from "element-plus";

let curindex = ref(null);
const formRef = ref(null)
const form = reactive({
  name: undefined,
  date: ref(""),
  desc: "",
  type: "note"
})
let drawer1 = ref(false)
const small = computed({
  get() {
    return listData.length > 2;
  }
})
const ItemStyle = reactive({
  "display": "block",
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
  const vid = NoteStore.getters.getCurrentView.viewId;
  // console.log("getElist", vid)
  const tmp = toRaw(listData);
  tmp.value[curindex.value].items.push({
    name: form.name,
    date: form.date,
    des: form.desc
  })
  const elist = {
    id: NoteStore.getters.getCurrentView.id,
    viewId: vid,
    datas: tmp.value
  }
  // console.log("addItem", listData.value[curindex.value])
  Axios.post("/elist/saveEList", elist).then((res) => {
    if (res.code === 200) {
      console.log(res);
      listData.value = res.data.elist.datas
      NoteStore.commit("saveListData", listData)
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, '添加失败，请稍后重试'),
      })
      return;
    }
  }).catch(function (error) {
    console.log(error);
    // alert('系统繁忙请联系管理员');
  });
  formRef.value.resetFields();
  drawer1.value = false;
}
const loading = ref(true)
const listData = reactive([])
onBeforeMount(() => {
  console.log("list beforemount")
  AskListData()
})

function AskListData() {
  const vid = NoteStore.getters.getCurrentView.viewId;
  console.log("getElist", vid)
  Axios.get("/elist/getEList", {
    params: {
      viewId: vid
    }
  }).then((res) => {
    console.log("ask for elist", res);
    loading.value = false;
    const elist = {
      id: res.data.elist.id,
      viewId: res.data.elist.viewId,
      items: res.data.elist.datas
    }
    listData.value = res.data.elist.datas
    // console.log(listData)
    NoteStore.commit("saveCurrentView", elist)
  }).catch(function (error) {
    loading.value = false;
    console.log(error);
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, '加载失败，请重试'),
    })
  });
}

const ShowItemDw = (index) => {
  drawer1.value = true;
  curindex.value = index;
  form.date = Date.now();
}
</script>

<style lang="scss" scoped>
.drawer_contrainer {
  position: relative;
  height: auto;
}

:deep( .el-drawer.rtl ) {
  height: auto;
  margin-bottom: 20px;

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

.list_tittle {
  position: absolute;
  width: 100%;
}

.list {
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  position: relative;
  width: 280px;
  margin-left: 10px;
  margin-right: 10px;
}

.lists {
  flex-shrink: 0;
  text-align: center;
  border-radius: 4px;
  width: 40%;
  margin-left: 10px;
  margin-right: 10px;
}
</style>