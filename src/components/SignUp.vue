<!-- sign_up 登陆页面的注册部分 -->
<template>
  <div class="container a-container" id="a-container">
    <el-form ref="registForm" :model="user" :rules="registRules" class="form" id="a-form">
      <h2 class="form_title title">Create Account</h2>
      <div class="form__icons">
        <img class="form__icon" src=" ">
        <img class="form__icon" src=" ">
        <img class="form__icon" src=" ">
      </div>
      <el-form-item prop="userName">
        <el-input
            class="form__input"
            v-model="user.userName"
            placeholder="Name"
            type="text"
        />
      </el-form-item>
      <el-form-item prop="email">
        <el-input
            class="form__input"
            v-model="user.email"
            placeholder="Email"
            type="text"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            class="form__input"
            v-model="user.password"
            placeholder="Password"
            type="password"/>
      </el-form-item>
      <el-button class="form__button button submit" @click="regist">SIGN UP</el-button>
    </el-form>
  </div>
</template>
<script setup>
import Mitt from "@/EventBus/mitt";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import router from "@/router";
// import qs from "qs";
import Axios from "@/utils/request";
//响应式数据
let user = reactive({
  userId: "",
  userName: "senorisky",
  password: "lifemind123",
  email: "zkuku253674@163.com",
  loginTime: "",
  createTime: ""
})
//规则
const registRules = {
  userName: [
    {required: true, message: 'please enter username', trigger: 'bluer'},
    {min: 4, max: 10, message: 'Length is between 4 and 10 letters', trigger: 'bluer'}
  ],
  password: [
    {required: true, message: 'please enter password', trigger: 'bluer'},
    {min: 6, max: 11, message: 'password must between 6 and 11', trigger: 'bluer'}
  ]
}
//表单实例
const registForm = ref()
//注册逻辑
const regist = () => {
  registForm.value.validate((valid) => {
    if (valid) {
      user.userId = user.userName;
      Axios.post('/user/register', user).then((res) => {
        console.log(res)
        if (res.data.code === 200) {

          router.push('/register')
        }
      }).catch(function (error) {
        console.log(error);
      });

    }
  })
}

onMounted(() => {
  Mitt.on('change', () => {

    let aContainer = document.querySelector("#a-container")
    aContainer.classList.toggle("is-txl");
  })
})
onUnmounted(() => {
  Mitt.off('change')
})

</script>
<style scoped lang="scss">
@import '../assets/login.scss';
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>
<style>
.el-input__wrapper {
  padding: 0;
}
</style>
