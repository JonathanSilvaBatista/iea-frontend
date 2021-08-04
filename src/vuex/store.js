import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export const store = new Vuex.Store( {
    state: {
        user: [],
        pagina: '',
        sideMenu: true,
        termo: null,
        tab: null,
        tiposUsuario: [],
        setores: []
    },
    plugins: [createPersistedState()],
    mutations: {
        setUser (store, user) {
            store.user = user
        },
        setPagina (store, title) {
            store.pagina = title
        },
        setSideMenu (store, bool) {
            store.sideMenu = bool
        },
        setTermo (store, termo) {
            store.termo = termo
        },
        setTab (store, tab) {
            store.tab = tab
        },
        setTiposUsuario (store, array) {
            store.tiposUsuario = array
        },
        setSetores (store, array) {
            store.setores = array
        },
    },
    actions: {
        setUser: ({ commit }, user) => {
            commit('setUser', user)
        },
        setPagina: ({ commit }, title) => {
            commit('setPagina', title)
        },
        setSideMenu: ({ commit }, bool) => {
            commit('setSideMenu', bool)
        },
        setTermo: ({ commit }, termo) => {
            commit('setTermo', termo)
        },
        setTab: ({ commit }, tab) => {
            commit('setTab', tab)
        },
        setTiposUsuario: ({ commit }, array) => {
            commit('setTiposUsuario', array)
        },
        setSetores: ({ commit }, array) => {
            commit('setSetores', array)
        },
    },
    getters: {
        getUser: state => state.user,
        getPagina: state => state.pagina,
        getSideMenu: state => state.sideMenu,
        getTermo: state => state.termo,
        getTab: state => state.tab,
        getTiposUsuario: state => state.tiposUsuario,
        getSetores: state => state.setores,
    },
} )