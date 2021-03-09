export default ({app}, inject) => {
  const hasScope = (scope) => {
    if (!app.$auth.loggedIn) {
      return false
    }
    if (scope.includes('/')) {
      return app.$auth.hasScope(scope) || app.$auth.hasScope(scope.replace(/\/.*/, ''))
    }
    return app.$auth.hasScope(scope) || app.$auth.hasScope(`${scope}/get`)
  }

  inject('hasScope', (scopes) => {
    if (Array.isArray(scopes)) {
      for (const scope of scopes) {
        if (hasScope(scope)) {
          return true
        }
      }
      return false
    }
    return hasScope(scopes)
  })

  inject('image', (data, options) => {
    const params = [app.$axios.defaults.baseURL + 'image']
    params.push(/^\d+$/.test(data) ? data : data.id)
    if (!options) {
      options = {}
    }
    if (data.updated_at) {
      options.t = new Date(data.updated_at).getTime()
    }

    return params.join('/') + '?' + new URLSearchParams(options).toString()
  })
}
