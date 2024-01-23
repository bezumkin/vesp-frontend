import type {StoreGeneric} from 'pinia'
import {storeToRefs} from 'pinia'
import type {VespAuthStore} from '../../module'
import {useVespAuthStore} from '../stores/auth'

export default (): VespAuthStore => {
  const store: StoreGeneric = useVespAuthStore()

  const {loggedIn, user, token} = storeToRefs(store)
  const {loadUser, login, logout, setToken} = store

  return {user, token, loggedIn, loadUser, login, logout, setToken}
}
