import type {VespUser} from '../../module'
import useAuth from './use-auth'

export function hasScope(scopes: string | string[]): boolean {
  const {user: data} = useAuth()
  const user: VespUser = {id: 0, username: '', ...data.value}
  if (!user || !user.role || !user.role.scope) {
    return false
  }
  const {role} = user

  const check = (scope: string) => {
    if (scope.includes('/')) {
      return role.scope.includes(scope) || role.scope.includes(scope.replace(/\/.*/, ''))
    }
    return role.scope.includes(scope) || role.scope.includes(`${scope}/get`)
  }

  if (Array.isArray(scopes)) {
    for (const scope of scopes) {
      if (check(scope)) {
        return true
      }
    }
    return false
  }

  return check(scopes)
}
