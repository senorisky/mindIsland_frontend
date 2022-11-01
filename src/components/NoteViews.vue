<template>

  <!--   根据noteview不同来装载不同的view内容 -->
  <!--  封装组件  用于展示一个Note的内容-->
  <div class="head_container">
    <!--  小图标  标题-->
    <div>header</div>
    <!--  描述和使用方法  -->
    <div></div>
    <!--   分割线 -->
    <span></span>
  </div>
  <!--  每一个note中添加的功能项-->
  <div class="note-view-tags">
    <el-button
        @click="Viewdetail"
        size="small"
        v-for="tag in NoteStore.getters.getCurrenNote.children"
        :key="tag"
        class="button-new-tag ml-1"
        :disable-transitions="false"
        @close="handleClose(tag)"
        effect="plain"
    >
      {{ tag.name }}
    </el-button>

    <el-button class="button-new-tag ml-1" size="small" @click="drawer=true">
      + New Tag
    </el-button>
  </div>
  <span class="border"></span>

  <div class="view-page">
    content
    <RouterView></RouterView>
  </div>
  <div>
    <el-drawer
        v-model="drawer"
        title="I am the title"
        :direction="direction"
        :before-close="handleClose"
    >
      <span>Hi, there!</span>
    </el-drawer>
  </div>
</template>

<script setup name="noteViews">
import { onMounted, onUnmounted, ref} from 'vue'
import Mitt from "@/EventBus/mitt";
import NoteStore from "@/store";
import router from "@/router";
// import CardView from "@/components/CardView";
// import {ElMessageBox} from "element-plus";
// import {useRoute} from "vue-router"

const drawer = ref(false)
// const drawer2 = ref(false)
const direction = ref('rtl')
// const radio1 = ref('Option 1')
const handleClose = (done) => {
  done()

}


// const route = useRoute();
// const dynamicTags = reactive([])
// let CardActivate = ref(false)
// const handleClose = (tag) => {
//   dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
// }
const Viewdetail = () => {
//  替换 routerview 显示数据
}

// let views = reactive([]);
onMounted(() => {
//点击note的view
  console.log("noteview mounted")
  Mitt.on("ViewRouter", (item) => {
        //数据
        const ViewName = item.name + item.id
        console.log(item.type, ViewName)
        console.log("点击NoteView了", ViewName)
        // const children = NoteStore.getters.getchildren;
        router.push({
          name: ViewName,
          params: {
            data: ""
          }
        });
      }
  )
})
onUnmounted(() => {
  Mitt.off("ViewRouter")
})
</script>

<style scoped>
.el-button {
  margin-right: 5px !important;
  margin-left: 0 !important;
}

.drawer_contrainer {
  position: relative;
  overflow: hidden;
}

.button-new-tag {
  --el-button-hover-border-color: #dcdcdc !important;
  --el-button-hover-bg-color: #f5f5f5;
}

.note-view-tags {
  display: flex;
}

.view-page {

}

.border {
  margin-left: 3px;
  display: inline-block;
  padding-top: 3px;
  width: 100%;
  border-top: 1px solid #DCDCDC;
}


.head_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
  position: sticky;
  left: 0px;
}
</style>