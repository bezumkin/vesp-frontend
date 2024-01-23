import {defineNuxtPlugin} from '#app'
import VueDatePicker from 'vue-datepicker-next'
// import 'vue-datepicker-next/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueDatePicker', VueDatePicker)
})
