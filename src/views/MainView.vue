<template>
  <!-- el-sub-menu和el-menu-item 可能会有多层嵌套，所以抽取出来封装成递归组件-->
  <div class="menuBar">
    <el-menu unique-opened="true">
      <MainMenu :menuData="menuData"></MainMenu>
    </el-menu>
  </div>
  <div class="note_content">
    <RouterView></RouterView>
  </div>
</template>

<script setup name="MainView">
import MainMenu from "@/components/MainMenu";
// import HeaderView from "@/components/HeaderView";
// eslint-disable-next-line no-unused-vars
import NoteViews from "@/components/NoteViews";
// eslint-disable-next-line no-unused-vars
import {onBeforeMount, onMounted, onUnmounted, reactive, ref, toRaw} from "vue";
import Mitt from "@/EventBus/mitt";
import router from "@/router";
import UserStore from "../store/index"
import NoteStore from "../store/index"
import axios from "axios";


const menuData = reactive(NoteStore.getters.getMenuData);
console.log("菜单数据", menuData)
onMounted(() => {
  //只点击note
  Mitt.on("MenuRouter", (noteName) => {
    const lastNodeName = NoteStore.getters.getCurrenNote.name;
    console.log(lastNodeName, noteName)
    if (noteName !== lastNodeName) {
      NoteStore.commit("saveCurrentNote", noteName)
      console.log("当前note", NoteStore.getters.getCurrenNote)
      router.push({
        name: noteName + "Profile",
        params: {
          note: noteName
        }
      });
    }
  })
})
onUnmounted(() => {
  Mitt.off("MenuRouter")
})
</script>

<style scoped>


/* 左侧样式 */
.menuBar {
  position: absolute;
  padding-left: 7px;
  padding-right: 4px;
  width: 180px;
  top: 0px; /* 距离上面50像素 */
  left: 0px;
  bottom: 0px;
  overflow-y: false; /* 当内容过多时y轴出现滚动条 */
  background-color: #f5f5f5;
}

/* 主区域 */
.note_content {
  position: absolute;
  top: 0px;
  left: 191px;
  bottom: 0px;
  right: 0px; /* 距离右边0像素 */
  margin-left: 100px;
  overflow-y: auto; /* 当内容过多时y轴出现滚动条 */
  /* background-color: red; */
}
</style>