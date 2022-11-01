import {createRouter, createWebHistory} from 'vue-router'
import MainView from "@/views/MainView";
import PrepareView from "@/views/PrepareView";
// eslint-disable-next-line no-unused-vars
import GalleryView from "../components/GalleryView";
// eslint-disable-next-line no-unused-vars
import TableView from "../components/TableView"
// eslint-disable-next-line no-unused-vars
import ListView from "@/components/ListView";
import ProFile from "@/components/ProFile";
// import store from "@/store";
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
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//全局路由守卫 前置  初始和每一次路由跳转的时候进行跳转  next放行
router.beforeEach((to, from, next) => {
    // iView.LoadingBar.start();
    //console.log("store",store);
    //储存当前路由，便于在重新打开时候跳到上次关闭的页面（用户主动退出除外）
    // if (to.name) {
    //     localStorage.setItem('nowRouter', JSON.stringify(to));
    // } else if (from.name) {
    //     localStorage.setItem('nowRouter', JSON.stringify(from));
    // }
    console.log("跳转到", to.path)
    //处理刷新界面动态路由丢失问题
    const user = UserStore.getters.getUser;
    // console.log(user.name) //动态数组丢失说明用户刷新了页面
    //首页时候，直接跳转（不是动态页面）
    if (to.path === "/") {
        next();
    }//登录进主页时候，直接跳转（不是动态页面）
    else if (to.path === "/space/ProFile" && from.path === "/" && user.name !== null) {
        let menuData = [];
        menuData = JSON.parse(localStorage.getItem("menuData"));
        console.log("登录", menuData)
        for (let father of menuData) {
            // console.log(father.name)
            router.addRoute("space", {
                path: "/space/" + father.name,
                name: father.name,
                component: () => import(`../components/NoteViews`)
            })
            router.addRoute(father.name, {
                path: "/space/" + father.name + "/Profile",
                name: father.name + "Profile",
                component: () => import(`../components/ProFile`)
            })
            //
            if (father.children && father.children.length) {
                for (let child of father.children) {
                    // console.log(child.id, father.name)
                    router.addRoute(father.name, {
                        path: "/space/" + father.name + "/" + child.name + child.id,
                        name: child.name + child.id,
                        component: () => import(`../components/${child.component}`)
                    })
                }
            }
        }
        console.log(router.getRoutes())
        next()
    }
    else if (user.name === null) {
        //从localStorage中获取菜单树。然后重新加载路由
        let menuData = [];
        menuData = JSON.parse(localStorage.getItem("menuData"));
        console.log(menuData)
        for (let father of menuData) {
            // console.log(father.name)
            router.addRoute("space", {
                path: "/space/" + father.name,
                name: father.name,
                component: () => import(`../components/NoteViews`)
            })
            router.addRoute(father.name, {
                path: "/space/" + father.name + "/Profile",
                name: father.name + "Profile",
                component: () => import(`../components/ProFile`)
            })
            //
            if (father.children && father.children.length) {
                for (let child of father.children) {
                    // console.log(child.id, father.name)
                    router.addRoute(father.name, {
                        path: "/space/" + father.name + "/" + child.name + child.id,
                        name: child.name + child.id,
                        component: () => import(`../components/${child.component}`)
                    })
                }
            }
        }
        console.log(router.getRoutes())
        console.log("重新加载动态路由")
        //重新vuex
        let notes = localStorage.getItem("NotesMap")
        // console.log("取notes", notes)
        UserStore.commit("saveUser", JSON.parse(localStorage.getItem("user")))
        NoteStore.commit("saveNotes", notes)
        // console.log("存vuex", NoteStore.getters.getNotes)
        NoteStore.commit("savechildren", localStorage.getItem("childrenMap"))
        NoteStore.commit("saveMenuData", menuData)
        console.log("路由动态加载了数据", menuData)
        next({...to, replace: true})
    } else {
        console.log("正常路由")
         next()

    }

})
export default router
