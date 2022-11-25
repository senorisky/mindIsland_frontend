<template>
  <div style="display: flex;flex-direction: column; margin-top: 100px;">
    <!--  个人中心  头 展示昵称，id，签名   -->
    <div style="display: flex;flex-direction: row; justify-content: left; align-items: flex-end;">
      <el-avatar :size=128 :src="header"></el-avatar>
      <el-icon>
        <Edit/>
      </el-icon>
    </div>
    <div style="display: flex;flex-direction: column">
      <div style="display: flex;flex-direction: row">
        <div style=" width: 60px;   position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;">用户名:
        </div>
        <el-input style="margin-top: 10px; font-size: 18px;vertical-align: middle" readonly
                  class="personSetInput" v-model="name">

        </el-input>
      </div>
      <div style="display: flex;flex-direction: row">
        <div style=" width: 60px;   position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;">FID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
        </div>
        <el-input style="margin-top: 10px; font-size: 18px;vertical-align: middle" readonly class="personSetInput"
                  v-model="id"></el-input>
      </div>
      <div style="display: flex;flex-direction: row">
        <div style=" width: 60px;   position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;">签&nbsp;&nbsp;&nbsp;&nbsp;名:
        </div>
        <el-input style="margin-top: 10px;" class="personSetInput"
                  :maxlength=50
                  v-model="desc" placeholder="空空如也~~"></el-input>
      </div>
      <div style="display: flex;flex-direction: row">
        <div style=" width: 60px;   position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;">邮&nbsp;&nbsp;&nbsp;&nbsp;箱:
        </div>
        <el-input style="margin-top: 10px;font-size: 18px;" readonly class="personSetInput" v-model="email"></el-input>
      </div>
    </div>
    <div>

    </div>
  </div>
  <div>

  </div>
</template>

<script setup>
import {computed} from "vue";
import UserStore from "../store/index"
import {
  Edit,
} from '@element-plus/icons-vue'

const header = computed({
  get() {
    return UserStore.getters.getUser.header;
  }
})
const name = computed({
  get() {
    return UserStore.getters.getUser.name;
  }
})
const id = computed({
  get() {
    return UserStore.getters.getUser.id;
  }
})
const desc = computed({
  get() {
    return UserStore.getters.getUser.desc;
  }
})
const email = computed({
  get() {
    return UserStore.getters.getUser.email;
  }
})
</script>

<style lang="scss" scoped>
.personSetInput {
  margin-top: 0 !important;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
    }
  }
}
</style>