<!-- sign_up 登陆页面的注册部分 -->
<template>
  <div class="sinup_container" id="a-container">
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
      <el-form-item>
        <div class="form__input">
          <el-input

              style=" width: 230px;height: 40px;margin: 4px 0;
            font-size: 13px;
            letter-spacing: 15px;
            border: none;
            outline: none;"
              placeholder="6位邮箱验证码"
              v-model="checkcode"
              @keydown.enter="regist"
          />
          <el-button :disabled="minute" plain type="primary" style="margin-left: 30px;width: 90px" @click="EmailCheck">
            点击获取
            {{ num }}
          </el-button>
        </div>
      </el-form-item>
      <el-button class="signup__button" @click="regist">SIGN UP</el-button>
    </el-form>
  </div>
</template>
<script setup>
import Mitt from "@/EventBus/mitt";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import Axios from "@/utils/request";
import {nanoid} from "nanoid";
import pencode from "@/utils/encode"
import {ElNotification} from "element-plus";
//响应式数据
let user = reactive({
  userId: "",
  userName: "",
  password: "",
  email: "",
  loginTime: "",
  createTime: ""
})
//规则
const registRules = {
  userName: [
    {required: true, message: 'please enter username', trigger: 'bluer'},
  ],
  password: [
    {required: true, message: 'please enter password', trigger: 'bluer'},
    {min: 6, max: 11, message: 'password must between 6 and 11', trigger: 'bluer'}
  ],
  email: [
    {required: true, message: 'email is needed', trigger: 'bluer'}
  ]
}
//表单实例
const registForm = ref()
const minute = ref(false)
const checkcode = ref("")
const num = ref("")
const emialTimer = ref(null)
//注册逻辑
const regist = () => {
  registForm.value.validate((valid) => {
    if (valid) {
      if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(user.email)) {
        ElNotification({
          title: 'Info',
          message: "请输入正确的邮箱",
          type: "error"
        })
        return;
      }
      user.userId = nanoid(8);
      user.password = pencode.pencode(user.password)
      Axios.post('/user/register', {
        user,
        CheckCode: checkcode.value
      }).then((res) => {
        if (res.code === 200) {
          registForm.value.resetFields();
          checkcode.value = ""
          ElNotification({
            title: "Info",
            message: res.msg,
            type: "success"
          })
          transform()
        } else {
          ElNotification({
            title: "Info",
            message: res.msg,
            type: "error"
          })
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  })
}
const EmailCheck = function () {
  if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(user.email)) {
    ElNotification({
      title: 'Info',
      message: "请输入正确的邮箱",
      type: "error"
    })
  } else {
    num.value = 60
    minute.value = true
    emialTimer.value = setInterval(() => {
      num.value -= 1
      if (num.value < 1) {
        clearInterval(num.value)
        minute.value = false
        num.value = ""
      }
    }, 1000)
    Axios.get("/user/emailCheck", {
      params: {
        email: user.email
      }, headers: {
        'Content-Type': 'application/json;charset=utf-8',
      }
    }).then((res) => {
      if (res.code === 200) {
        ElNotification({
          title: "Info",
          message: res.msg,
          type: "success"
        })
      } else {
        ElNotification({
          title: "Info",
          message: res.msg,
          type: "error"
        })
      }
    })
  }
}
const transform = function () {
  let aContainer = document.querySelector("#a-container")
  aContainer.classList.toggle("is-txl");
}
onMounted(() => {
  Mitt.on('change', transform)
})
onUnmounted(() => {
  clearInterval(emialTimer.value)
  Mitt.off('change')
})

</script>
<style scoped lang="scss">
.sinup_container {
  width: 30%;
  height: 60%;
  border-radius: 20px;
  border-width: 10px;
  background: #fafafa;
  box-shadow: 10px 10px 10px #d1d9e6;
}

.form__input {
  height: 40px;
  margin-top: 10px;
  margin-right: 40px;
  margin-left: 40px;
}

.signup__button {
  margin-top: 20px;
  height: 40px;
  width: 120px
}
</style>
