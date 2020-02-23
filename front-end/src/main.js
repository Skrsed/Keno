import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from './store/store'

import Register from './components/Register'
import Login from './components/Login'
import Keno from './components/Keno'
import CashIn from './components/CashIn'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { LinkPlugin } from 'bootstrap-vue'

import VueNumberInput from '@chenfengyuan/vue-number-input';

Vue.use(VueNumberInput);
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(LinkPlugin)
Vue.use(Vuex)

// Make Axios play nice with Django CSRF
//axios.defaults.xsrfCookieName = 'csrftoken'
//axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const router = new VueRouter({
    routes: [

        { path: '/signup', component: Register },
        { path: '/signin', name: 'signin', component: Login },
        { path: '/', component: Keno },
        { path: '/cashin', component: CashIn },
    ]
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');