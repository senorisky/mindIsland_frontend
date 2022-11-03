<!-- sign_in -->
<template>
  <div class="container b-container" id="b-container">
    <el-form ref="loginForm" :model="user" :rules="loginRules" class="form" id="b-form">
      <h2 class="form_title title">Sign in to Website</h2>
      <div class="form__icons">
        <img class="form__icon" src=" ">
        <img class="form__icon" src=" ">
        <img class="form__icon" src=" ">
      </div>
      <span class="form__span">or use your email account</span>
      <el-form-item prop="username">
        <el-input
            class="form__input"
            v-model="user.username"
            placeholder="Name"
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
      <button class="form__button button submit" @click="login">SIGN IN</button>
    </el-form>
  </div>
</template>
<script setup>

import Mitt from "@/EventBus/mitt";
import {onMounted, onUnmounted, reactive, ref, toRaw} from "vue";
import router from "@/router";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import qs from "qs";
import UserStore from "../store/index"
import NoteStore from "@/store";

const user = reactive({
  username: "",
  password: "",
  email: ""
})

let menuData = reactive(
    [
      {
        id: "1",
        name: "ReadingNote",
        type: "note",
        fname: "",
        path: "",
        icon: "iconfont el-icon-dushu",
        isOpen: false,
        children: []
      },
      {
        id: "2",
        fname: "",
        name: "RecipeNote",
        type: "note",
        path: "", isOpen: false,
        icon: "iconfont el-icon-jitui",
        children: [
          {
            id: "10",
            fname: "RecipeNote",
            name: "Gallery",
            type: "view",
            path: "Recipe/Gallery",
            component: "GalleryView",
            icon: "iconfont el-icon-dian",
            isOpen: false
          }
        ]
      },
      {
        id: "3",
        fname: "",
        name: "TaskNote",
        type: "note",
        path: "",
        isOpen: false,
        icon: "iconfont el-icon-gongzuotai",
        children: [
          {
            id: "7",
            fname: "TaskNote",
            name: "List",
            type: "view",
            path: "Task/List",
            icon: "iconfont el-icon-dian",
            component: "ListView",
            isOpen: false
          },
          {
            id: "8",
            fname: "TaskNote",
            name: "Table",
            type: "view",
            path: "Task/Table",
            icon: "iconfont el-icon-dian",
            component: "TableView",
            isOpen: false
          }
        ]
      },
      {
        id: "4",
        fname: "",
        name: "DiaryNote",
        type: "note",
        path: "",
        icon: "iconfont el-icon-miao",
        isOpen: false,
        children: [
          {
            id: "9",
            fname: "DiaryNote",
            name: "List",
            type: "view",
            path: "Diary/List",
            icon: "iconfont el-icon-dian",
            component: "ListView",
            isOpen: false
          }
        ]
      }
      ,
      {
        id: "5",
        fname: "",
        name: "GalleryNote",
        type: "note",
        path: "",
        icon: "iconfont el-icon-tuku",
        isOpen: false,
        children: []
      }
      ,
      {
        id: "6",
        fname: "",
        name: "VideoNote",
        type: "note",
        path: "",
        icon: "iconfont el-icon-shipin",
        isOpen: false, children: []
      },
      {
        id: "7",
        fname: "",
        name: "TravelNote",
        type: "note",
        path: "",
        icon: "iconfont el-icon-feiji",
        isOpen: false,
        children: []
      }
    ]
)
// const strMapToObj = function (strMap) {
//   let obj = Object.create(null);
//   for (let [k, v] of strMap) {
//     obj[k] = v;
//   }
//   return obj;
// }
// /**
//  *map转换为json
//  */
// const mapToJson = function (map) {
//   return JSON.stringify(strMapToObj(map));
// }
const DynamicMenuRouter = function (menuData) {
  //动态路由存在本地-----退出登录时候清空
  localStorage.setItem('menuData', JSON.stringify(menuData))
  NoteStore.commit("saveMenuData", menuData)
}
const loginForm = ref()
const login = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      axios({
        method: 'post',
        url: '/login',
        data: qs.stringify(user),
      }).then(() => {
        // console.log(result);
        //返回菜单信息和用户信息

      }).catch(function (error) {
        console.log(error);
        // alert('系统繁忙请联系管理员');
      });
      DynamicMenuRouter(menuData);
      console.log(user)
      const rowUsed = toRaw(user)
      console.log(rowUsed)
      UserStore.commit("saveUser", user)
      localStorage.setItem("user", JSON.stringify(rowUsed))
      //将用户信息存入vuex
      //发送请求
      router.push('/space')
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
  Mitt.on('change', (isOpen) => {
    console.log(isOpen)
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