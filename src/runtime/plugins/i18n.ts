import type {Composer} from 'vue-i18n'
import {defineNuxtPlugin} from '#app'
import type {DateTimeFormat} from '@intlify/core-base'
import en from '../lexicons/en'
import ru from '../lexicons/ru'
import de from '../lexicons/de'
import nl from '../lexicons/nl'
import fr from '../lexicons/fr'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as Composer

  const timeZone = import.meta.client ? window?.__NUXT__?.config.public.TZ : process.env.TZ
  const dateFormat: DateTimeFormat = {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone,
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone,
    },
  }

  i18n.mergeLocaleMessage('en', en)
  i18n.mergeLocaleMessage('ru', ru)
  i18n.mergeLocaleMessage('de', de)
  i18n.mergeLocaleMessage('nl', nl)
  i18n.mergeLocaleMessage('fr', fr)
  i18n.setDateTimeFormat('en', dateFormat)
  i18n.setDateTimeFormat('ru', dateFormat)
  i18n.setDateTimeFormat('de', dateFormat)
  i18n.setDateTimeFormat('nl', dateFormat)
  i18n.setDateTimeFormat('fr', dateFormat)
})
