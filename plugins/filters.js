import Vue from 'vue'

export default ({app}) => {
  const locale = app.i18n.locale === 'en' ? 'en-GB' : app.i18n.locale

  Vue.filter('date', (value, format = 'dd.MM.yyyy') => {
    if (!value) {
      return ''
    }
    return app.$dateFns.format(new Date(value), format, {locale})
  })

  Vue.filter('datetime', (value) => {
    return Vue.filter('date')(value, 'dd.MM.yyyy HH:mm')
  })

  Vue.filter('time', (value) => {
    return value ? value.split(':').slice(0, 2).join(':') : ''
  })

  Vue.filter('dateago', (value) => {
    if (!value) {
      return ''
    }
    const now = new Date()
    const date = new Date(value)
    if (app.$dateFns.differenceInSeconds(now, date) > 3600 * 12) {
      return app.$dateFns.format(date, 'dd MMMM yyyy, HH:mm', {locale})
    }

    return app.$dateFns.formatDistanceToNow(date, {locale, addSuffix: true})
  })

  Vue.filter('truncate', (text, length = 120, clamp = '...') => {
    return text && text.length > length ? text.slice(0, length) + clamp : text
  })

  Vue.filter('bytes', (value, decimals = 2, sizes = ['B', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']) => {
    if (value === 0) {
      return `0 ${sizes[0]}`
    }

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const i = Math.floor(Math.log(value) / Math.log(k))

    return parseFloat((value / k ** i).toFixed(dm)) + ' ' + sizes[i]
  })
}
