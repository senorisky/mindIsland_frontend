<template>
  <div class="body">
    <Transition name="fade" mode="out-in">
      <LogIn v-if="Logindefault"></LogIn>
      <SignUp v-else-if="!Logindefault"></SignUp>
    </Transition>
    <el-button class="transBtn" @click="logtransfer">{{ btnText }}
      <el-icon>
        <DArrowRight/>
      </el-icon>
    </el-button>
    <!--    备案号、关于、版权申明-->
    <!--    <div style="position:absolute;bottom:0;background: black;height:20px;width: 600px">-->
    <!--      <a></a>-->
    <!--      <a></a>-->
    <!--      <span></span>-->
    <!--      <span></span>-->
    <!--    </div>-->
  </div>

</template>

<script setup>

import LogIn from "@/components/LogIn";
import SignUp from "@/components/SignUp";
import {ref} from "vue";

const btnText = ref("注册")
const Logindefault = ref(true)
const logtransfer = function () {
  if (Logindefault.value) {
    Logindefault.value = !Logindefault.value
    btnText.value = "登录"
  } else {
    Logindefault.value = !Logindefault.value
    btnText.value = "注册"
  }
}
</script>
<style scoped lang="scss">

.body {

  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

.transBtn {
  height: 60%;
  margin-left: 30px;
}

.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
