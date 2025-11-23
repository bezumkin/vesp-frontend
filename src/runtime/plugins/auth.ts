import {defineNuxtPlugin, callOnce} from '#app'
import useAuth from '../utils/use-auth.js'

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth()

  const onInit = async () => {
    if (auth.token.value) {
      try {
        await auth.loadUser()
      } catch (e: any) {
        if (e.response && e.response.status === 401) {
          auth.setToken(undefined)
        }
      }
    }
  }

  await callOnce(onInit)

  return {
    provide: {auth},
  }
})
