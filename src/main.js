import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;
window.vueClass = Vue; /* FCG: WARNING for debugging purposes. */
window.theStore = store; /* FCG: WARNING for debugging purposes. */

// window.vueEL = new Vue({...App, store}).$mount('#app') /* FCG: WARNING/REVIEW THIS works! is it a better way?. */

window.vueEL = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
