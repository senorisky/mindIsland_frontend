<template>
  <el-drawer
      v-model="$props.drawer"
      title="I am the title"
      :direction="direction"
      :before-close="handleClose"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script setup name="CardView">
import {ref} from 'vue'
import Mitt from "@/EventBus/mitt";
// eslint-disable-next-line no-undef
defineProps({
  drawer: Boolean,
})
const direction = ref('rtl')
const handleClose = (done) => {
  Mitt.emit("closeDrawer")
  done()
}

</script>

<style lang="scss" scoped>
.el-drawer {
  position: absolute;
  z-index: -1;
}
</style>