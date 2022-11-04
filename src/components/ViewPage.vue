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
    <el-scrollbar class="PageContent">
      <component v-for="(item,index) in componentArr" :is="item.name" :key="index" style="margin-top: 7px"></component>
      <div style="display: flex; align-items: center">
        <el-popover ref="popover" placement="right" :width="200" trigger="focus">
          <template #reference>
            <el-button>Focus to activate</el-button>
          </template>
          <el-button-group>
            <el-button>一级标题</el-button>
            <el-button>二级标题</el-button>
            <el-button>三级标题</el-button>
            <el-button>正文文本</el-button>
            <el-button>图片·</el-button>
          </el-button-group>
        </el-popover>
      </div>
    </el-scrollbar>
  </div>
</template>

<script name="ViewPage">
import {reactive, ref} from "vue";
import HeadTwo from "@/components/HeadTwo";
import HeadOne from "@/components/HeadOne";
import HeadThree from "@/components/HeadThree"

export default {
  components: {
    HeadOne,
    HeadTwo,
    HeadThree
  },
  setup() {
    const tabMenu = ref(false)
    const newInput = ref("")
    const componentArr = reactive([
      {
        name: "HeadOne"
      },
      {
        name: "HeadTwo"
      },
      {
        name: "HeadThree"
      }
    ])
    const poverDismiss = function () {
      console.log("失去焦点")
      tabMenu.value = false;
    }
    const keyDownTab = function () {
      tabMenu.value = true;
      console.log("Tab触发")
    }
    return {
      tabMenu,
      newInput,
      componentArr,
      keyDownTab,
      poverDismiss
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