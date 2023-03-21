<template>
  <div class="login_container">
    <el-form ref="loginForm" :model="user" :rules="loginRules" class="form" id="b-form">
      <h2 class="form_title title">Sign in to MindIsland</h2>
      <span class="login__span">use your email account</span>
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
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <a class="form__link" @click="forget">Forgot your password?</a>
        <el-button class="login__button" @click="login" color="#449cf3" plain>SIGN IN</el-button>
      </div>
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
          console.log("登录成功", localStorage.getItem("token"))
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
const autoLogin = function () {
  console.log("自动登录", localStorage.getItem("token"))
  if (localStorage.getItem("token") !== undefined)
    Axios.get("/user/autoLogin", {
          headers: {
            'Content-Type': 'multipart/form-data',
            'lm-token': localStorage.getItem("token")
          }
        }
    ).then((res) => {
      if (res.code === 200) {
        DynamicMenuRouter(res.data.menuData);
        const rowUsed = res.data.user
        console.log(rowUsed)
        UserStore.commit("saveUser", res.data.user)
        UserStore.commit("saveToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(rowUsed))
        localStorage.setItem("token", res.data.token)
        console.log("登录成功", localStorage.getItem("token"))
        router.push('/space')
      }
    })
}
onMounted(() => {
  autoLogin()
  Mitt.on('change', transform)
})
onUnmounted(() => {
  Mitt.off('change')
})
</script>
<style scoped lang="scss">
.login_container {
  width: 30%;
  height: 60%;
  border-radius: 20px;
  border-width: 10px;
  background: #fafafa;
  box-shadow: 10px 10px 10px #d1d9e6;
}

.login__button {
  margin-top: 20px;
  height: 40px;
  width: 120px
}

.login__span {
  color: #8c939d;
  margin-top: 30px;
  margin-bottom: 50px;
}

.form__input {
  height: 40px;
  margin-top: 10px;
  margin-right: 40px;
  margin-left: 40px;
}

.form__link {
  color: #8c939d;
}

.form__link:hover {
  cursor: pointer;
  color: black;
}
</style>
