<template>
  <!--  二级标题  -->
  <div>
    <el-input v-show="(textNotNull||show)"
              v-model="h2.text" class="deepInput" @keydown.delete="deletePageComponent" @blur="saveH2"
              placeholder="二级标题">
    </el-input>
  </div>
</template>

<script setup name="HeadTwo">
import {computed, inject, toRef} from "vue";

import Mitt from "@/EventBus/mitt";

// eslint-disable-next-line no-undef
const props = defineProps({
  data: Object,
  id: Number
})
const textNotNull = computed({
  get() {
    return h2.value.text !== undefined && h2.value.text !== "" && h2.value.text !== null;
  }
})
const show = inject("show")
const deletePageComponent = function () {
  if (h2.value.text === "" || h2.value.text === undefined) {
    Mitt.emit("deletePageItem", index)
    h2.value.text = undefined;
  }
}
// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
const h2 = toRef(props, "data");
const saveH2 = function () {
  const h2t = {
    text: h2.value.text,
    index
  }
  if (h2.value.text !== undefined)
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