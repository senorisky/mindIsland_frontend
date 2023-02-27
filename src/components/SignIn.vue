<!-- sign_in -->
<template>
  <div class="container b-container" id="b-container">
    <el-form ref="loginForm" :model="user" :rules="loginRules" class="form" id="b-form">
      <h2 class="form_title title">Sign in to MindIsland</h2>
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
            @keydown.enter="login"
            type="password"/>
      </el-form-item>
      <a class="form__link" @click="forget">Forgot your password?</a>
      <el-button class="form__button button " @click="login">SIGN IN</el-button>
    </el-form>
  </div>
</template>
<script setup>

import Mitt from "@/EventBus/mitt";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import router from "@/router";
import UserStore from "../store/index"
import pencode from "@/utils/encode"
import NoteStore from "@/store";
import Axios from "@/utils/request";
import {ElNotification} from "element-plus";

const user = reactive({
  userName: "",
  password: "",
  email: "",
  userId: ""
})
const forget = function () {
  router.push('/forget')
}

const DynamicMenuRouter = function (menuData) {
  //动态路由存在本地-----退出登录时候清空
  localStorage.setItem('menuData', JSON.stringify(menuData))
  console.log("login menu", menuData)

  for (let father of menuData) {
    if (father.type === "note") {
      router.addRoute("space", {
        redirect: "/space/" + father.id + "/Profile",
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
  menuData.push({
    id: "System",
    name: "SystemProfile",
    path: "/space/SystemProfile",
    type: "note",
    children: [],
    icon: "iconfont el-icon-guanyu",
    component: "SystemView"
  })
  NoteStore.commit("saveMenuData", menuData)
}
const loginForm = ref()
const login = function () {
  loginForm.value.validate((valid) => {
    if (valid) {
      const pwd = pencode.pencode(user.password)
      Axios.post('/user/login', {}, {
        params: {
          username: user.email,
          password: pwd
        }
      }).then((res) => {
        if (res.code === 200) {
          DynamicMenuRouter(res.data.menuData);
          const rowUsed = res.data.user
          console.log(rowUsed)
          UserStore.commit("saveUser", res.data.user)
          UserStore.commit("saveToken", res.data.token);
          localStorage.setItem("user", JSON.stringify(rowUsed))
          localStorage.setItem("token", res.data.token)
          router.push('/space')
        } else {
          ElNotification({
            title: "Info",
            message: res.msg,
            type: "error"
          })
        }
      })

    }
  })
}
const loginRules = {
  email: [
    {required: true, message: 'please enter email', trigger: 'bluer'}
  ],
  password: [
    {required: true, message: 'please enter password', trigger: 'bluer'},
    {min: 6, max: 11, message: 'password must between 6 and 11', trigger: 'bluer'}
  ]
}
const transform = function () {
  let bContainer = document.querySelector("#b-container")
  bContainer.classList.toggle("is-txl");
  bContainer.classList.toggle("is-z200");
}
onMounted(() => {
  Mitt.on('change', transform)
})
onUnmounted(() => {
  Mitt.off('change')
})
</script>
<style scoped lang="scss">
@import 'src/assets/login.scss';
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>
