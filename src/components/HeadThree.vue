<template>
  <!--  三级标题  -->
  <div>
    <el-input v-model="h3.data" class="deepInput" @keydown.delete="deletePageComponent" @blur="saveH3"
              placeholder="三级标题">
    </el-input>
  </div>
</template>

<script setup name="HeadThree">
import {reactive} from "vue";
import Mitt from "@/EventBus/mitt";

// eslint-disable-next-line no-undef
const props = defineProps({
  data: Object,
  id: Number
})
const deletePageComponent = function () {
  if (h3.data === "" || h3.data === undefined) {
    console.log("h3 empty")
    Mitt.emit("deletePageItem", props.id)
    h3.data = undefined;
  }
}
const h3 = reactive({
  data: props.data.text
})
const saveH3 = function () {
  const h3t = {
    text: h3.data,
    index: props.id
  }
  if (h3.data !== undefined)
    Mitt.emit("saveContent", h3t);
}

</script>


<style lang="scss" scoped>
.el-input {
  font-size: 20.72px !important;

}

.deepInput {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
      font-weight: 550 !important;
    }
  }
}
</style>