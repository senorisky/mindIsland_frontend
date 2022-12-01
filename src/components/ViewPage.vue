<template>
  <!-- page的头 包括名字 日期 简介 横幅 -->
  <div id="page">
    <div class="deepInput">
      <div style="height: 100px;width: 100px; background: #2c3e50;"></div>
      <div style="display: flex; align-items: flex-start ;flex-direction: column">
        <el-input readonly v-model="pageInfo.pageName" class="PageName" placeholder="Name"></el-input>
        <el-date-picker readonly type="datetime" format="YYYY-MM-DD HH:mm:ss" v-model="pageInfo.pageTime"
                        class="PageTime"
                        placeholder="time"></el-date-picker>
        <div style="display: flex;flex-direction: row;align-items: end">
          <el-input class="PageProfile" type="text" placeholder="profile"></el-input>
          <el-button v-if="showMenu" size="default" @click="handlePrint" :loading="loading">
            {{ text }}
          </el-button>
          <el-button size="default" ref="printBtn" v-show="false" v-print="pdfFunc">
          </el-button>
        </div>
        <el-divider/>
      </div>
    </div>
    <!-- page的内容 图文混合排版 -->
    <div class="PageContent">
      <component v-for="(item,index) in (pageData.value)" :is="item.name" :key="index"
                 :data=item :id=index :hide="showMenu" style="margin-top: 7px"></component>
      <div style="display: flex; align-items: center" v-if="showMenu">

        <el-popover ref="popover" placement="right" :width="60" trigger="click">
          <template #reference>
            <el-button style="margin-top: 12px">添加内容</el-button>
          </template>
          <el-button-group>
            <el-button @click="addH1">一级标题</el-button>
            <el-button @click="addH2" style="margin-top: 5px">二级标题</el-button>
            <el-button @click="addH3" style="margin-top: 5px">三级标题</el-button>
            <el-button @click="addTextArea" style="margin-top: 5px">正文文本</el-button>
            <el-button @click="addPicArea" style="margin-top: 5px">图片</el-button>
          </el-button-group>
        </el-popover>
      </div>
      <div class="nameSign" v-if="!showMenu">{{ UserStore.getters.getUser.name }}</div>
    </div>
  </div>
</template>

<script name="ViewPage">
import {onMounted, onUnmounted, provide, reactive, ref, watch} from "vue";
import HeadTwo from "@/components/HeadTwo"
import HeadOne from "@/components/HeadOne"
import HeadThree from "@/components/HeadThree"
import TextArea from "@/components/TextArea"
import PicView from "@/components/PicView"
import NoteStore from "../store/index"
import UserStore from "../store/index"
import Axios from "@/utils/request"
import Mitt from "@/EventBus/mitt"
import print from 'vue3-print-nb'
import watermark from "@/utils/watermark"
// 导入htmlToPdf.js

