<template>
  <div style="display: flex;flex-direction: column; margin-top: 60px;">
    <!--  个人中心  头 展示昵称，id，签名   -->
    <div style="display: flex;flex-direction: row; justify-content: left; align-items: flex-end;">
      <el-avatar :fit="'fill'" :size=128 :src="UserInfo.header"></el-avatar>
      <el-icon>
        <el-upload
            class="dl-avatar-uploader-min square"
            action="#"
            :http-request="upLoadHeader"
            :show-file-list="false"
            :before-upload="beforeUploadHandle"
            list-type="picture"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG">
          <Edit/>
        </el-upload>
      </el-icon>
    </div>
    <div style="display: flex;flex-direction: column">
      <div style="display: flex;flex-direction: row">
        <div style=" width: 100px;   position: relative;
    display: inline-flex;
    align-items: center;
    font-size:18px;
    justify-content: center;">用户名:
        </div>
        <el-input style="margin-top: 10px; font-size: 18px;vertical-align: middle" readonly
                  class="personSetInput" v-model="UserInfo.name">
        </el-input>
      </div>
      <div style="display: flex;flex-direction: row;margin-top: 10px">
        <div style=" width: 100px;   position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;">FID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
        </div>
        <el-input style="margin-top: 10px; font-size: 18px;vertical-align: middle" readonly class="personSetInput"
                  v-model="UserInfo.id"></el-input>
      </div>
      <div style="display: flex;flex-direction: row;margin-top: 10px">
        <div style=" width: 100px;   position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;">签&nbsp;&nbsp;&nbsp;&nbsp;名:
        </div>
        <el-input style="margin-top: 10px;" class="personSetInput"
                  :maxlength=50
                  v-model="UserInfo.desc" readonly placeholder="空空如也~~"></el-input>
      </div>
      <div style="display: flex;flex-direction: row;margin-top: 10px">
        <div style=" width: 100px;   position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;">邮&nbsp;&nbsp;&nbsp;&nbsp;箱:
        </div>
        <el-input style="margin-top: 10px;font-size: 18px;width: auto" readonly class="personSetInput"
                  v-model="UserInfo.email"></el-input>
      </div>
      <div style="display: flex;flex-direction: row;margin-top: 10px">
        <el-button type="warning" @click="logConfirm" plain>退出登录</el-button>
        <el-button type="danger" @click="DialogConfirm" plain>注销账号</el-button>
        <el-button type="default" @click="ChangeUser" plain>修改信息</el-button>
      </div>
    </div>
    <div>

    </div>
  </div>
  <div class="user_drawer">
    <!--  列表项的抽屉  -->
    <el-drawer
        v-model="drawer1"
        title="修改个人信息"
        :direction="direction"
        :before-close="handleClose"
    >
      <el-form ref="formRef" :model="form" label-width="20px">
        <el-form-item prop="name" class="deepInput">
          <el-input v-model="form.name" placeholder="昵称"/>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.oldpass" type="password" placeholder="原密码"/>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.newpass" type="password" placeholder="需要修改才输入新密码"/>
        </el-form-item>
        <el-form-item prop="des" class="inputDeep">
          <el-input v-model="form.des" placeholder="个性签名"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="SaveUser">Save</el-button>
          <el-button @click="CancelAdd">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
  <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
    <p>
      你正在注销账号，这将会删除所有的资源!!
    </p>
    <p>
      不可撤销!!
    </p>
    <el-input v-model="passwd" type="password" placeholder="enter your password to confirm"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteUser">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="logoutDialog" title="Warning" width="30%" center>
    <p>
      确认退出登录？
    </p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="logoutDialog = false">Cancel</el-button>
        <el-button type="primary" @click="logout">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import UserStore from "../store/index"
import NoteStore from "../store/index"
import {
  Edit,
} from '@element-plus/icons-vue'
import {ElNotification} from "element-plus";
import Axios from "@/utils/request";
import pencode from "@/utils/encode"
import router from "@/router";


