<template>
  tableView<br>
  <el-button type="primary" size="default" @click="addColumn">添加列</el-button>
  <el-button type="primary" size="default" @click="submit">提交</el-button>
  <el-table :data="tableData" border style="width: 100%" ref="myTable">
    <el-table-column prop="date" label="name" width="180"></el-table-column>
    <el-table-column prop="name" label="time" width="180"></el-table-column>
    <!-- 动态列 -->
    <el-table-column
        v-for="(item, index) in dynamicColumns"
        :key="index"
        :prop="item.prop"
    >
      <template #header>
        {{ item.label }}
        <i
            class="el-icon-remove"
            style="color:red;cursor:pointer;"
            @click="deleteColumn(index)"
        ></i>
      </template>
      <template v-slot="scope">
        <el-input
            v-if="isEdit"
            v-model="scope.row.custom[item.prop]"
            placeholder="请输入内容"
        ></el-input>
        <span v-else>{{ scope.row.custom[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>

</template>

<script setup>
import {onBeforeMount, onMounted, reactive, ref} from "vue";

const addColumn = function () {
  this.$prompt("请输入列名", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  }).then(({value}) => {
    dynamicColumns.push({
      prop: value,
      label: value
    });
  });
}
// eslint-disable-next-line no-unused-vars
const isEditHeader = ref(false)
const isEdit = ref(true)
const tableData = reactive([
  {
    date: "2016-05-02",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1518 弄",
    custom: ""
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
    custom: "{\"测试\": 1}"
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
    custom: "{\"测试\": 1, \"字段2\": \"哈哈哈\"}"
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
    custom: "{\"测试\": 1}"
  }
])
// eslint-disable-next-line no-unused-vars
const propArr = reactive([]) // 生成dynamicColumns时的记录
const dynamicColumns = reactive([]) // 存放动态列

const deleteColumn = function (index) {
  dynamicColumns.splice(index, 1);
}
const submit = function () {
  //转换成jsonObject全部提交
  let arr = [];
  tableData.forEach(data => {
    let temp = {};
    temp.name = data.name; // 这里改成后端要求的id即可
    let obj = {};
    dynamicColumns.forEach(col => {
      // 仅把有效的列提交
      if (data.custom[col.prop]) {
        obj[col.prop] = data.custom[col.prop];
      }
    });
    if (JSON.stringify(obj) !== "{}") {
      temp.custom = JSON.stringify(obj);
    }
    arr.push(temp);
  });
}
onBeforeMount(() => {

})
onMounted(() => {

})
</script>

<style scoped>

</style>