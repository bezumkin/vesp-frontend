export function hasScope(scopes, auth) {
  if (!auth || !auth.loggedIn || !auth.user || !auth.user.scope) {
    return false
  }

  const check = (scope) => {
    if (scope.includes('/')) {
      return auth.user.scope.includes(scope) || auth.user.scope.includes(scope.replace(/\/.*/, ''))
    }
    return auth.user.scope.includes(scope) || auth.user.scope.includes(`${scope}/get`)
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

export function imageLink(file, options = {}, baseUrl = 'image') {
  const params = [baseUrl]
  params.push(/^\d+$/.test(file) ? file : file.id)
  if (file.updated_at) {
    options.t = new Date(file.updated_at).getTime()
  }
  return params.join('/') + '?' + new URLSearchParams(options).toString()
}

export default ({app}, inject) => {
  inject('hasScope', (scopes) => {
    return hasScope(scopes, app.$auth)
  })

  inject('image', (file, options) => {
    return imageLink(file, options, app.$axios.defaults.baseURL + 'image')
  })
}
