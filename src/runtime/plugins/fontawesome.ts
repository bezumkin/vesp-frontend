import {defineNuxtPlugin} from '#app'
import {library, config} from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import {faIcons} from '#build/vesp.fontawesome.mjs'

config.autoAddCss = false

export default defineNuxtPlugin(() => {
  library.add(faIcons)
})
