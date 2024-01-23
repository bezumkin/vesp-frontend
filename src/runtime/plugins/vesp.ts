import {defineNuxtPlugin} from '#app'
import {hasScope, getImageLink} from '../utils/vesp'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      image: getImageLink,
      scope: hasScope,
    },
  }
})
