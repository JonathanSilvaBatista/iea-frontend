import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import { store } from './vuex/store'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import VueTheMask from 'vue-the-mask'

Vue.config.productionTip = false

Vue.use(VueSidebarMenu)
Vue.use(Datetime)
Vue.use(VueTheMask)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
