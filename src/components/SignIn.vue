<!-- sign_in -->
<template>
  <div class="container b-container" id="b-container">
    <el-form ref="loginForm" :model="user" :rules="loginRules" class="form" id="b-form">
      <h2 class="form_title title">Sign in to LifeMind</h2>
      <div class="form__icons">
        <img class="form__icon" src=" ">
        <img class="form__icon" src=" ">
        <img class="form__icon" src=" ">
      </div>
      <span class="form__span">use your email account</span>
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
      <a class="form__link">Forgot your password?</a>
      <el-button class="form__button button " @click="login">SIGN IN</el-button>
    </el-form>
  </div>
</template>
<script setup>

import Mitt from "@/EventBus/mitt";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import router from "@/router";
// eslint-disable-next-line no-unused-vars
import qs from "qs";
import UserStore from "../store/index"
import NoteStore from "@/store";
import Axios from "@/utils/request";

const user = reactive({
  userName: "",
  password: "lifemind123",
  email: "zkuku253674@163.com",
  userId: ""
})


const DynamicMenuRouter = function (menuData) {
  //动态路由存在本地-----退出登录时候清空
  localStorage.setItem('menuData', JSON.stringify(menuData))
  console.log("login menu", menuData)
  for (let father of menuData) {
    if (father.type === "note") {
      router.addRoute("space", {
        path: "/space/" + father.id,
        name: father.id,
        component: () => import(`../components/${father.component}`)
      })
      router.addRoute(father.id, {
        path: "/space/" + father.id + "/Profile",
        name: father.id + "Profile",
        component: () => import(`../components/ProFile`)
      })
    } else if (father.type === "page") {
      router.addRoute("space", {
        path: "/space/" + father.id,
        name: father.id,
        component: () => import(`../components/${father.component}`)
      })
    }
    //
    if (father.children && father.children.length) {
      for (let child of father.children) {
        router.addRoute(father.id, {
          path: "/space/" + father.id + "/" + child.id,
          name: child.id,
          component: () => import(`../components/${child.component}`)
        })
      }
    }
  }
  NoteStore.commit("saveMenuData", menuData)
}
const loginForm = ref()
const login = function () {
  loginForm.value.validate((valid) => {
    if (valid) {
      console.log(user)
      Axios.post('/user/login', user).then((res) => {
        console.log(res)
        if (res.code === 200) {
          DynamicMenuRouter(res.data.menuData);
          const rowUsed = res.data.user
          console.log(rowUsed)
          UserStore.commit("saveUser", res.data.user)
          UserStore.commit("saveToken".res.data.token);
          localStorage.setItem("user", JSON.stringify(rowUsed))
          localStorage.setItem("token", res.data.token)
          router.push('/space')
        }
      }).catch(function (error) {
        console.log(error);
        alert('系统繁忙请联系管理员');
      });

    }
  })
}
const loginRules = {
  username: [
    {required: true, message: 'please enter username', trigger: 'bluer'},
    {min: 4, max: 10, message: 'Length is between 4 and 10 letters', trigger: 'bluer'}
  ],
  password: [
    {required: true, message: 'please enter password', trigger: 'bluer'},
    {min: 6, max: 11, message: 'password must between 6 and 11', trigger: 'bluer'}
  ]
}
onMounted(() => {
  Mitt.on('change', () => {
    let bContainer = document.querySelector("#b-container")
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z200");
  })
})
onUnmounted(() => {
  Mitt.off('change')
})
</script>
<style scoped lang="scss">
@import 'src/assets/login.scss';
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>