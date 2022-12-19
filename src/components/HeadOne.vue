<template>
  <!-- 一级标题-->
  <div>
    <el-input v-show="(textNotNull||show)"
              v-model="h1.text" class="deepInput" @keydown.delete="deletePageComponent"
              @blur="saveH1" type="text"
              placeholder="一级标题">
    </el-input>
  </div>
</template>

<script setup name="HeadOne">
import {computed, inject, onMounted, toRef} from "vue";
import Mitt from "@/EventBus/mitt";
// eslint-disable-next-line no-undef
const props = defineProps({
  data: Object,
  id: Number,
})
// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
const textNotNull = computed({
  get() {
    return h1.value.text !== undefined && h1.value.text !== "" && h1.value.text !== null;
  }
})
const show = inject("show")
const deletePageComponent = function () {
  if (h1.value.text === "" || h1.value.text === undefined) {
    Mitt.emit("deletePageItem", index)
    h1.value.text = undefined;
  }
}
const h1 = toRef(props, "data");
const saveH1 = function () {
  const h1t = {
    text: h1.value.text,
    index
  }
  if (h1.value.text !== undefined)
    Mitt.emit("saveContent", h1t);
}
onMounted(() => {
  if (props.data.text === undefined)
    h1.value.text = ""
})
</script>

<style lang="scss" scoped>
.el-input {
  font-size: 32px !important;
  font-weight: bold;
  line-height: 48px !important;
  --el-input-height: 38px !important;
}

.deepInput {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
      font-weight: 600 !important;
    }
  }
}

</style>