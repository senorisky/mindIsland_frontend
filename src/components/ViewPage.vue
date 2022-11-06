<template>
  <!-- page的头 包括名字 日期 简介 横幅 -->
  <div>
    <div class="deepInput">
      <div style="height: 100px"></div>
      <el-input class="PageName" placeholder="Name"></el-input>
      <el-input class="PageTime" placeholder="time"></el-input>
      <el-input class="PageProfile" type="text" placeholder="profile"></el-input>
      <el-divider/>
    </div>
    <!-- page的内容 图文混合排版 -->
    <div class="PageContent">
      <component v-for="(item,index) in (PageStore.getters.getComponentsArr)" :is="item.name" :key="index"
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
import {ref} from "vue";
import HeadTwo from "@/components/HeadTwo";
import HeadOne from "@/components/HeadOne";
import HeadThree from "@/components/HeadThree";
import TextArea from "@/components/TextArea";
import PageStore from "../store/index"

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
        name: "HeadOne"
      }
      PageStore.dispatch("saveH1", h1)
    }
    const addH2 = function () {
      const h2 = {
        name: "HeadTwo"
      }
      PageStore.dispatch("saveH2", h2)
    }
    const addH3 = function () {
      const h3 = {
        name: "HeadThree"
      }
      PageStore.dispatch("saveH3", h3)
    }
    const addTextArea = function () {
      const text = {
        name: "TextArea",
      }
      PageStore.dispatch("saveTextArea", text)
    }
    const addPicArea = function () {
      const pic = {
        name: "HeadThree"
      }
      PageStore.dispatch("savePicArea", pic)
    }
    return {
      tabMenu,
      newInput,
      poverDismiss,
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
  font-size: 48px !important;
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