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
        v-for="tag in dynamicTags"
        :key="tag"
        class="button-new-tag ml-1"
        :disable-transitions="false"
        @close="handleClose(tag)"
        effect="plain"
    >
      {{ tag.name }}
    </el-button>
    <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="ml-1 w-20"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
      + New Tag
    </el-button>
  </div>
  <span class="border"></span>

  <div class="view-page">
    content
    <RouterView></RouterView>
  </div>

</template>

<script setup name="noteViews">
import {nextTick, onMounted, onUnmounted, reactive, ref, toRaw, watch} from 'vue'
import {ElInput} from 'element-plus'
import Mitt from "@/EventBus/mitt";
import NoteStore from "@/store";
import router from "@/router";
import {useRoute} from "vue-router"
import axios from "axios";

const note = NoteStore.getters.getCurrenNote
// console.log("noteview", note)
console.log("noteview", note.children)
const route = useRoute();
const inputValue = ref('')
const dynamicTags = reactive(note.children)
const inputVisible = ref(false)
const InputRef = ref()
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}
const objToStrMap = function (obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
/**
 *json转换为map
 */
const jsonToMap = function (jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}
const Viewdetail = () => {
//  替换 routerview 显示数据
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

watch(note, (newValue) => {
  console.log("noteview note change", newValue)
})
let views = reactive([]);
onMounted(() => {
//点击note的view
  console.log("noteview mounted")


  Mitt.on("ViewRouter", (item) => {
    //数据
    const ViewName = item.name + item.id
    console.log(item.type, ViewName)
    console.log("点击NoteView了", ViewName)
      const children = NoteStore.getters.getchildren;
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