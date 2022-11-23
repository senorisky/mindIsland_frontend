import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import './assets/icon_font/iconfont.css';
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import Vue from 'vue'
// Vue.config.devtools = true
let app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store).use(router).use(ElementPlus).use(VueVideoPlayer).mount('#app')
