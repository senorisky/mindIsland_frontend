<template>
  <!--  二级标题  -->
  <div>
    <el-input v-show="(textNotNull||show)"
              v-model="h2.data" class="deepInput" @keydown.delete="deletePageComponent" @blur="saveH2"
              placeholder="二级标题">
    </el-input>
  </div>
</template>

<script setup name="HeadTwo">
import {computed, inject, reactive} from "vue";

import Mitt from "@/EventBus/mitt";

// eslint-disable-next-line no-undef
const props = defineProps({
  data: Object,
  id: Number
})
const textNotNull = computed({
  get() {
    return h2.data !== undefined && h2.data !== "" && h2.data !== null;
  }
})
const show = inject("show")
const deletePageComponent = function () {
  if (h2.data === "" || h2.data === undefined) {
    console.log("h2 empty")
    Mitt.emit("deletePageItem", index)
    h2.data = undefined;
  }
}
// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
const h2 = reactive({
  data: props.data.text
})
const saveH2 = function () {
  const h2t = {
    text: h2.data,
    index
  }
  if (h2.data !== undefined)
    Mitt.emit("saveContent", h2t);
}
</script>

<style lang="scss" scoped>
.el-input {
  font-size: 24px !important;

}

.deepInput {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
      font-weight: 570 !important;
    }
  }
}
</style>