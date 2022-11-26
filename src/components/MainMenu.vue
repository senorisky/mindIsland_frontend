<template>
  <div>
    <template v-for="item in props.menuData" :key="item.id">
      <!-- 有child就显示child的下拉型菜单，有小箭头 -->
      <div v-if="item.children&&item.children.length" :index="item.id" @click="showNote(item)">
        <el-sub-menu class="noteItem" :index="item.id">
          <template #title>
            <el-icon :class="item.icon">
            </el-icon>
            <span class="low_span">{{ item.name }}</span>
          </template>
          <div @click.stop>
            <MainMenu :menuData="item.children"></MainMenu>
          </div>
        </el-sub-menu>
      </div>
      <!-- 没有子节点，使用 el-menu-item 渲染 -->
      <el-menu-item class="noteItem" v-else :index="item.id" v-on:click=showNoteView(item)>
        <template #title>
          <el-icon :class="item.icon">
          </el-icon>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
      <div v-if="catchDeep(item.type)" style="height: 7px;width: 180px;background: #f5f5f5">
      </div>
    </template>
  </div>


</template>

<script setup name="MainMenu">

// eslint-disable-next-line no-unused-vars
import {onMounted, reactive} from "vue";
import Mitt from "@/EventBus/mitt";
import router from "@/router";
import NoteStore from "../store/index";

// eslint-disable-next-line no-unused-vars
const showNote = function (item) {
  console.log("点击Note, children")
  if (item.type === "note") {
    const noteName = item.name
    // console.log(item.type)
    Mitt.emit("MenuRouter", noteName)
  }
}
// eslint-disable-next-line no-unused-vars
const showNoteView = function (item) {
//  点击menuItem触发  手动切换路由 全局事件总线
  //父结点
  if (item.type === "note") {
    console.log("点击Note,no children")
    const noteName = item.name
    console.log(router.getRoutes())
    Mitt.emit("MenuRouter", noteName)
  } else if (item.type === "view") {
    console.log(router.getRoutes())
    const cname = NoteStore.getters.getCurrenNote.name;
    console.log("点击NoteView", cname)
    if (cname !== item.fname) {
      console.log("跨父级跳转", item.fname)
      Mitt.emit("MenuRouter", item.fname)
    }
    Mitt.emit("ViewRouter", item)
  } else if (item.type === "page") {
    console.log("点击Page")
    Mitt.emit("PageRouter", item.name)
  } else {
    console.log("error!!")
  }

}
const catchDeep = function (type) {
  if (type === "note" || type === "page") {
    return true;
  }
  return false;
}
// eslint-disable-next-line no-undef
const props = defineProps({
  menuData: {
    type: Array
  }
})
onMounted(() => {
})
</script>

<style lang="scss">
.el-icon {

}

.el-sub-menu__title {
  line-height: 43px !important;

  height: 43px !important;
}


.el-sub-menu.noteItem {
  line-height: 43px !important;
}

.el-menu-item.noteItem {
  line-height: 13px !important;
  height: 43px !important;
  min-width: 180px !important;
  padding: 20px !important;
  width: 180px !important;
}

.word {
  font-size: 5px;
}
</style>