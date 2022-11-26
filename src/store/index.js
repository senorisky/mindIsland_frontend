import {createStore} from 'vuex'
// eslint-disable-next-line no-unused-vars
import Axios from "@/utils/request";
// eslint-disable-next-line no-unused-vars
import qs from "qs";
import router from "@/router";
import {ElNotification} from "element-plus";
import {h, toRaw} from "vue";


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
        }
    },
    actions: {},
}
const NoteStore = {
    state: {
        menuData: [],//数据结构  [{note....children[]},{note:.....children[]}....]
        currentNote: new Object(),//{name:,id:,....children[]}
        currentView: new Object(),
        currentViewData: new Object()
        //{id:,vid:,items:[{colum:,items[{name:},{name:}....]},{colum:,items[]}.....]}  ListData
        //{id:,viewId:,[{name:,url:},......]}  Gallery
        //{id:,viewId:,[{name:head:description:time:,resource:}......]}  singleListData
        //PageData[]
    },
    getters: {
        getCurrenNote(state) {
            return state.currentNote;
        },
        getMenuData(state) {
            return state.menuData;
        },
        getCurrentViewData(state) {
            return state.currentViewData;
        },
        getCurrentView(state) {
            return state.currentView;
        }
    },
    mutations: {
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
            console.log("store", state.menuData)
            state.currentNote = note;
        },
        saveCurrentViewData(state, data) {
            state.currentViewData = data;
        },
        saveCurrentView(state, view) {
            state.currentView = view;
            localStorage.setItem("currentView", JSON.stringify(view));
        },
        saveCurrentViewById(state, view_id) {
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
            state.currentViewData.datas = listData;
            console.log("store", "write curview")
        },
        saveMenuData(state, data) {
            state.menuData = data;
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
            console.log("保存菜单数据", state.menuData)
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
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
        },
        saveNoteInfo(state, info) {
            state.currentNote.info = info;
            localStorage.setItem("menuData", JSON.stringify(state.menuData))
        },
        saveLastGalleryPic(state, pic) {
            state.currentViewData.datas.push(pic);
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
                if (res.code === 200) {
                    context.commit("saveMenuData", res.data.notes);
                }
            })
        },
        addPage(context, page) {
            router.addRoute("space", {
                path: "/space/" + page.name,
                name: page.name,
                component: () => import(`../components/${page.component}`)
            })
            console.log("addPage", UserStore.state.user)
            Axios.post("/note/addPage", page).then((res) => {
                console.log("addPage", res);
                if (res.code === 200) {
                    context.commit("savePage", page);
                }
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
        },
        addListColum(context, list) {
            const tmp = context.state.currentViewData;
            console.log("addlistColum", tmp)
            tmp.datas.push(list);
            Axios.post("/elist/saveEList", {elist: tmp, url: ""}).then((res) => {
                if (res.code === 200) {
                    console.log("listAddColum", res);
                    context.commit("saveCurrentViewData", tmp);
                } else {
                    ElNotification({
                        title: '提示',
                        message: h('i', {style: 'color: teal'}, '添加失败'),
                    })
                    return;
                }
            }).catch(function (error) {
                console.log(error);
                // alert('系统繁忙请联系管理员');
            });
        },
        addTableColum(context, name) {
            Axios.get("/etable/addTableColumn", {
                params: {
                    name,
                    viewId: context.state.currentView.id
                }
            }).then((res) => {
                if (res.code === 200) {
                    console.log("addtableColumn", res.data)
                    context.commit("saveCurrentViewData", res.data.etable)
                }
                ElNotification({
                    title: '提示',
                    message: h('i', {style: 'color: teal'}, res.msg),
                })
            }).catch(function (error) {
                console.log(error)
                ElNotification({
                    title: '提示',
                    message: h('i', {style: 'color: teal'}, "系统错误，请检查网络"),
                })
            })
        },
        addItem(context, form) {
//为列表添加item
            const tmp = context.state.currentViewData;
            console.log("addItem", tmp)
            const t = toRaw(tmp)
            t.datas[form.index].items.push({
                name: form.name,
                date: form.date,
                des: form.desc
            })
            Axios.post("/elist/saveEList", {
                elist: tmp,
                url: ""
            }).then((res) => {
                if (res.code === 200) {
                    console.log(res);
                    const elist = {
                        id: res.data.elist.id,
                        viewId: res.data.elist.viewId,
                        datas: res.data.elist.datas
                    }
                    context.commit("saveCurrentViewData", elist)
                }
                ElNotification({
                    title: '提示',
                    message: h('i', {style: 'color: teal'}, res.msg),
                })

            }).catch(function (error) {
                console.log(error);
                // alert('系统繁忙请联系管理员');
            });
        },
        addTableItem(context) {
            Axios.get("/etable/addTableItem", {
                params: {
                    viewId: context.state.currentView.id
                }
            }).then((res) => {
                console.log("addTableItem", res)
                if (res.code === 200) {
                    context.commit("saveCurrentViewData", res.data.etable)
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
        deleteListItem(context, param) {
            const l = param.Lindex;
            const index = param.index;
            const tmp = context.state.currentViewData;
            const t = toRaw(tmp)
            let url = "";
            let poster = "";
            if (t.datas[l].items[index].url !== undefined) {
                url = t.datas[l].items[index].url;
            }
            if (t.datas[l].items[index].poster !== undefined) {
                poster = t.datas[l].items[index].poster;
            }
            // console.log("deleteListItem", tmp, index)
            t.datas[l].items.splice(index, 1);
            Axios.post("/elist/saveEList", {
                elist: t,
                url,
                poster
            }).then((res) => {
                if (res.code === 200) {
                    console.log("deleteListItem", res);
                    const elist = {
                        id: res.data.elist.id,
                        viewId: res.data.elist.viewId,
                        datas: res.data.elist.datas
                    }
                    context.commit("saveCurrentViewData", elist);
                } else {
                    ElNotification({
                        title: '提示',
                        message: h('i', {style: 'color: teal'}, '删除失败'),
                    })
                    return;
                }
            }).catch(function (error) {
                console.log(error);
                // alert('系统繁忙请联系管理员');
            });
        },
        deleteTableItem(context, index) {
            Axios.get("/etable/deleteTableItem", {
                params: {
                    index,
                    viewId: context.state.currentView.id
                }
            }).then(((res) => {
                console.log("deleteTableItem", res)
                if (res.code === 200) {
                    context.commit("saveCurrentViewData", res.data.etable)
                } else {
                    ElNotification({
                        title: '提示',
                        message: h('i', {style: 'color: teal'}, res.msg),
                    })
                }
            })).catch(function (error) {
                console.log(error)
            })
        },
        deleteTableColum(context, item) {
            Axios.get("/etable/deleteTableColum", {
                params: {
                    name: item,
                    viewId: context.state.currentView.id
                }
            }).then((res) => {
                // console.log("deleteTableColum")
                if (res.code === 200) {
                    context.commit("saveCurrentViewData", res.data.etable);
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
        deleteView(context, data) {
            Axios.post("/view/deleteView", data.view).then((res) => {
                let flag = false;
                if (data.view.id === context.state.currentView.id)
                    flag = true;
                if (res.code === 200) {
                    console.log(res)
                    const tmp = context.state.menuData
                    for (let n in tmp) {
                        if (tmp[n].id === data.view.noteId) {
                            console.log("删除view", data.index)
                            tmp[n].children.splice(data.index, 1)
                            context.commit("saveMenuData", tmp)
                            context.commit("saveCurrentNote", tmp[n])
                        }
                    }
                    //如果删除的是当前的view  进行跳转
                    if (flag) {
                        context.commit("saveCurrentView", new Object())
                        context.commit("saveCurrentViewData", new Object())
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
        galleryDeleteOnePic(context, file) {
            Axios.get("/gallery/deleteOne", {
                params: {
                    userId: UserStore.state.user.id,
                    viewId: context.state.currentView.id,
                    picName: file.name
                }
            }).then((res) => {
                console.log(res)
                if (res.code === 200) {
                    context.commit("saveCurrentViewData", res.data.gallery)
                } else {
                    ElNotification({
                        title: '提示',
                        message: h('i', {style: 'color: teal'}, res.msg),
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
}
//存当前Page的内容
const PageStore = {
    state: {
        pageData: new Object()//  {noteId,imgPath,datas[{name:text:},{}.....]
    },
    getters: {
        getComponentsArr(state) {
            console.log("getPageComponent", state.pageData.datas)
            return state.pageData.datas;
        },
        getPageData(state) {
            return state.pageData;
        }
    },
    mutations: {
        addH1(state, h1) {
            console.log("pagestore", h1)
            state.pageData.datas.push(h1)
            localStorage.setItem("curPageData", JSON.stringify(state.pageData))
        },
        addTextArea(state, text) {
            state.pageData.datas.push(text)
            localStorage.setItem("curPageData", JSON.stringify(state.pageData))
        },
        addH2(state, h2) {
            state.pageData.datas.push(h2)
            localStorage.setItem("curPageData", JSON.stringify(state.pageData))
        },
        addH3(state, h3) {
            state.pageData.datas.push(h3)
            localStorage.setItem("curPageData", JSON.stringify(state.pageData))
        },
        addPicArea(state, pic) {
            state.pageData.datas.push(pic)
            localStorage.setItem("curPageData", JSON.stringify(state.pageData))
        },
        savePageData(state, content) {
            state.pageData = content;
            localStorage.setItem("curPageData", JSON.stringify(state.pageData))
        },
        saveCContent(state, data) {
            //修改当前Page的当前组件的内容
            // console.log("pstoreMU", data)
            console.log("saveCContent", state.pageData)
            state.pageData.datas[data.index].text = data.text;
            console.log("pstoreMU", state.pageData.datas[data.index].text)
            localStorage.setItem("curPageData", JSON.stringify(state.pageData))
        }
    },
    actions: {
        deletePageItems(context, index) {
            console.log("删除page元素", index)
            Axios.get("/page/deletePageItem", {
                params: {
                    noteId: context.state.pageData.noteId,
                    index
                }
            }).then((res) => {
                console.log("删除page元素", res)
                if (res.code === 200) {
                    context.commit("savePageData", res.data.page)
                }
            })
        },
        saveCContenttmp(context, data) {
            //axios 保存当前 文本框内的内容
            context.commit("saveCContent", data)
        },
        saveCContent(context, data) {
            //做一个比较如果内容相同就不发请求也不更新
            const index = data.index;
            console.log("保存内容", data)
            Axios.get("/page/savePageItemContent", {
                params: {
                    index,
                    text: data.text,
                    noteId: context.state.pageData.noteId
                }
            }).then((res) => {
                console.log("savePage", res)
                if (res.code === 200) {
                    console.log("savePageSuccess", res.data)
                    context.commit("savePageData", res.data.page)
                }
            })
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
