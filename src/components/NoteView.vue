<template>

  <!--   根据noteview不同来装载不同的view内容 -->
  <!--  封装组件  用于展示一个Note的内容-->
  <div class="head_container">
    <!--  小图标  标题-->
    <div style="height: 60px"></div>
    <div class="deepInput">
      <el-input v-model="noteName" class="PageName" readonly placeholder="Name"></el-input>
      <el-input v-model="noteTime" class="PageTime" readonly placeholder="time"></el-input>
      <el-input v-model="noteInfo" class="PageProfile" type="text" placeholder="profile"></el-input>
      <el-divider style="margin-bottom: 15px !important;"/>
    </div>
  </div>
  <!--  每一个note中添加的功能项-->
  <div class="note-view-tags">
    <el-tag
        @click="Viewdetail(tag)"
        size="large"
        v-for="(tag,index) in NoteStore.getters.getCurrenNote.children"
        :key="tag"
        class="button-new-tag ml-1"
        :disable-transitions="false"
        @close="DialogConfirm(tag,index)"
        closable
        effect="plain"
    >
      {{ tag.name }}
    </el-tag>
    <el-button class="button-new-tag ml-1" size="default" @click="drawer=true">
      + New View
    </el-button>
  </div>
  <span class="border"></span>
  <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
    <span>
      You are deleting a view, please confirm. This is an operation that cannot be undone!!
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDelete">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="view-page">
    <RouterView ></RouterView>
  </div>
  <div class="note_drawer">
    <!--   添加view的抽屉 -->
    <el-drawer
        v-model="drawer"
        title="Pick a view "
        :direction="direction"
    >
      <el-row>
        <el-col>
          <el-input class="deepInput" placeholder="输入view的名称 或采用默认名" v-model="v_name"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="8">
          <div class="grid-content ep-bg-purple addViews" @click="addGallry">
            <el-icon class="iconfont el-icon-gallery "></el-icon>
            <div style="margin-top: 5px">画廊</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ep-bg-purple addViews" @click="addList">
            <el-icon class="iconfont el-icon-nav-list"></el-icon>
            <div>多列表</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ep-bg-purple addViews" @click="addTable">
            <el-icon class="iconfont el-icon-table ">
            </el-icon>
            <div>表格</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="8">
          <div class="grid-content ep-bg-purple addViews" @click="addSingleList">
            <el-icon class="iconfont el-icon-danxiangxuanze "></el-icon>
            <div style="margin-top: 5px">单列表</div>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>

</template>

<script setup name="NoteView">
import {computed, onMounted, onUnmounted, ref} from 'vue'
import Mitt from "@/EventBus/mitt";
import NoteStore from "@/store";
import {nanoid} from "nanoid"
import {formatTime} from "@/utils/formatTime";
import router from "@/router";

const v_name = ref("");
const centerDialogVisible = ref(false)
const dtag = ref();
const dtagindex = ref();
const DialogConfirm = function (tag, index) {
  console.log("删除view", tag, index)
  centerDialogVisible.value = true;
  dtag.value = tag;
  dtagindex.value = index;
}
const drawer = ref(false)
const direction = ref('rtl')

