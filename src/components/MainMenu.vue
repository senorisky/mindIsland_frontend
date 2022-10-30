<template>
  <div>
    <template v-for="item in props.menuData" :key="item.id">
      <!-- 有child就显示child的下拉型菜单，有小箭头 -->
      <div v-if="item.children&&item.children.length" :index="item.id" @click="showNote(item)">
        <el-sub-menu class="noteItem" :index="item.id">
          <template #title>
            <span :class="icon.name"></span>
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
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
      <div v-if="catchDeep(item.type)" style="height: 7px;width: 180px;background: #f5f5f5"></div>
    </template>
  </div>
</template>

<script setup name=" MainMenu">
// eslint-disable-next-line no-undef

import {reactive} from "vue";
import Mitt from "@/EventBus/mitt";

// eslint-disable-next-line no-unused-vars
const showNote = function (item) {
  console.log("点击Note, children")
  // console.log(item.isOpen)
  //父结点

  // console.log(item.isOpen)
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
    console.log(item.type)
    Mitt.emit("MenuRouter", noteName)
  } else {
    console.log("点击NoteView")
    Mitt.emit("ViewRouter", item)
  }

}
const catchDeep = function (type) {
  if (type == "note") {
    return true;
  }
  return false;
}
const icon = reactive({
  name: ""
})
// eslint-disable-next-line no-undef
const props = defineProps({
  menuData: {
    type: Array
  }
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