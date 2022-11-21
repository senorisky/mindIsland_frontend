<template>
  <el-drawer
      v-model="$props.drawer"
      :direction="direction"
      :before-close="handleClose"
  >
    <div style="display: flex ; margin-top: 0px !important;;flex-direction: column; justify-content: flex-start">
      <div class="card_head">
        <el-icon></el-icon>
        <h2 class="deepInput" style="text-align: left;text-indent: 12px;" v-text="$props.data.name"></h2>
        <el-date-picker
            v-model="$props.data.date"
            type="datetime"
            readonly
            style="width: 100%">
        </el-date-picker>
      </div>
      <div class="card_content">
        <el-input class="inputDeep" type="textarea" v-model="$props.data.des"></el-input>
      </div>
      <div class="resource" v-if="data.url!==undefined"></div>
    </div>
  </el-drawer>
</template>

<script setup name="CardView">
import {onMounted, ref} from 'vue'
import Mitt from "@/EventBus/mitt";
// eslint-disable-next-line no-undef
defineProps({
  drawer: Boolean,
  data: Object,
  index: Number
})
const direction = ref('rtl')
const handleClose = (done) => {
  Mitt.emit("CloseCardView");
  done()
}
onMounted(()=>{
  console.log("carviewMounted")
})
</script>

<style lang="scss" scoped>

.card_head:deep(.el-input__wrapper) {
  font-size: 14px;
  background: transparent;
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
  border-radius: 30px;
  border: none;
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

.card_content {
  margin-top: 20px;

}

.inputDeep {
  font-size: 18px;

  :deep(.el-textarea__inner) {
    text-indent: 36px;
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    resize: none;
    cursor: default;
  }
}

</style>