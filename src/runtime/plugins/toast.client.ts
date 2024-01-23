import {defineNuxtPlugin} from '#app'
import Toast from 'vue-toastification'
// @ts-ignore
import {options} from '#build/vesp.toast.mjs'

export default defineNuxtPlugin(({vueApp}) => {
  if (process.client) {
    vueApp.use(Toast, options)
  }
})
