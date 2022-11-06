<template>
  <!--  二级标题  -->
  <div>
    <el-input v-model="h2" class="deepInput" placeholder="二级标题" >
    </el-input>
  </div>
</template>

<script setup name="HeadTwo">
import {computed} from "vue";
import PageStore from "@/store";

// eslint-disable-next-line no-undef
const props = defineProps({
  id: Number
})
// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
const h2 = computed({
  get() {
    return PageStore.getters.getComponentsArr[index].text
  },
  set(value) {
    const h2t = {
      text: value,
      id: props.id
    }
    PageStore.dispatch("saveCContent", h2t)
  }
})



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