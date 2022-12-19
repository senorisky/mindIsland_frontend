import {createStore} from 'vuex'
// eslint-disable-next-line no-unused-vars
import Axios from "@/utils/request";
// eslint-disable-next-line no-unused-vars
import qs from "qs";
import router from "@/router";
import {ElNotification} from "element-plus";
import {h} from "vue";

const UserStore = {
    state: {
        user: {
            name: null,
            email: "",
            id: "",
            header: "",
            desc: ""
        },
        token: String
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
            state.user.id = user.userId
            state.user.header = user.avatar
            state.user.desc = user.des
            console.log("userstore", state.user)
        },
        saveToken(state, token) {
            state.token = token;
        },
        resetData(state) {
            state.user = {}
            state.token = ""
        }
    },
    actions: {},
}
const NoteStore = {
    state: {
        menuData: [],//数据结构  [{note....children[]},{note:.....children[]}....]
        currentNote: {},//{name:,id:,....children[]}
        currentView: {},
        lastViewId: ""
        //PageData[]
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
        },
        getLastViewId(state) {
            return state.lastViewId;
        }
    },
    mutations: {

        resetData(state) {
            state.menuData = []
            state.currentNote = {};
            state.currentView = {};
            state.lastViewId = "";
        },
        saveCurrentNoteByName(state, noteName) {
            console.log("store", state.menuData)
            for (let index in state.menuData) {
                const note = state.menuData[index]
                if (note.name === noteName) {
                    state.currentNote = note;
                    localStorage.setItem("currentNote", JSON.stringify(note));
                }
            }
        },
        saveCurrentNote(state, note) {
            // console.log("store", state.menuData)
            state.currentNote = note;
            localStorage.setItem("currentNote", JSON.stringify(state.currentNote));
        },
        saveLastViewId(state, data) {
            state.lastViewId = data;
        },
        saveCurrentView(state, view) {
            state.currentView = view;
            localStorage.setItem("currentView", JSON.stringify(view));
        },
        saveCurrentViewById(state, view_id) {
            for (let index in state.currentNote.children) {
                const child = state.currentNote.children[index];
                if (child.id === view_id) {
                    state.currentView = child;
                    localStorage.setItem("currentView", JSON.stringify(state.currentView))
                    break;
                }
            }
        },
        saveCurrentNoteById(state, nid) {
            for (let index in state.menuData) {
                const note = state.menuData[index]
                if (note.id === nid) {
                    state.currentNote = note;
                    localStorage.setItem("currentNote", JSON.stringify(note));
                }
            }
        },
        saveMenuData(state, data) {
            state.menuData = data;
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
            console.log("保存菜单数据", state.menuData)
        },
        saveChild(state, data) {
            console.log(data.child)
            state.menuData[data.index].children.push(data.child)
            state.currentNote = state.menuData[data.index]
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
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
        },
        saveNoteInfo(state, info) {
            state.currentNote.info = info;
            localStorage.setItem("currentNote", JSON.stringify(state.currentNote));
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
        }
    },
    actions: {
        addChild(context, view) {
            for (let item in context.state.menuData) {
                if (context.state.menuData[item].name === view.fname) {
                    console.log(router.getRoutes())
                    const father = context.state.menuData[item];
                    Axios.post("/view/addView", view).then((res) => {
                        console.log("addView", res)
                        if (res.code == 200) {
                            context.commit("saveChild", {index: item, child: view})
                            router.addRoute(father.id, {
                                path: "/space/" + father.id + "/" + view.id,
                                name: view.id,
                                component: () => import(`../components/${view.component}`)
                            })
                        }
                    })
                    break;
                }
            }
        },
        addNote(context, note) {
            console.log(router.getRoutes());
            Axios.post("/note/addNote", note).then((res) => {
                console.log("addNote", res);
                if (res.code === 200) {
                    router.addRoute("space", {
                        path: "/space/" + note.id,
                        name: note.id,
                        component: () => import(`@/components/${note.component}`)
                    })
                    router.addRoute(note.id, {
                        path: "/space/" + note.id + "/Profile",
                        name: note.id + "Profile",
                        component: () => import(`../components/ProFile`)
                    })
                    context.commit("saveNote", note);
                }
            })
        },
        addPage(context, page) {
            console.log("addPage", UserStore.state.user)
            Axios.post("/note/addPage", page).then((res) => {
                console.log("addPage", res);
                if (res.code === 200) {
                    router.addRoute("space", {
                        path: "/space/" + page.id,
                        name: page.id,
                        component: () => import(`../components/${page.component}`)
                    })
                    context.commit("savePage", page);
                }
            })
        },
        changeNoteName(context, name) {
            const note = context.state.currentNote
            Axios.post("note/saveNote", note).then((res) => {
                console.log("change note name", res)
                if (res.code === 200) {
                    context.commit("saveNoteName", name);
                }
            })
        },
        changeNoteInfo(context, value) {
            const note = context.state.currentNote;
            note.info = value;
            Axios.post("note/saveNote", note).then((res) => {
                console.log("save note info", res)
                if (res.code === 200) {
                    console.log(res.data.note)
                    context.commit("saveCurrentNote", res.data.note);
                }
            })
        },
        deleteView(context, data) {
            Axios.post("/view/deleteView", data.view).then((res) => {
                let flag = false;
                if (data.view.id === context.state.currentView.id)
                    flag = true;
                if (res.code === 200) {
                    console.log(res)
                    //删除路由
                    router.removeRoute(data.view.id)
                    const tmp = context.state.menuData
                    for (let n in tmp) {
                        if (tmp[n].id === data.view.noteId) {
                            console.log("删除view", data.index)
                            tmp[n].children.splice(data.index, 1)
                            context.commit("saveMenuData", tmp)
                            context.commit("saveCurrentNoteById", tmp[n].id)
                        }
                    }
                    //如果删除的是当前的view  进行跳转
                    if (flag) {
                        context.commit("saveCurrentView", {})
                        router.push({
                            name: context.state.currentNote.id + "Profile",
                        });
                    }
                } else {
                    ElNotification({
                        title: '提示',
                        message: h('i', {style: 'color: teal'}, res.msg),
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        deleteNote(context, data) {
            Axios.get("/note/deleteNote", {
                params: {
                    noteId: data.noteId,
                },
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'lm-token': localStorage.getItem("token")
                }
            }).then((res) => {
                console.log("deleteNote", res)
                if (res.code === 200) {
                    //删除路由
                    for (let child of context.state.currentNote.children) {
                        router.removeRoute(child.id)
                    }
                    router.removeRoute(data.noteId)
                    //跳转至默认页
                    const tmp = context.state.menuData
                    for (let n in tmp) {
                        if (tmp[n].id === data.noteId) {
                            console.log("删除note", n)
                            tmp.splice(n, 1)
                            context.commit("saveMenuData", tmp)
                            context.commit("saveCurrentNote", {})
                            break;
                        }
                    }
                    router.push({
                        path: "/space/ProFile"
                    })
                }
            })
        }
    },
}

export default createStore({
    modules: {
        UserStore,
        NoteStore,
    }
})
