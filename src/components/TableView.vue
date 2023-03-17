<template>
  <div style="display: flex" v-loading="loading.value">
    <el-table :data="tableData.value" max-height="350"
              :lazy="true"
              style="width: 100%" stripe ref="myTable" align="left"
              table-layout="fixed">
      <!-- 动态列 -->
      <el-table-column
          v-for="(item, index) in dynamicColumns.value"
          :key="index"
          :property="item"
          :label="item"
          width="180"
      >
        <!--  自定义表头-->
        <template #header>
          <div style="display: flex;justify-content:space-between;align-items:flex-end;">
            <span style="margin-left: 10px">{{ item }}</span>
            <el-button
                size="small"
                @click="DialogConfirm(item)"
                :icon="Delete"></el-button>
          </div>
        </template>
        <!--可编辑表格-->
        <template #default="scope">
          <div class="ItemCell">
            <el-input v-model="scope.row[scope.column.property]" placeholder="请输入内容" @blur="SaveTable"></el-input>
          </div>
        </template>

      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="100">
        <template #default="scope">
          <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deleteRow(scope.$index)"
          >
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flow; margin-left: 10px">
      <el-row>
        <el-button style="margin-bottom: 20px" size="default" @click="drawer1=true">添加列</el-button>
      </el-row>
      <el-row>
        <el-button size="default" @click="addTableItem">添加项</el-button>
      </el-row>
    </div>
  </div>
  <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
    <span>
      You are deleting c column in a table, please confirm. This is an operation that cannot be undone!!
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteColumn(columIndex)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="table_drawer_contrainer">
    <!--  列表项的抽屉  -->
    <el-drawer
        v-model="drawer1"
        title="Give  basic  info"
        direction="rtl"
        :before-close="handleClose"
    >
      <el-input v-model="name" placeholder="Give a new Colum name"/>

      <div style="margin-top: 30px">
        <el-button type="primary" @click="addColumn">Create</el-button>
        <el-button @click="drawer1=false">Cancel</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import {computed, h, onMounted, reactive, ref, watch} from "vue";
import NoteStore from "../store/index"
import {Delete} from "@element-plus/icons-vue";
import Axios from "@/utils/request";
import {ElNotification} from "element-plus";

const centerDialogVisible = ref(false)
const columIndex = ref();
const DialogConfirm = function (index) {
  console.log("弹出dialog")
  centerDialogVisible.value = true;
  columIndex.value = index;
}
const name = ref("");
//增加列
const addColumn = function () {
  // console.log("添加table列")
  if (dynamicColumns.length >= 40) {
    ElNotification({
      title: '提示',
      message: "一个Table中不能超过40个动态列",
      type: "warning"
    })
    return
  }
  Axios.get("/etable/addTableColumn", {
    params: {
      name: name.value,
      viewId: tableInfo.viewId
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    if (res.code === 200) {
      console.log("addtableColumn", res.data)
      tableData.value = res.data.etable.datas;
      tableInfo.id = res.data.etable.id;
      tableInfo.viewId = res.data.etable.viewId;
      dynamicColumns.value = res.data.etable.colums
    }
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, res.msg),
    })
  }).catch(function (error) {
    console.log(error)
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "系统错误，请检查网络"),
    })
  })
  drawer1.value = false;
}
const drawer1 = ref(false);
// eslint-disable-next-line no-unused-vars
const isEditHeader = ref(false)
const tableData = reactive({})
const tableInfo = reactive({
  id: "",
  viewId: ""
})
const lastvid = computed({
  get() {
    return NoteStore.getters.getCurrentView.id;
  }
})
const loading = computed({
  get() {
    return tableData.value !== undefined;
  }
})
const handleClose = (done) => {
  //抽屉关闭
  done()
  name.value = "";
}
// eslint-disable-next-line no-unused-vars
const propArr = reactive([]) // 生成dynamicColumns时的记录
const dynamicColumns = reactive([])// 存放动态列

const SaveTable = function () {
  Axios.post("/etable/saveTable", {
        id: tableInfo.id,
        viewId: tableInfo.viewId,
        colums: dynamicColumns.value,
        datas: tableData.value
      }, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'lm-token': localStorage.getItem("token")
        }
      }
  ).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.etable.datas;
      tableInfo.id = res.data.etable.id;
      tableInfo.viewId = res.data.etable.viewId;
      dynamicColumns.value = res.data.etable.colums;
    }
  }).catch(function (error) {
    console.log(error)
  })
}//删除列
const deleteColumn = function (item) {
  centerDialogVisible.value = false;
  // console.log("删除table列", item)
  Axios.get("/etable/deleteTableColum", {
    params: {
      name: item,
      viewId: tableInfo.viewId
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.etable.datas;
      tableInfo.id = res.data.etable.id;
      tableInfo.viewId = res.data.etable.viewId;
      dynamicColumns.value = res.data.etable.colums;
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, res.msg),
      })
    }
  }).catch(function (error) {
    console.log(error)
  })
}
const deleteRow = function (index) {
  // console.log("删除table项", index)
  Axios.get("/etable/deleteTableItem", {
    params: {
      index,
      viewId: tableInfo.viewId
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then(((res) => {
    console.log("deleteTableItem", res)
    if (res.code === 200) {
      tableData.value = res.data.etable.datas;
      tableInfo.id = res.data.etable.id;
      tableInfo.viewId = res.data.etable.viewId;
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, res.msg),
      })
    }
  })).catch(function (error) {
    console.log(error)
  })
}
const addTableItem = function () {
  Axios.get("/etable/addTableItem", {
    params: {
      viewId: tableInfo.viewId
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    console.log("addTableItem", res)
    if (res.code === 200) {
      tableData.value = res.data.etable.datas;
      tableInfo.id = res.data.etable.id;
      tableInfo.viewId = res.data.etable.viewId;
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, res.msg),
      })
    }

  }).catch(function (error) {
    console.log(error)
  })
}
const askData = function () {
  const vid = NoteStore.getters.getCurrentView.id;
  console.log("askTableData", vid)
  Axios.get("/etable/getTable", {
    params: {
      viewId: vid
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    console.log("读取tabledata", res)
    if (res.code === 200) {
      tableData.value = res.data.etable.datas;
      tableInfo.id = res.data.etable.id;
      tableInfo.viewId = res.data.etable.viewId;
      dynamicColumns.value = res.data.etable.colums
    } else {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, res.msg),
      })
    }
  }).catch(function (error) {
    console.log("读取tabledata出错", error)
  })
}
onMounted(() => {
  if (tableData.value === undefined) {
    askData()
  }
  watch(lastvid, (newValue, old) => {
    console.log("old vid", old)
    console.log("new value", newValue)
    if (newValue !== old && tableData.value !== undefined) {
      const tmp = NoteStore.getters.getCurrenNote;
      for (let i of tmp.children) {
        if (i.id === newValue && i.component === "TableView") {
          askData()
        }
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.ItemCell {
  :deep(.el-input__wrapper) {
    background: transparent;
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
    cursor: default;
    border: none;
  }
}


.table_drawer_contrainer {
  :deep( .el-drawer.rtl ) {
    height: auto;
    margin-top: 450px;
    margin-bottom: 20px;
  }

  position: relative;
  height: auto;
}
</style>
