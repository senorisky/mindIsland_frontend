import {createStore} from 'vuex'
// eslint-disable-next-line no-unused-vars
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import qs from "qs";
import router from "@/router";
// import {toRaw} from "vue";

const UserStore = {
    state: {
        user: {
            name: null,
            id: null,
        }
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getTime(state) {
            console.log("获得当前时间")
            return state.date;
        }
    },
    mutations: {
        saveUser(state, user) {
            state.user.name = user.username;
        }

    },
    actions: {},
}
const NoteStore = {
    state: {
        menuData: [],
        currentNote: new Object()
    },
    getters: {
        getCurrenNote(state) {
            return state.currentNote;
        },
        getMenuData(state) {
            return state.menuData;
        },
    },
    mutations: {
        saveCurrentNote(state, noteName) {
            // console.log("store", state.notes)
            console.log("store", state.menuData)
            for (let index in state.menuData) {
                const note = state.menuData[index]
                if (note.name === noteName) {
                    state.currentNote = note;
                }
            }
        },
        saveMenuData(state, data) {
            state.menuData = data;
        },
        saveChild(state, data) {
            console.log(data.child)
            state.menuData[data.index].children.push(data.child)
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
            console.log(state.menuData)
        },
        saveNote(state, note) {
            state.menuData.push(note)
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
        }, savePage(state, page) {
            state.menuData.push(page)
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
        }
    },
    actions: {
        addChild(context, view) {
            for (let item in context.state.menuData) {
                if (context.state.menuData[item].name === view.fname) {
                    console.log(router.getRoutes())
                    context.commit("saveChild", {index: item, child: view})
                    router.addRoute(view.fname, {
                        path: "/space/" + view.fname + "/" + view.name + view.id,
                        name: view.name + view.id,
                        component: () => import(`../components/${view.component}`)
                    })
                    console.log(router.getRoutes())
                }
            }
        },
        addNote(context, note) {
            context.commit("saveNote", note);
            router.addRoute("space", {
                path: "/space/" + note.name,
                name: note.name,
                component: () => import(`../components/NoteViews`)
            })
            router.addRoute(note.name, {
                path: "/space/" + note.name + "/Profile",
                name: note.name + "Profile",
                component: () => import(`../components/ProFile`)
            })
            console.log(router.getRoutes())
            //axios
        },
        addPage(context, page) {
            context.commit("savePage", page);
            router.addRoute("space", {
                path: "/space/" + page.name,
                name: page.name,
                component: () => import(`../components/ViewPage`)
            })
            console.log(router.getRoutes())
            //axios
        }
    },
}

const PageStore = {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
}
export default createStore({
    modules: {
        UserStore,
        NoteStore,
        PageStore
    }
})
