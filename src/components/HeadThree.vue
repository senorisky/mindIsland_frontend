<template>
  <!--  三级标题  -->
  <div>
    <el-input v-model="h3" class="deepInput" @blur="saveH3" placeholder="三级标题">
    </el-input>
  </div>
</template>

<script setup name="HeadThree">
import {computed} from "vue";
import PageStore from "@/store";

// eslint-disable-next-line no-undef
const props = defineProps({
  id: Number
})// eslint-disable-next-line vue/no-setup-props-destructure
const index = props.id
const h3 = computed({
      get() {
        return PageStore.getters.getComponentsArr[index].text
      }
      ,
      set(value) {
        const h3t = {
          text: value,
          id: props.id
        }
        PageStore.dispatch("saveCContenttmp", h3t)
      }
    }
)
const saveH3 = function () {
  const h3t = {
    text: h3.value,
    index
  }
  PageStore.dispatch("saveCContent", h3t)
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