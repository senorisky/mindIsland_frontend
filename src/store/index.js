import {createStore} from 'vuex'
// eslint-disable-next-line no-unused-vars
import Axios from "@/utils/request";
// eslint-disable-next-line no-unused-vars
import qs from "qs";
import router from "@/router";
// import {toRaw} from "vue";

const UserStore = {
    state: {
        user: {
            name: null,
            email: ""
        }
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getTime(state) {
            // console.log("获得当前时间")
            return state.date;
        }
    },
    mutations: {
        saveUser(state, user) {
            state.user.name = user.userName;
            state.user.email = user.email
            console.log("userstore", state.user)
        }

    },
    actions: {},
}
const NoteStore = {
    state: {
        menuData: [],//数据结构  [{note....children[]},{note:.....children[]}....]
        currentNote: new Object(),//{name:,id:,....children[]}
        currentView: new Object()//{vid:,data:[{colum:,items[{name:},{name:}....]},{colum:,items[]}.....]}
    },
    getters: {
        getCurrenNote(state) {
            return state.currentNote;
        },
        getMenuData(state) {
            return state.menuData;
        },
        getCurrentView(state) {
            return state.currentView;
        }
    },
    mutations: {
        saveCurrentNote(state, noteName) {
            console.log("store", state.menuData)
            for (let index in state.menuData) {
                const note = state.menuData[index]
                if (note.name === noteName) {
                    state.currentNote = note;
                }
            }
        },
        saveCurrentView(state, elist) {
            state.currentView = elist;
            localStorage.setItem("currentView", JSON.stringify(state.currentView))
        },
        saveListViewById(state, view_id) {
            console.log("saveCvid", view_id)
            for (let index in state.currentNote.children) {
                const child = state.currentNote.children[index];
                if (child.id === view_id) {
                    state.currentView = child;
                    localStorage.setItem("currentView", JSON.stringify(state.currentView))
                    break;
                }
            }
        },
        saveListData(state, listData) {
            state.currentView.data = listData;
            console.log("store","write curview")
            localStorage.setItem("currentView", JSON.stringify(state.currentView))
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
        },
        savePage(state, page) {
            state.menuData.push(page)
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
        },
        saveNoteName(state, name) {
            state.currentNote.name = name;
        },
        saveNoteInfo(state, info) {
            state.currentNote.info = info;
        }
    },
    actions: {
        addChild(context, view) {
            for (let item in context.state.menuData) {
                if (context.state.menuData[item].name === view.fname) {
                    console.log(router.getRoutes())
                    context.commit("saveChild", {index: item, child: view})
                    router.addRoute(view.fname, {
                        path: "/space/" + view.fname + "/" + view.id,
                        name: view.id,
                        component: () => import(`../components/${view.component}`)
                    })
                    console.log(router.getRoutes())
                    Axios.post("/view/addView", view).then((res) => {
                        console.log("addView", res)
                    })
                    break;
                }
            }
        },
        addNote(context, note) {
            context.commit("saveNote", note);
            router.addRoute("space", {
                path: "/space/" + note.name,
                name: note.name,
                component: () => import(`@/components/${note.component}`)
            })
            router.addRoute(note.name, {
                path: "/space/" + note.name + "/Profile",
                name: note.name + "Profile",
                component: () => import(`../components/ProFile`)
            })
            console.log(router.getRoutes());
            Axios.post("/note/addNote", note).then((res) => {
                console.log("addNote", res);
            })
        },
        addPage(context, page) {
            context.commit("savePage", page);
            router.addRoute("space", {
                path: "/space/" + page.name,
                name: page.name,
                component: () => import(`../components/${page.component}`)
            })
            console.log(router.getRoutes())
            Axios.post("/note/addNote", page).then((res) => {
                console.log("addNote", res);
            })
        },
        changeNoteName(context, name) {
            context.commit("saveNoteName", name);
            const note = context.state.currentNote
            Axios.post("note/saveNote", note).then((res) => {
                console.log("change note name", res)
            })
        },
        changeNoteInfo(context, value) {
            context.commit("saveNoteInfo", value);
            const note = context.state.currentNote;
            Axios.post("note/saveNote", note).then((res) => {
                console.log("save note info", res)
            })
        }
    },
}
//存当前Page的内容
const PageStore = {
    state: {
        components: []
    },
    getters: {
        getComponentsArr(state) {
            return state.components;
        }
    },
    mutations: {
        addH1(state, h1) {
            console.log("pagestore", h1)
            state.components.push(h1)
            localStorage.setItem("curPageContent", JSON.stringify(state.components))
        },
        addTextArea(state, text) {
            state.components.push(text)
            localStorage.setItem("curPageContent", JSON.stringify(state.components))
        },
        addH2(state, h2) {
            state.components.push(h2)
            localStorage.setItem("curPageContent", JSON.stringify(state.components))
        },
        addH3(state, h3) {
            state.components.push(h3)
            localStorage.setItem("curPageContent", JSON.stringify(state.components))
        },
        addPicArea(state, pic) {
            state.components.push(pic)
            localStorage.setItem("curPageContent", JSON.stringify(state.components))
        },
        savePageContent(state, content) {
            state.components = content;
            localStorage.setItem("curPageContent", JSON.stringify(state.components))
        },
        saveCContent(state, data) {
            console.log("pstoreMU", data)
            state.components[data.id].text = data.text;
            console.log("pstoreMU", state.components[data.id].text)
            localStorage.setItem("curPageContent", JSON.stringify(state.components))
        }
    },
    actions: {
        saveH1(context, h1) {
            context.commit("addH1", h1)
            //axios 成功后commit
        },
        saveH2(context, h2) {
            context.commit("addH2", h2)
        },
        saveH3(context, h3) {
            context.commit("addH3", h3)
        },
        saveTextArea(context, text) {
            context.commit("addTextArea", text)
        }, savePicArea(context, pic) {
            context.commit("addPicArea", pic)
        },
        askPage(context, pageName) {
            //axios 请求page内容
            const data = [
                {
                    name: "HeadOne",
                    text: ""
                },
                {
                    name: "HeadTwo",
                    text: ""
                },
                {
                    name: "HeadThree",
                    text: ""
                }, {
                    name: "TextArea",
                    text: ""
                }
            ]
            console.log("askPage", pageName)
            context.commit("savePageContent", data)
        },
        saveCContent(context, data) {
            console.log("pstoreAC")
            context.commit("saveCContent", data)
            //axios 保存文本框内的内容
        }
    },
}
export default createStore({
    modules: {
        UserStore,
        NoteStore,
        PageStore
    }
})
