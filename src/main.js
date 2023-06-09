import {createApp} from 'vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import './assets/icon_font/iconfont.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL)
})
let app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router).use(ElementPlus).mount('#app')
