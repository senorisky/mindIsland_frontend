<template>
  <!-- page的头 包括名字 日期 简介 横幅 -->
  <div>
    <div class="deepInput">
      <div style="height: 100px ;"></div>
      <div style="display: flex; align-items: flex-start ;flex-direction: column">
        <el-input readonly v-model="pageName" class="PageName" placeholder="Name"></el-input>
        <el-date-picker readonly type="datetime" format="YYYY-MM-DD HH:mm:ss" v-model="PageTime" class="PageTime"
                        placeholder="time"></el-date-picker>
        <el-input class="PageProfile" type="text" placeholder="profile"></el-input>
        <el-divider/>
      </div>
    </div>
    <!-- page的内容 图文混合排版 -->
    <div class="PageContent">
      <component v-for="(item,index) in (pageData)" :is="item.name" :key="index"
                 :id=index style="margin-top: 7px"></component>
      <div style="display: flex; align-items: center">
        <el-popover ref="popover" placement="right" :width="60" trigger="click">
          <template #reference>
            <el-button style="margin-top: 12px">添加内容</el-button>
          </template>
          <el-button-group>
            <el-button @click="addH1">一级标题</el-button>
            <el-button @click="addH2" style="margin-top: 5px">二级标题</el-button>
            <el-button @click="addH3" style="margin-top: 5px">三级标题</el-button>
            <el-button @click="addTextArea" style="margin-top: 5px">正文文本</el-button>
            <el-button style="margin-top: 5px">图片</el-button>
          </el-button-group>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script name="ViewPage">
import {computed, ref} from "vue";
import HeadTwo from "@/components/HeadTwo";
import HeadOne from "@/components/HeadOne";
import HeadThree from "@/components/HeadThree";
import TextArea from "@/components/TextArea";
import PageStore from "../store/index"
import NoteStore from "../store/index"
import Axios from "@/utils/request";

export default {
  components: {
    HeadOne,
    HeadTwo,
    HeadThree,
    TextArea
  },
  setup() {
    const tabMenu = ref(false)
    const newInput = ref("")
    const poverDismiss = function () {
      console.log("失去焦点")
      tabMenu.value = false;
    }
    const addH1 = function () {
      const h1 = {
        name: "HeadOne",
        text: "",
        pageId: NoteStore.getters.getCurrenNote.id
      }
      Axios.post("/page/addPageContent", h1).then((res) => {
        if (res.code === 200) {
          PageStore.commit("addH1", h1)
        }
      })
      //axios 成功后commit
    }
    const addH2 = function () {
      const h2 = {
        name: "HeadTwo",
        text: "",
        pageId: NoteStore.getters.getCurrenNote.id
      }
      Axios.post("/page/addPageContent", h2).then((res) => {
        if (res.code === 200) {
          PageStore.commit("addH2", h2)
        }
      })
    }
    const pageName = computed({
      get() {
        return NoteStore.getters.getCurrenNote.name;
      }
    })
    const PageTime = computed({
      get() {
        return NoteStore.getters.getCurrenNote.createTime;
      }
    })
    const addH3 = function () {
      const h3 = {
        name: "HeadThree",
        text: "",
        pageId: NoteStore.getters.getCurrenNote.id

      }
      Axios.post("/page/addPageContent", h3).then((res) => {
        if (res.code === 200) {
          PageStore.commit("addH3", h3)
        }
      })
    }
    const addTextArea = function () {
      const text = {
        name: "TextArea",
        text: "",
        pageId: NoteStore.getters.getCurrenNote.id
      }
      Axios.post("/page/addPageContent", text).then((res) => {
        console.log("addPageContent", res)
        if (res.code === 200) {
          PageStore.commit("addTextArea", text)
        }
      })
    }
    const pageData = computed({
      get() {
        console.log("getPageData", PageStore.getters.getPageData)
        return PageStore.getters.getComponentsArr;
      }
    })
    const addPicArea = function () {
      const pic = {
        name: "HeadThree",
        text: "",
        pageId: NoteStore.getters.getCurrenNote.id
      }
      PageStore.dispatch("addTextArea", pic)
    }
    return {
      tabMenu,
      newInput,
      poverDismiss,
      pageData,
      PageTime, pageName,
      addH1,
      addH3,
      addH2,
      addTextArea,
      addPicArea,
      PageStore
    }
  }
}

</script>

<style lang="scss" scoped>
.el-input.PageName {
  margin-top: 20px;
  font-size: 36px !important;
  line-height: 48px !important;
  --el-input-height: 48px !important;
}

.el-input.PageTime {
  margin-top: 10px;
  font-size: 24px !important;
}

.el-input.PageProfile {
  margin-top: 10px;
  font-size: 24px !important;
}

.deepInput {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
    }
  }
}

.inputDeep {
  :deep(.el-textarea__inner) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    resize: none;
    cursor: default;
  }
}
</style>