const handleDelete = function () {
  const data = {
    view: dtag.value,
    index: dtagindex.value
  }
  NoteStore.dispatch("deleteView", data);
  centerDialogVisible.value = false;
  //删了view之后会在vuex跳转到note的主页
}
const addTable = function () {
  const parent_name = NoteStore.getters.getCurrenNote.name;
  const nid = NoteStore.getters.getCurrenNote.id;
  const view_name = ref("Table");
  if (v_name.value !== "") {
    view_name.value = v_name.value;
  }
  const view_id = nanoid(10)
  const table = {
    name: view_name.value,
    fname: parent_name,
    id: view_id,
    noteId: nid,
    icon: "iconfont el-icon-dian1",
    createTime: Date.now(),
    type: "view",
    path: parent_name + "/" + view_id,
    component: "TableView",
    isOpen: false
  }
  NoteStore.dispatch("addChild", table)
}
const addSingleList = function () {
  const parent_name = NoteStore.getters.getCurrenNote.name;
  const nid = NoteStore.getters.getCurrenNote.id;
  const view_name = ref("SList")
  if (v_name.value !== "") {
    view_name.value = v_name.value;
  }
  const view_id = nanoid(10);
  const List = {
    name: view_name.value,
    fname: parent_name,
    noteId: nid,
    createTime: Date.now(),
    id: view_id,
    icon: "iconfont el-icon-dian1",
    type: "view",
    path: parent_name + "/" + view_id,
    component: "sListView",
    isOpen: false
  }
  NoteStore.dispatch("addChild", List)
}
const addList = function () {
  const parent_name = NoteStore.getters.getCurrenNote.name;
  const nid = NoteStore.getters.getCurrenNote.id;
  const view_name = ref("List")
  if (v_name.value !== "") {
    view_name.value = v_name.value;
  }
  const view_id = nanoid(10);
  const List = {
    name: view_name.value,
    fname: parent_name,
    noteId: nid,
    createTime: Date.now(),
    id: view_id,
    icon: "iconfont el-icon-dian1",
    type: "view",
    path: parent_name + "/" + view_id,
    component: "ListView",
    isOpen: false
  }
  NoteStore.dispatch("addChild", List)
}
const addGallry = function () {
  const parent_name = NoteStore.getters.getCurrenNote.name;
  const nid = NoteStore.getters.getCurrenNote.id;
  const view_name = ref("Gallery")
  if (v_name.value !== "") {
    view_name.value = v_name.value;
  }
  const view_id = nanoid(10)
  const Gallery = {
    name: view_name.value,
    fname: parent_name,
    id: view_id,
    noteId: nid,
    icon: "iconfont el-icon-dian1",
    createTime: Date.now(),
    type: "view",
    path: parent_name + "/" + view_id,
    component: "GalleryView",
    isOpen: false
  }
  NoteStore.dispatch("addChild", Gallery)
}
const Viewdetail = function (tag) {
//  替换 routerview 显示数据
  console.log("tagRouter", tag)
  const vid = tag.id
  const lastView = NoteStore.getters.getCurrentView;
  if (tag.id !== lastView.id) {
    console.log(tag.type, vid)
    NoteStore.commit("saveCurrentViewData", new Object())
    NoteStore.commit("saveCurrentViewById", vid);
    console.log("点击NoteView了")
    router.push({
      name: vid
    })
  }
}
const noteName = computed({
  get() {
    return NoteStore.getters.getCurrenNote.name;
  }, set(value) {
    NoteStore.dispatch("changeNoteName", value)
  }
})
const noteTime = computed({
  get() {
    const timeStamp = NoteStore.getters.getCurrenNote.createTime;
    return formatTime(timeStamp);
  }
})
const noteInfo = computed({
  get() {
    return NoteStore.getters.getCurrenNote.info;
  }, set(value) {
    NoteStore.dispatch("changeNoteInfo", value)
  }
})

// let views = reactive([]);
onMounted(() => {
//点击note的view
  Mitt.on("ViewRouter", (item) => {
    //数据
    const vid = item.id
    const lastView = NoteStore.getters.getCurrentView;
    console.log("lastview", lastView)
    if ((lastView === null) || (item.id !== lastView.id)) {
      console.log(item.type, vid)
      NoteStore.commit("saveCurrentViewById", vid);
      console.log("点击NoteView了")
      router.push({
        name: vid
      });
    }
  })
})
onUnmounted(() => {
  Mitt.off("ViewRouter")
})
</script>

<style lang="scss" scoped>


.el-button {
  margin-right: 5px !important;
  margin-left: 0 !important;
}

:deep(.el-tag) {
  margin-right: 5px;
}

:deep(.el-tag):hover {
  background: #f5f5f5;
  cursor: pointer;
}

:deep(.el-drawer.rtl) {
  height: auto;
  margin-top: 270px;
  margin-bottom: 20px;
}

:deep(.el-overlay) {
  background-color: transparent !important;
  margin-right: 20px;
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

.note_drawer {
  :deep( .el-drawer ) {
    background-color: #f1f5f7;
    border-radius: 15px;
    box-shadow: var(--el-alert-bg-color);
    width: 25% !important;
  }
}


.button-new-tag {
  --el-button-hover-border-color: #dcdcdc !important;
  --el-button-hover-bg-color: #f5f5f5;
}

.note-view-tags {
  display: flex;
}

.view-page {

}

.border {
  margin-left: 3px;
  display: inline-block;
  padding-top: 3px;
  width: 100%;
  border-top: 1px solid #DCDCDC;
}

.addViews {
  border: 5px #4B70E2;
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
}

.addViews:hover, .addViews:focus, .addViews:active {
  -webkit-transform: scale(0.8);
  transform: scale(0.8);
}


.el-input.PageName {
  margin-top: 20px;
  font-size: 48px !important;
  line-height: 48px !important;
  --el-input-height: 64px !important;
}

.el-input.PageTime {
  margin-top: 5px;
  font-size: 16px !important;
}

.el-input.PageProfile {
  margin-top: 10px;
  font-size: 16px !important;
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

</style>