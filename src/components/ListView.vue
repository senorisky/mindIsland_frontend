<template>
  <el-scrollbar>
    <div class="todoList_container">
      <div style="width: 23%" class="list" v-for="(item,index) in listData" :key="index">
        <el-table :data="item.items" max-height="300px" :cell-style="ItemStyle">
          <el-table-column class="list_tittle" prop="Todo" :label="item.colum"/>
        </el-table>
        <el-button class="mt-4" style="width: 100%" @click="onAddItem"
        >Add Item
        </el-button>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup name="ListView">

import {reactive} from "vue";

const listData = reactive([
  {
    colum: "Todo",
    items: []
  }, {
    colum: "Doing",
    items: []
  }, {
    colum: "Done",
    items: []
  }
])
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