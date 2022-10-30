<template>
  <div class="todoList_container">
    <div style="width: 33%" class="list">
      <el-table :data="todoData" max-height="300px" :cell-style="ItemStyle">
        <el-table-column class="list_tittle" prop="Todo" label="Todo"/>
      </el-table>
      <el-button class="mt-4" style="width: 100%" @click="onAddItem"
      >Add Item
      </el-button>
    </div>
    <div style="width: 33%" class="list">
      <el-table :data="doingData" max-height="300px" :cell-style="ItemStyle">
        <el-table-column class="list_tittle" prop="Doing" label="Doing"/>
      </el-table>
      <el-button class="mt-4" style="width: 100%" @click="onAddItem"
      >Add Item
      </el-button>
    </div>
    <div style="width: 33%" class="list">
      <el-table :data="doneData" max-height="300px" :cell-style="ItemStyle">
        <el-table-column class="list_tittle" prop="Done" label="Done"/>
      </el-table>
      <el-button class="mt-4" style="width: 100%" @click="onAddItem"
      >Add Item
      </el-button>
    </div>
  </div>
</template>

<script setup name="ListView">

import {reactive} from "vue";

const deleteRow = (index) => {

}
const ItemStyle = reactive({
  "display": "block",
  "color": "inherit",
  " text-decoration": "none",
  "box-shadow": " rgb(15 15 15 / 10%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 2px 4px",
  "border-radius": "4px",
  "background": "white",
  "overflow": "hidden",
  "transition": "background 100ms ease-out 0s",
  "margin-bottom": " 5px",
  "position": "static"
})

const onAddItem = () => {

}
</script>

<style lang="scss" scoped>
.el-table {

}

.todoList_container {

  display: flex;
}

.list_tittle {
  position: absolute;
  width: 100%;

}

.list {
  position: relative;
  margin-left: 10px;
  margin-right: 10px;

}

</style>