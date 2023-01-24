<template>
  <div class="inputDeep">
    <el-input v-show="(textNotNull||show)"
              v-model="textc.text" autosize type="textarea" @keydown.delete="deletePageComponent"
              @blur="saveTextc"
              placeholder="正文内容"/>
  </div>
</template>

<script setup name="TextArea">
import {computed, inject, toRef} from "vue";
import Mitt from "@/EventBus/mitt";

// eslint-disable-next-line no-undef
const props = defineProps({
  data: Object,
  id: Number
})
const textNotNull = computed({
  get() {
    return textc.value.text !== undefined && textc.value.text !== "" && textc.value.text !== null;
  }
})
const show = inject("show")
// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
const deletePageComponent = function () {
  if (textc.value.text === "" || textc.value.text=== undefined) {
    Mitt.emit("deletePageItem", index)
    textc.value.text = undefined
  }
}
const textc = toRef(props, "data")
const saveTextc = function () {
  const data = {
    text: textc.value.text,
    index
  }
  if (textc.value.text!== undefined)
    Mitt.emit("saveContent", data);
}
</script>

<style lang="scss" scoped>
.el-textarea {
  font-size: 17px !important;
}

.inputDeep {
  :deep(.el-textarea__inner) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    resize: none;
    cursor: default;
    font-weight: 500;
  }
}
</style>
