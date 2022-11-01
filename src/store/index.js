import {createStore} from 'vuex'
// import {toRaw} from "vue";

const objToStrMap = function (obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
/**
 *json转换为map
 */
const jsonToMap = function (jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
}
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
        }
    },
    mutations: {
        saveUser(state, user) {
            state.user.name = user.username;

        },

    },
    actions: {},
}
const NoteStore = {
    state: {
        notes: new Map(),
        noteNames: [],
        childrenName: [],
        children: new Map(),
        menuData: [],
        currentNote: new Object()
    },
    getters: {
        getCurrenNote(state) {
            return state.currentNote;
        },
        getNotes(state) {
            return state.notes
        }, getchildren(state) {
            return state.children
        },
        getMenuData(state) {
            return state.menuData;
        }

    },
    mutations: {
        saveCurrentNote(state, noteName) {
            // console.log("store", state.notes)
            const notes = jsonToMap(state.notes)
            state.currentNote = notes.get(noteName);
        },
        savechildrenName(state, names) {
            state.childrenName = names;
        },
        saveNoteNames(state, names) {
            state.noteNames = names;
        },
        saveNotes(state, notes) {
            state.notes = notes;
        },
        savechildren(state, children) {
            state.children = children;
        },
        saveMenuData(state, data) {
            state.menuData = data;
        }
    },
    actions: {},
}
export default createStore({
    modules: {
        UserStore,
        NoteStore
    }
})
