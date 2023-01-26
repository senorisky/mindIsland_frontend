<template>
  <div class="container">

    <el-form
        ref="formRef"
        label-width="120px"
        class="demo-dynamic"
        :rules="Rules"
        :model="formObj"
    >
      <el-form-item
          style="margin-top: 40px;
margin-right: 20px"
          prop="email"
          label="Email"
      >
        <el-input v-model="formObj.email"/>
      </el-form-item>
      <el-form-item
          style="margin-top: 40px;
margin-right: 20px"
          prop="password"
          label="password"
      >
        <el-input type="password" v-model="formObj.password"/>
      </el-form-item>
      <el-form-item>
        <el-input
            style=" width: 230px;height: 40px;margin: 4px 0;
    font-size: 13px;
    letter-spacing: 15px;
    border: none;
    outline: none;"
            placeholder="6位邮箱验证码"
            v-model="checkcode"
        />
        <el-button :disabled="minute" plain type="primary" style="margin-right: 20px;margin-left: 10px"
                   @click="EmailCheck">点击获取
          {{ num }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
        <el-button @click="resetForm(formRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {h, reactive, ref} from 'vue'
import {ElNotification} from "element-plus";
import Axios from "@/utils/request";

const minute = ref(false)
const checkcode = ref("")
const num = ref("")
const formRef = ref()
const formObj = reactive({
  email: "",
  password: ""
})
const Rules = {
  email: [
    {
      required: true,
      message: 'Please input email address',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: 'blur',
    }
  ],
  password: [
    {required: true, message: 'please enter password', trigger: 'bluer'},
    {min: 6, max: 11, message: 'password must between 6 and 11', trigger: 'bluer'}
  ]
}
const EmailCheck = function () {
  if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(formObj.email)) {
    ElNotification({
      title: '提示',
      message: h('i', {style: 'color: teal'}, "请输入正确的邮箱"),
    })
  } else {
    num.value = 60
    minute.value = true
    setInterval(() => {
      num.value -= 1
      if (num.value < 1) {
        clearInterval(num.value)
        minute.value = false
        num.value = ""
      }
    }, 1000)
    Axios.get("/user/emailCheck", {
      params: {
        email: formObj.email,
        type: "rs"
      }, headers: {
        'Content-Type': 'application/json;charset=utf-8',
      }
    }).then((res) => {
      ElNotification({
        title: '提示',
        message: h('i', {style: 'color: teal'}, res.msg),
      })
    })
  }
}
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.demo-dynamic {
  box-shadow: 2px 2px 6px #d1d9e6;
  justify-content: flex-start;
  border-radius: 20px;
}
</style>
