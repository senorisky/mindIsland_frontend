<template>
  <el-scrollbar class="menuBar">
    <!--侧边主菜单-->
    <div>
      <div style="margin-bottom: 6px">
        <p>{{ UserStore.getters.getUser.name }}</p>
        <el-input @click="showSeaChDialog" class="w-50 m-2" placeholder="search">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search/>
            </el-icon>
          </template>
        </el-input>
      </div>
      <!-- el-sub-menu和el-menu-item 可能会有多层嵌套，所以抽取出来封装成递归组件-->
      <el-menu unique-opened>
        <div style="height: 7px;width: 180px;background: #f5f5f5"></div>
        <!-- 没有子节点，使用 el-menu-item 渲染 -->
        <MainMenu :menuData="NoteStore.getters.getMenuData"></MainMenu>
      </el-menu>
      <el-button round class="addPN" @click="showNPDrawer">Note & Page
      </el-button>
    </div>
  </el-scrollbar>
  <div class="note_content">
    <!--  Note的内容页  -->
    <RouterView></RouterView>
  </div>

  <div class="view_drawer_contrainer">
    <!--  添加note 或者page的抽屉 内有表单  -->
    <el-drawer
        v-model="drawer1"
        title="Give  basic  info"
        :direction="direction"
        :before-close="handleClose"
    >
      <el-form ref="formRef" :model="form" label-width="20px">
        <el-form-item prop="name" class="deepInput">
          <el-input v-model="form.name" placeholder="Name is required"/>
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
        <el-form-item prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="note"/>
            <el-radio label="page"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="inputDeep">
          <el-input v-model="form.desc" type="textarea" placeholder="please give a simple description or not"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNote">Create</el-button>
          <el-button @click="CancelAdd">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
  <div class="searchDialog">
    <el-dialog
        :before-close="beforeDialogClose"
        v-model="centerDialogVisible" title="搜索" :close-on-press-escape="true" width="40%"
        center>
      <div style="display: flex;flex-direction: column;">
        <el-input v-model="searchInput" @click="showSeaChDialog" @keydown.enter="search" class="w-50 m-2"
                  placeholder="可支持搜索note、page和view   enter确定">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search/>
            </el-icon>
          </template>
        </el-input>
        <el-table :data="seachRes" max-height="300px"
                  :cell-style="ItemStyle" stripe>
          <el-table-column style="width: 400px" label="结果">
            <template #default="scope">
              <div style=" display: flex;flex-direction: row;" @click="searchRouter(scope.row.id,scope.row.fid)">
                <span style="font-weight: bold;width: 300px;font-size: 18px"
                      v-text="scope.row.name"/>
                <span>           {{ scope.row.type }}---{{ scope.row.fname }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>

</template>

<script setup name="MainView">
import MainMenu from "@/components/MainMenu";

// eslint-disable-next-line no-unused-vars
import {h, onMounted, onUnmounted, reactive, ref, toRaw} from "vue";
import Mitt from "@/EventBus/mitt";
import router from "@/router";
import NoteStore from "../store/index"
import UserStore from "../store/index"
import {ElNotification} from "element-plus";
import {nanoid} from "nanoid";
//获得dom元素原型  ref绑定
const formRef = ref(null)
const searchInput = ref("")
let drawer1 = ref(false)
const centerDialogVisible = ref(false)
const direction = ref('rtl')
const seachRes = reactive([])
const ItemStyle = reactive({
  "height": "20px",
  "margin-bottom": " 10px",
})
const form = reactive({
  name: undefined,
  date: ref(""),
  desc: "",
  type: "note"
})
const handleClose = (done) => {
  //抽屉关闭
  done()
  formRef.value.resetFields();
}
const searchRouter = function (id, fid) {
  centerDialogVisible.value = false;
  if (fid !== undefined) {
    NoteStore.commit("saveCurrentNoteById", fid)
    NoteStore.commit("saveCurrentView", {})
    console.log("当前note", NoteStore.getters.getCurrenNote)
    searchInput.value = ""
    router.push({
      name: fid + "Profile",
    });
    const vid = id
    const lastView = NoteStore.getters.getCurrentView;
    console.log("lastview", lastView)
    if ((lastView === null) || (id !== lastView.id)) {
      NoteStore.commit("saveLastViewId", lastView.id)
      NoteStore.commit("saveCurrentViewById", vid);
      console.log("点击NoteView了")
      router.push({
        name: vid
      });
    }
  } else {
    NoteStore.commit("saveCurrentNoteById", id)
    NoteStore.commit("saveCurrentView", {})
    console.log("当前note", NoteStore.getters.getCurrenNote)
    router.push({
      name: id + "Profile",
    });
  }
}
const showSeaChDialog = function () {
  centerDialogVisible.value = true;
}
const beforeDialogClose = function () {
  searchInput.value = ""
  seachRes.length = 0
  // console.log(seachRes)
  // Vue3必须通过myArray.length = 0的方式清空数组，不能直接让它等于[]或重新声明
  centerDialogVisible.value = false
}
const search = function () {
  const inputValue = searchInput.value.trim()
  if ("" === inputValue) {
    return;
  }
  seachRes.length = 0;
  const menu = NoteStore.getters.getMenuData;
  // console.log(menu)
  const tmp = toRaw((menu))
  for (let item of tmp) {
    if (item.name.indexOf(inputValue) !== -1) {
      let i = reactive({})
      i.name = item.name;
      i.type = item.type;
      i.time = item.createTime
      i.id = item.id
      seachRes.push(i);
    }
    if (item.children && item.children.length > 0) {
      for (let child of item.children) {
        if (child.name.indexOf(inputValue) !== -1) {
          let j = reactive({})
          j.name = child.name;
          j.type = child.type;
          j.time = child.createTime
          j.fname = child.fname
          j.fid = item.id
          j.id = child.id
          seachRes.push(j);
        }
      }
    }
  }
  // console.log(seachRes)
}
const CancelAdd = function () {
  formRef.value.resetFields();
  form.desc = ""
  drawer1.value = false;
}
//添加note或者page
const showNPDrawer = function () {
  drawer1.value = true;
  form.date = Date.now();
}
const addNote = function () {
  if (form.name !== undefined && form.type !== undefined) {
    const np = NoteStore.getters.getMenuData;
    const inputName = form.name.toString.trim();
    var judgeFn = new RegExp(/\s+/g);
    if (judgeFn.test(inputName)) {
      ElNotification({
        title: '提示',
        type: 'warning',
        message: h('i', {style: 'color: teal'}, 'Note或者Page的名字不允许包含空格'),
      })
    }
    for (let i in np) {
      if (np[i].name === inputName) {
        ElNotification({
          title: '提示',
          type: 'warning',
          message: h('i', {style: 'color: teal'}, 'Note或者Page的名字不允许重复'),
        })
        return;
      }
    }
    if (form.type === "note") {
      const nid = nanoid(8)
      const note = {
        id: UserStore.getters.getUser.id + nid,
        name: form.name,
        info: form.desc,
        userId: UserStore.getters.getUser.id,
        type: "note",
        fname: "",
        path: "",
        createTime: Date.now(),
        icon: "iconfont el-icon-note",
        component: "NoteView",
        isOpen: false,
        children: []
      }
      NoteStore.dispatch("addNote", note)
    } else if (form.type === "page") {
      const pid = nanoid(8)
      const page = {
        id: UserStore.getters.getUser.id + pid,
        name: form.name,
        userId: UserStore.getters.getUser.id,
        info: form.desc,
        type: "page",
        fname: "",
        createTime: Date.now(),
        path: "",
        icon: "iconfont el-icon-13",
        component: "ViewPage",
        isOpen: false,
        children: []
      }
      NoteStore.dispatch("addPage", page)
    }
  }
  formRef.value.resetFields();
  form.desc = ""
  drawer1.value = false;
}
const MenuRouter = function (noteName) {
  const lastNodeName = NoteStore.getters.getCurrenNote.name;
  if (noteName !== lastNodeName) {
    localStorage.setItem("currentNote", noteName)
    NoteStore.commit("saveCurrentNoteByName", noteName)
    NoteStore.commit("saveCurrentView", {})
    const nid = NoteStore.getters.getCurrenNote.id
    console.log("当前note", NoteStore.getters.getCurrenNote)
    router.push({
      name: nid + "Profile",
    });
  }
}
const PageRouter = function (pageName) {
  const lastNodeName = NoteStore.getters.getCurrenNote.name;
  // console.log("lastNode", lastNodeName)
  if (pageName !== lastNodeName) {
    localStorage.setItem("currentNote", pageName)
    NoteStore.commit("saveCurrentNoteByName", pageName)
    const pid = NoteStore.getters.getCurrenNote.id
    NoteStore.commit("saveLastViewId", pid);
    console.log("当前note", NoteStore.getters.getCurrenNote)
    router.push({
      name: pid,
    });
  }
}
onMounted(() => {
  //只点击带孩子的note进行的路由跳转
  Mitt.on("MenuRouter", MenuRouter)
  Mitt.on("PageRouter", PageRouter)
})
onUnmounted(() => {
  Mitt.off("MenuRouter")
  Mitt.off("PageRouter")
})
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

.searchDialog {
  :deep(.el-dialog) {
    border-radius: 10px 10px 10px 10px !important;
  }
}

.view_drawer_contrainer {
  position: relative;

  :deep( .el-overlay) {
    background-color: transparent !important;
    margin-right: 20px;
  }

  :deep( .el-drawer.rtl ) {
    height: auto;
    margin-top: 270px;
    margin-bottom: 20px;
  }

  :deep( .el-drawer ) {
    background-color: #f1f5f7;
    border-radius: 15px;
    box-shadow: var(--el-alert-bg-color);
    width: 30% !important;
  }
}

:deep(::-webkit-scrollbar) {
  display: none;
}

:deep( .el-menu-item) {
  height: 43px !important;
  line-height: 43px !important;
}

.addPN {
  line-height: 13px !important;
  height: 43px !important;
  min-width: 180px !important;
  padding: 0px !important;
  width: 180px !important;
  background-color: #F0F8FF !important;
}

.setting {
  line-height: 13px !important;
  height: 43px !important;
  min-width: 180px !important;
  padding: 0px !important;
  width: 180px !important;
  background-color: #ffffff !important;
}

.deepInput {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
    }
  }
}

.inputDeep {
  :deep(.el-textarea__inner) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    resize: none;
    cursor: default;
  }
}


/* 左侧样式 */
.menuBar {
  position: absolute;
  padding-left: 7px;
  padding-right: 10px;
  width: 180px;
  top: 0px; /* 距离上面50像素 */
  left: 0px;
  bottom: 0px;
  overflow-y: auto; /* 当内容过多时y轴出现滚动条 */
  overflow-x: hidden;
  background-color: #f5f5f5;
}

/* 主区域 */
.note_content {
  position: absolute;
  margin-right: 150px;
  top: 0px;
  left: 197px;
  height: 100%;
  bottom: 0px;
  right: 0px; /* 距离右边0像素 */
  margin-left: 150px;
  overflow-x: hidden; /* 当内容过多时y轴出现滚动条 */
  overflow-y: auto;
  /* background-color: red; */
}
</style>