const centerDialogVisible = ref(false)
const logoutDialog = ref(false)
const passwd = ref("")
const formRef = ref(null)
const direction = ref('rtl')
const drawer1 = ref(false)
const UserInfo = reactive({
  header: "",
  name: "",
  id: "",
  desc: "",
  email: ""
})
const form = reactive({
  name: "",
  email: "",
  des: "",
  oldpass: "",
  newpass: ""
})
const DialogConfirm = function () {
  centerDialogVisible.value = true;
}
const logConfirm = function () {
  logoutDialog.value = true;
}
const handleClose = (done) => {
  //抽屉关闭
  done()
  formRef.value.resetFields();
}
const ChangeUser = function () {
  drawer1.value = true;
}
const SaveUser = function () {
  let oldpass = pencode.pencode(form.oldpass)
  let newpass = pencode.pencode(form.newpass)
  Axios.get('/user/save', {
    params: {
      name: form.name,
      email: UserInfo.email,
      des: form.des,
      oldpass,
      newpass
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then(res => {
        if (res.code === 200) {
          console.log("保存用户信息", res)
          UserInfo.header = res.data.user.avatar
          UserInfo.name = res.data.user.userName
          UserInfo.id = res.data.user.userId
          UserInfo.desc = res.data.user.des
          UserInfo.email = res.data.user.email
          //更改了密码  退出重登
          if (res.data.passnew) {
            window.localStorage.clear()
            window.sessionStorage.clear()
            UserStore.commit("resetData")
            NoteStore.commit("resetData")
            router.push({path: "/"})
          } else {
            UserStore.commit("saveUser", res.data.user)
          }
        } else {
          ElNotification({
            title: 'Info',
            message: res.msg,
            type: "error"
          })
        }
      }
  ).catch(err => {
    console.log(err)
  })
  formRef.value.resetFields();
  drawer1.value = false;
}
const CancelAdd = function () {
  formRef.value.resetFields();
  drawer1.value = false;
}
const deleteUser = function () {
  Axios.get('/user/delete', {
    params: {
      passwd: pencode.pencode(passwd.value),
      userId: UserStore.getters.getUser.id
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then(res => {
    if (res.code === 200) {
      console.log("注销成功", res)
      window.localStorage.clear()
      window.sessionStorage.clear()
      UserStore.commit("resetData")
      NoteStore.commit("resetData")
      router.push({path: "/"})
    } else {
      ElNotification({
        title: 'Info',
        message: res.msg,
        type: "error"
      })
    }
  }).catch(err => {
    console.log(err)
  })
  centerDialogVisible.value = false;
}
const logout = function () {
  Axios.get('/user/logout', {
    params: {
      userId: UserStore.getters.getUser.id
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'lm-token': localStorage.getItem("token")
    }
  }).then(res => {
    if (res.code === 200) {
      window.localStorage.clear()
      window.sessionStorage.clear()
      UserStore.commit("resetData")
      NoteStore.commit("resetData")
      logoutDialog.value = false;
      router.push({path: "/"})
    } else {
      ElNotification({
        title: 'Info',
        message: res.msg,
        type: "error"
      })
    }
  }).catch(err => {
    console.log(err)
  })
}
const beforeUploadHandle = function (file) {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt3M = file.size / 1024 / 1024  < 3;
  if (!isJPG && !isPNG) {
    ElNotification({
      title: 'Info',
      message: "不支持此格式",
      type: "warning"
    })
    return false;
  }
  if (!isLt3M) {
    ElNotification({
      title: 'Info',
      message: "图片大小不能超过3MB",
      type: "warning"
    })
    return false;
  }
  return true;
}
const upLoadHeader = function (item) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'lm-token': localStorage.getItem("token")
    }
  }
  let formData = new FormData()
  formData.append('file', item.file)
  formData.append('userId', UserStore.getters.getUser.id)
  Axios.post('/user/header', formData, config).then(res => {
    if (res.code === 200) {
      console.log("上传头像成功", res)
      UserInfo.header = res.data.user.avatar
      UserStore.commit("saveUser", res.data.user)
      ElNotification({
        title: 'Info',
        message: "上传头像成功",
        type: "success"
      })
    } else {
      ElNotification({
        title: 'Info',
        message: res.msg,
        type: "error"
      })
    }
  }).catch(err => {
    console.log(err)
  })
}
const askUser = function () {
  Axios.get("/user/getuser", {
    headers: {
      'Content-Type': 'multipart/form-data',
      'lm-token': localStorage.getItem("token")
    }
  }).then((res) => {
    console.log("getuser", res)
    if (res.code === 200) {
      UserInfo.header = res.data.user.avatar
      UserInfo.name = res.data.user.userName
      UserInfo.id = res.data.user.userId
      UserInfo.desc = res.data.user.des
      UserInfo.email = res.data.user.email
    }
  })
}
onMounted(() => {
  askUser()
})
</script>

<style lang="scss" scoped>

.user_drawer {
  position: relative;

  :deep( .el-overlay) {
    background-color: transparent !important;
    margin-right: 20px;
  }

  :deep( .el-drawer.rtl) {
    height: auto;
    margin-top: 100px;
    margin-bottom: 130px;
  }

  :deep( .el-drawer ) {
    background-color: #f1f5f7;
    border-radius: 15px;
    box-shadow: var(--el-alert-bg-color);
    width: 30% !important;
  }
}

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
