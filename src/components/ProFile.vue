<template>
  <!--  展示Note中的view列表-->
  <div v-if="noteNotNULL===true">
    <el-scrollbar height="400px">
      <div class="List_container">
        <div class="list" v-for="(item,index) in listData" :key="index">
          <el-input class="child" readonly v-model="item.name"></el-input>
          <el-date-picker
              style="width: 500px"
              v-model="item.createTime"
              type="datetime"
              readonly
              format="YYYY-MM-DD hh:mm:ss"
              value-format="x"
          />

        </div>
      </div>
    </el-scrollbar>
  </div>
  <div v-else>
    <div class="block">
      <el-image style="width: 140px; height: 140px" :src="require('../assets/imgs/lifemind.png')"/>
    </div>
    <div>
      <h1 class="block">Welcome to LifeMind</h1>
      <div style="width: 600px">
        <p class="construction">这是一个个人笔记本，你可以通过个人习惯来自定义自己的每一个Note笔记本,Note笔记本中可以创建不同的view来记录不同类型的数据，或者创建一个Page来编写文章。
          让多彩的生活在岁月中留下属于自己的切片。</p>
      </div>
    </div>
    <el-divider/>
    <div style="width: 600px">
      <ul class="certify">
        <li>已经为你创建了七个Note,你可以创建自己的Note</li>
        <li>每一个Note都可以添加不同的view，包括列表，表格，画廊等</li>
        <li>列表可以多列表或者单列表使用，表格也可以添加新的列,建议不要随意添加列，可以提前确定好要哪些列</li>
        <li>你可以创建新的Page，Page和Note是同一个等级的。</li>
        <li>Page创建可以编写文章，文章支持图文混合排版和导出pdf。</li>
        <li>Ps：目前view的种类比较少，只有列表，表格，画廊。
          Page目前可以设置三级标题，编写正文，上传图片，但是不支持修改字体大小，图片放入格式固定，不支持四周环绕。
          应用会长期处于测试完善阶段，可能会有一些BUG，或者体验不好的地方，若有任何改善的建议和想法可以进行反馈,非常感谢 &#8764;\(&ge;&#8711;&le;)/&#8764; 。
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup name="Profile">
import {computed, onBeforeMount, ref} from "vue";
import NoteStore from "../store/index"

let noteNotNULL = ref(false)
onBeforeMount(() => {
  const name = NoteStore.getters.getCurrenNote.name
  console.log("profile", name)
  if (name !== undefined) {
    noteNotNULL.value = true;
  }
  console.log(noteNotNULL)
})

const listData = computed({
  get() {
    console.log("Profile")
    return NoteStore.getters.getCurrenNote.children;
  },
})
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  font-family: "HGHUATI_CNKI";
}

li {
  margin-top: 20px;
}

.certify {
  text-align: left;
}

.construction {
  text-indent: 36px;
  line-height: 28px;
  text-align: left;
}

.list:hover :deep(.el-input) {
  background: #f5f5f5;

}

.list { //单列表样式
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  width: 500px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;

  :deep(.el-input__wrapper) {
    background: transparent;
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
    border-radius: 30px;
    //border: none;
  }
}

.child {
  font-size: 24px !important;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
      font-weight: 550 !important;
    }
  }
}

.ItemStyle {
  height: 40px;
  margin-bottom: 10px;
}

.List_container {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 50px;
  margin: 10px 10px 10px 120px;
  text-align: center;
  border-radius: 4px;
}

.scroll_bar_item {;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 70%;
  margin: 10px 10px 10px 100px;
  text-align: center;
  border-radius: 4px;
  /*background: var(--el-color-primary-light-9);*/

}
</style>