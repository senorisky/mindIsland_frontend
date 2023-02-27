<template>
  <!--  展示Note中的view列表-->
  <div>
    <el-scrollbar height="400px">
      <div class="List_container">
        <div class="list" v-for="(item,index) in listData" :key="index" @click="ToViewDetail(item)">
          <el-input class="child" readonly v-model="item.name"></el-input>
          <el-date-picker
              style="width: 500px"
              v-model="item.createTime"
              type="datetime"
              readonly
              format="YYYY-MM-DD hh:mm:ss"
              value-format="x"
          />
        </div>
      </div>
    </el-scrollbar>
  </div>

</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import NoteStore from "../store/index"

let noteNotNULL = ref(false)
onMounted(() => {
  if (NoteStore.getters.getCurrenNote !== null) {
    console.log("profile", NoteStore.getters.getCurrenNote)
    const name = NoteStore.getters.getCurrenNote.name
    if (name !== undefined) {
      noteNotNULL.value = true;
    }
  }
  console.log(noteNotNULL)
})
const ToViewDetail = function (item) {
  console.log("profileRouter", item)
  // router.push()
}
const listData = computed({
  get() {
    console.log("Profile")
    return NoteStore.getters.getCurrenNote.children;
  },
})
</script>

<style lang="scss" scoped>


.list:hover :deep(.el-input) {
  background: #f5f5f5;
}

.list { //单列表样式
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  width: 500px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;

  :deep(.el-input__wrapper) {
    background: transparent;
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
    border-radius: 30px;
    //border: none;
  }
}

.child {
  font-size: 24px !important;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
      font-weight: 550 !important;
    }
  }
}

.ItemStyle {
  height: 40px;
  margin-bottom: 10px;
}

.List_container {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 50px;
  margin: 10px 10px 10px 120px;
  text-align: center;
  border-radius: 4px;
}

.scroll_bar_item {;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 70%;
  margin: 10px 10px 10px 100px;
  text-align: center;
  border-radius: 4px;
  /*background: var(--el-color-primary-light-9);*/

}
</style>
