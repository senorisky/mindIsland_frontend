<template>
  <!--  三级标题  -->
  <div>
    <el-input v-show="(textNotNull||show)"
              v-model="h3.text" class="deepInput" @keydown.delete="deletePageComponent" @blur="saveH3"
              placeholder="三级标题">
    </el-input>
  </div>
</template>

<script setup name="HeadThree">
import {computed, inject, toRef} from "vue";
import Mitt from "@/EventBus/mitt";

// eslint-disable-next-line no-undef
const props = defineProps({
  data: Object,
  id: Number
})
const textNotNull = computed({
  get() {
    // console.log("textnull", (h3.data === undefined || h3.data === ""))
    return h3.value.text !== undefined && h3.value.text !== "" && h3.value.text !== null;
  }
})
const show = inject("show")
const deletePageComponent = function () {
  if (h3.value.text === "" || h3.value.text === undefined) {
    Mitt.emit("deletePageItem", props.id)
    h3.value.text = undefined;
  }
}
const h3 = toRef(props, "data");
const saveH3 = function () {
  const h3t = {
    text: h3.value.text,
    index: props.id
  }
  if (h3.value.text !== undefined)
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