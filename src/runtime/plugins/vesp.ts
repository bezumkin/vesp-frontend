import {defineNuxtPlugin} from '#app'
import {hasScope} from '../utils/has-scope'
import {getImageLink} from '../utils/get-api'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      image: getImageLink,
      scope: hasScope,
    },
  }
})
