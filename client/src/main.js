import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMq from 'vue-mq'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'
import izitoast from 'izitoast'
import { API_URL } from './common/constants'

import 'izitoast/dist/css/iziToast.min.css'

Vue.config.productionTip = false

izitoast.settings({
  position: 'topCenter',
  transitionIn: 'fadeInDown',
  transitionOut: 'fadeOutUp',
  transitionInMobile: 'fadeInDown',
  transitionOutMobile: 'fadeOutUp',
  progressBar: false
})

Vue.use(VueMq, {
  breakpoints: {
    tablet: 769,
    desktop: 1024,
    widescreen: 1216,
    fullhd: Infinity
  }
})
Vue.use(VueSocketio, io(API_URL), store)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
