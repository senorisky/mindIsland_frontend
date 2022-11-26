<template>
  <div class="inputDeep">
    <el-input v-model="textc" autosize type="textarea" @keydown.delete="deletePageComponent" @blur="saveTextc"
              placeholder="正文内容"/>
  </div>
</template>

<script setup name="TextArea">
import {computed} from "vue";
import PageStore from "@/store";

// eslint-disable-next-line no-undef
const props = defineProps({
  id: Number
})
// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
const deletePageComponent = function () {
  if (textc.value === "" || textc.value === undefined) {
    console.log("textc empty")
    PageStore.dispatch("deletePageItems", index)
  }
}
let textc = computed(
    {
      get() {
        if (index >= PageStore.getters.getComponentsArr.length) {
          return "";
        }
        return PageStore.getters.getComponentsArr[index].text
      },
      set(value) {
        const data = {
          index,
          text: value
        }
        PageStore.dispatch("saveCContenttmp", data)
      }
    }
)
const saveTextc = function () {
  const data = {
    text: textc.value,
    index
  }

  if (index < PageStore.getters.getComponentsArr.length) {
    console.log("提交内容text", index)
    PageStore.dispatch("saveCContent", data);
  }
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