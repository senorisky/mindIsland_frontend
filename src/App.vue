<template>
  <RouterView></RouterView>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  // //判断刷新还是关闭页面
  // let beginTime = 0;//开始时间
  // let differTime = 0;//时间差
  // window.onunload = function () {
  //   differTime = new Date().getTime() - beginTime;
  //   if (differTime <= 10) localStorage.clear();
  // };
  // window.onbeforeunload = function () {
  //   beginTime = new Date().getTime();
  // };
})
</script>
<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px !important;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