export default {
  components: {
    HeadOne,
    HeadTwo,
    HeadThree,
    TextArea,
    PicView
  },
  directives: {
    print
  },
  setup() {
    const loading = ref()
    const text = ref("PDF");
    const tabMenu = ref(false)
    const showWaterMark = ref(true)
    const showMenu = ref(true)
    provide("show", showMenu);
    const newInput = ref("")
    const lastNoteName = ref()
    const watermarker = ref("")
    const printBtn = ref(null)
    const pageInfo = reactive({
      noteId: "",
      imgPath: "",
      pageName: "",
      pageTime: ""
    })
    const pageData = reactive([])
    const pdfFunc = reactive({
      id: "page",
      popTitle: NoteStore.getters.getCurrenNote.name,
      closeCallback: () => {
        // showWaterMark.value = false   // 取消或者打印成功，返回页面时不显示水印
        showMenu.value = true
        console.log(showWaterMark.value)
      },
    })
    const handlePrint = function () {
      console.log("打印前")
      // showWaterMark.value = true
      showMenu.value = false;
      // window.print();
      setTimeout(function () {
        printBtn.value.$el.click()
      }, 500);
    }
    const getBase64 = function (base64) {
      return 'data:image/png;base64,' + base64
    }
    const poverDismiss = function () {
      console.log("失去焦点")
      tabMenu.value = false;
    }
    const addH1 = function () {
      const h1 = {
        name: "HeadOne",
        text: "",
        pageId: pageInfo.noteId
      }
      Axios.post("/page/addPageContent", h1).then((res) => {
        if (res.code === 200) {
          pageData.value.push(h1)
        }
      })
      //axios 成功后commit
    }
    const addH2 = function () {
      const h2 = {
        name: "HeadTwo",
        text: "",
        pageId: pageInfo.noteId
      }
      Axios.post("/page/addPageContent", h2).then((res) => {
        if (res.code === 200) {
          pageData.value.push(h2)
        }
      })
    }
    const addH3 = function () {
      const h3 = {
        name: "HeadThree",
        text: "",
        pageId: pageInfo.noteId

      }
      Axios.post("/page/addPageContent", h3).then((res) => {
        if (res.code === 200) {
          pageData.value.push(h3)
        }
      })
    }
    const addTextArea = function () {
      const text = {
        name: "TextArea",
        text: "",
        pageId: pageInfo.noteId
      }
      Axios.post("/page/addPageContent", text).then((res) => {
        console.log("addPageContent", res)
        if (res.code === 200) {
          pageData.value.push(text)
        }
      })
    }
    const addPicArea = function () {
      const text = {
        name: "PicView",
        text: "",
        pageId: pageInfo.noteId
      }
      Axios.post("/page/addPageContent", text).then((res) => {
        console.log("addPageContent", res)
        if (res.code === 200) {
          pageData.value.push(text)
        }
      })
    }
    const deletePageItem = function (index) {
      Axios.get("/page/deletePageItem", {
        params: {
          noteId: pageInfo.noteId,
          index
        }
      }).then((res) => {
        console.log("删除page元素", res)
        if (res.code === 200) {
          pageData.value = res.data.page.datas
        }
      })
    }
    const saveContent = function (data) {
      //做一个比较如果内容相同就不发请求也不更新
      const index = data.index;
      console.log("保存内容", data)
      Axios.get("/page/savePageItemContent", {
        params: {
          index,
          text: data.text,
          noteId: pageInfo.noteId
        }
      }).then((res) => {
        console.log("savePage", res)
        if (res.code === 200) {
          console.log("savePageSuccess", res.data)
          pageData.value = res.data.page.datas;
        }
      })
    }
    const askData = function () {
      //axios 请求page内容
      const pid = NoteStore.getters.getCurrenNote.id
      console.log("askPage", pid)
      Axios.get("/page/getPageData", {
        params: {
          noteId: pid
        }
      }).then((res) => {
        console.log("askPage", res)
        if (res.code === 200) {
          console.log("askPageDat", res.data)
          if (res.data.page.data !== null)
            pageData.value = res.data.page.datas;
          pageInfo.noteId = res.data.page.noteId;
          pageInfo.imgPath = res.data.page.imgPath;
          pageInfo.pageName = NoteStore.getters.getCurrenNote.name;
          pageInfo.pageTime = NoteStore.getters.getCurrenNote.createTime;
        }
      })
    }
    onMounted(() => {
      console.log("pageMounted")
      Mitt.on("saveContent", saveContent)
      Mitt.on("deletePageItem", deletePageItem)
      watermarker.value = watermark.addWaterMark(UserStore.getters.getUser.name + pageInfo.pageName);
      if (pageData.value === undefined || pageData.value.length === 0) {
        askData();
      }
      watch(lastNoteName, (newValue, old) => {
        console.log("old vid", old)
        console.log("new value", newValue)
        if (newValue !== old && pageData.value !== undefined) {
          askData()
        }
      })
    })
    onUnmounted(() => {
      Mitt.off("saveContent")
      Mitt.off("deletePageItem")
      console.log("pageUnMounted")
    })
    return {
      tabMenu,
      newInput,
      loading, showMenu,
      showWaterMark,
      pageData, pageInfo,
      pdfFunc, printBtn,
      text, UserStore,
      watermarker,
      poverDismiss,
      handlePrint, getBase64,
      addH1, addH3,
      addH2, addTextArea,
      addPicArea,
    }
  }
}

</script>

<style lang="scss" scoped>
.waterMaker {
  height: 100px;
  width: 200px;
}

.nameSign {
  text-align: end;
  font-size: 48px;
  font-weight: normal;
  font-family: "HGHUATI_CNKI", serif;
}

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
<style media="print">
@media print {
  /*打印页面样式*/
  .Front {
    background-color: white;
    background-size: 100% 100%;
  }

  body {
    -webkit-print-color-adjust: exact;
    -moz-print-color-adjust: exact;
    -ms-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  #pdfDom {
    /* width: 1078px;
    height: 1568px;
    height: 7200px;
     border: 1px #000 solid; */
    border-bottom: white;
    margin: 0 auto;
    /* margin-left: 1%;
    margin-top: 1%; */
  }

  /*配置页眉页脚的边距，宽度*/
  @page {
    size: auto !important;
    /* margin: 3mm !important; */
    margin: 1.5em 1.5em 1.5em
  }
}
</style>