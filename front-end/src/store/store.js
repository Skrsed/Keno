import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        authUser: {},
        isAuthenticated: false,
        jwt: localStorage.getItem('token'),
        userMoney: undefined,
        endpoints: {
            obtainJWT: 'http://localhost:8080/api/auth/login/',
            baseUrl: 'http://localhost:8080/api'
        }
    },
    plugins: [createPersistedState()],


    mutations: {
        setAuthUser(state, {
            authUser,
            isAuthenticated
        }) {
            Vue.set(state, 'authUser', authUser);
            Vue.set(state, 'isAuthenticated', isAuthenticated);
        },
        updateToken(state, newToken) {
            localStorage.setItem('token', newToken);
            state.jwt = newToken;
        },
        removeToken(state) {
            localStorage.removeItem('token');
            state.jwt = null;
        },
        unsetAuthUser(state) {
            Vue.set(state, 'authUser', {});
            Vue.set(state, 'isAuthenticated', false);
            Vue.set(state,'userMoney',undefined);
        },
        setUserMoney(state,userMoney){
            Vue.set(state,'userMoney',userMoney);
        }

    }
})