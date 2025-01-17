import {useRuntimeConfig, useCookie} from '#app'
import {defineStore} from 'pinia'
import {computed, ref, type Ref} from 'vue'
import {usePost, useGet} from '../utils/use-api'
import type {VespUser} from '../../module'

const tokenName = 'auth:token'
const tokenType = 'Bearer'

export const useVespAuthStore = defineStore('auth', () => {
  const maxAge = Number(useRuntimeConfig().public.JWT_EXPIRE) || 2592000
  const cookie = useCookie(tokenName, {path: '/', maxAge})
  const token = computed<string | undefined>({
    get() {
      return cookie.value || undefined
    },
    set(newValue: string | undefined) {
      cookie.value = newValue
    },
  })

  const user: Ref<VespUser | undefined> = ref()
  const loggedIn = computed(() => Boolean(user.value && user.value.id > 0))

  async function login(username: string, password: string) {
    const {token} = await usePost('security/login', {username, password})
    if (token) {
      await setToken(token)
    }
  }

  async function logout() {
    if (token.value) {
      await usePost('security/logout')
    }
    await setToken(undefined)
  }

  async function loadUser() {
    if (token.value) {
      const {user} = await useGet('user/profile')
      if (user) {
        setUser(user)
      }
    }
  }

  function setUser(data: VespUser | undefined = undefined) {
    user.value = data && data.id ? data : undefined
  }

  async function setToken(data: string | undefined = undefined) {
    if (data) {
      token.value = tokenType + ' ' + data
      await loadUser()
    } else {
      token.value = undefined
      setUser(undefined)
    }
  }

  return {loggedIn, token, user, loadUser, login, logout, setToken}
})
