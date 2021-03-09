export default ({app}) => {
  app.$axios.interceptors.request.use(function (config) {
    config.headers.common = {
      ...config.headers.common,
      'Content-Language': app.i18n ? app.i18n.locale : 'en',
    }
    return config
  })

  app.$axios.interceptors.response.use(
    function (config) {
      return config
    },
    function (error) {
      if (error.response) {
        switch (error.response.status) {
          case 422:
            if (error.response.data && typeof error.response.data === 'string') {
              app.$toast.error(app.i18n.t(error.response.data))
            }
            break
          case 401:
            if (app.$auth && app.$auth.loggedIn) {
              app.$auth.logout()
            } else {
              app.$toast.error(app.i18n.t('errors.http401'))
            }
            break
          case 403:
          case 404:
          case 500:
          case 0:
            app.$toast.error(app.i18n.t(`errors.http${error.response.status}`))
            if (error.response.data && typeof error.response.data === 'string') {
              app.$toast.error(error.response.data)
            }
            break
          default:
            if (error.response.data && typeof error.response.data === 'string') {
              app.$toast.error(app.i18n.t(error.response.data))
            }
        }
      } else if (!error.status) {
        if (error.name !== 'ExpiredAuthSessionError') {
          app.$toast.error(app.i18n.t('errors.http500'))
        }
      } else {
        app.$toast.error(app.i18n.t('errors.http0'))
      }

      return Promise.reject(error.response)
    },
  )
}
