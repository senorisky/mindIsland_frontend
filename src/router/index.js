import {createRouter, createWebHistory} from 'vue-router'
import MainView from "@/views/MainView";
import PrepareView from "@/views/PrepareView";
import ProFile from "@/components/ProFile";
import PersonSet from "@/components/PersonSet";
import UserStore from "../store/index.js"
import NoteStore from "@/store";
// import {toRaw} from "vue";

const routes = [
    {
        path: '/', name: 'login', component: PrepareView
    },
    {
        path: '/space', name: 'space', component: MainView,
        redirect: '/space/ProFile',
        children: [
            {
                path: 'ProFile',
                name: 'ProFile',
                component: ProFile
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
    routes
})

//全局路由守卫 前置  初始和每一次路由跳转的时候进行跳转  next放行
router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem("token");
    if ((token === undefined || token === null) && (to.path !== "/")) {
        to.path = "/"
        next()
    }
    console.log("token", token)
    console.log("跳转到", to)
    console.log("from", from.path)
    //处理刷新界面动态路由丢失问题
    const user = UserStore.getters.getUser;
    console.log(user.name != null)
    //首页时候，直接跳转（不是动态页面）
    if (to.path === "/") {
        next();
    }//登录进主页时候，直接跳转（不是动态页面）
    else if (user.name !== null) {
        if (token === undefined || token === null) {
            return false;
        }
        console.log("正常路由")
        console.log(JSON.parse(localStorage.getItem("menuData")))
        next()
    } else if (user.name === null) {
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
        if (to.name === undefined) {
            console.log("vuex cnote")
            NoteStore.commit("saveCurrentNote", JSON.parse(localStorage.getItem("currentNote")))
        }
        //恢复vuex数据
        UserStore.commit("saveUser", JSON.parse(localStorage.getItem("user")))
        UserStore.commit("saveToken", localStorage.getItem("token"))
        // console.log("vuex menudata")
        NoteStore.commit("saveMenuData", menuData)
        // console.log("vuex cview")
        NoteStore.commit("saveCurrentView", JSON.parse(localStorage.getItem("currentView")))
        console.log("路由动态加载了数据")
        next({...to, replace: true})
    } else {
        if (token === undefined || token === null) {
            return false;
        }
        console.log("正常路由")
        next()
    }

})
export default router
