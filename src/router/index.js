import {createRouter, createWebHistory} from 'vue-router'
import MainView from "@/views/MainView";
import PrepareView from "@/views/PrepareView";
import SystemView from "@/components/SystemView";
import PersonSet from "@/components/PersonSet";
import UserStore from "../store/index.js"
import NoteStore from "@/store";
import ForgetView from "@/views/ForgetView";
import {ElNotification} from "element-plus";
// import {toRaw} from "vue";

const routes = [
    {
        path: '/', name: 'login', component: PrepareView
    },
    {
        path: '/forget', name: 'forget', component: ForgetView
    },
    {
        path: '/space', name: 'space', component: MainView,
        redirect: '/space/SystemProfile',
        children: [
            {
                path: 'SystemProfile',
                name: 'SystemProfile',
                component: SystemView
            }, {
                path: "personSet",
                name: "personSet",
                component: PersonSet
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    // scrollBehavior: () => {
    //     history.pushState(null, null, document.URL)
    // }

})

//全局路由守卫 前置  初始和每一次路由跳转的时候进行跳转  next放行
router.beforeEach(async (to, from, next) => {
    console.log("路由跳转")
    if (to.path === "/" || to.path === "/forget")
        return next()
    const token = localStorage.getItem("token")
    console.log("token", token)
    if ((token === undefined || token === null) && (to.path !== "/")) {
        ElNotification({
            title: "Info",
            message: "请先登录",
            type: "warning"
        })
        return next("/")
    }
    //处理刷新界面动态路由丢失问题
    const user = UserStore.getters.getUser;
    console.log(user.name != null)
    if (user.name !== null) {
        if (token === undefined || token === null) {
            return false;
        }
        console.log("正常路由")
        console.log(JSON.parse(localStorage.getItem("menuData")))
        next()
    } else {
        if (token === undefined || token === null) {
            return false;
        }
        //从localStorage中获取菜单树。然后重新加载路由
        let menuData = [];
        menuData = JSON.parse(localStorage.getItem("menuData"));
        console.log(localStorage)
        console.log(menuData)
        // 加载动态的路由
        for (let father of menuData) {
            // 父级路由
            if (father.type === "note") {
                router.addRoute("space", {
                    redirect: "/space/" + father.id + "/Profile",
                    path: "/space/" + father.id,
                    name: father.id,
                    component: () => import(`../components/${father.component}`)
                })
                router.addRoute(father.id, {
                    path: "/space/" + father.id + "/Profile",
                    name: father.id + "Profile",
                    component: () => import(`../components/ProFile`)
                })
            } else if (father.type === "page") {
                router.addRoute("space", {
                    path: "/space/" + father.id,
                    name: father.id,
                    component: () => import(`../components/${father.component}`)
                })
            }
            //子级路由
            if (father.children && father.children.length) {
                for (let child of father.children) {
                    // console.log(child.id, father.name)
                    router.addRoute(father.id, {
                        path: "/space/" + father.id + "/" + child.id,
                        name: child.id,
                        component: () => import(`../components/${child.component}`)
                    })
                }
            }
        }
        console.log(router.getRoutes())
        console.log("重新加载动态路由")
        //重新vuex
        console.log("to", to.name)
        console.log("note", JSON.parse(localStorage.getItem("currentNote")))
        NoteStore.commit("saveCurrentNote", JSON.parse(localStorage.getItem("currentNote")))
        //恢复vuex数据
        UserStore.commit("saveUser", JSON.parse(localStorage.getItem("user")))
        UserStore.commit("saveToken", localStorage.getItem("token"))
        NoteStore.commit("saveMenuData", menuData)
        NoteStore.commit("saveCurrentView", JSON.parse(localStorage.getItem("currentView")))
        console.log("路由动态加载了数据")
        next({...to, replace: true})
    }

})
export default router
