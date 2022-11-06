<template>
  <!-- 一级标题-->
  <div>
    <el-input v-model="h1" class="deepInput" type="text" placeholder="一级标题">
    </el-input>
  </div>
</template>

<script setup name="HeadOne">
import {computed, onMounted} from "vue";
import PageStore from "../store/index"
// eslint-disable-next-line no-undef
const props = defineProps({
  id: Number
})
// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
console.log(PageStore.getters.getComponentsArr)
console.log(PageStore.getters.getComponentsArr[index])
// const h1 = ref(PageStore.getters.getComponentsArr[index].text)
let h1 = computed({
      get() {
        return PageStore.getters.getComponentsArr[index].text
      },
      set(value) {
        const h1t = {
          text: value,
          id: index
        }
        PageStore.dispatch("saveCContent", h1t)
      }
    }
)
onMounted(() => {
  console.log("index", index)
  h1 = PageStore.getters.getComponentsArr[index].text
  console.log("h1", PageStore.getters.getComponentsArr[index])
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