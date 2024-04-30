import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({
  telemetry: false,
  css: ['~/assets/index.scss'],
  devtools: {enabled: false},
  ssr: true,
  runtimeConfig: {
    public: {
      API_URL: 'https://jsonplaceholder.typicode.com/',
    },
  },
  modules: ['../src/module.ts'],
  // @ts-ignore
  vesp: {
    icons: {
      solid: ['faUser', 'faUsers', 'faList'],
    },
  },
  i18n: {
    locales: [
      {code: 'ru', name: 'Русский', iso: 'ru-RU'},
      {code: 'en', name: 'English', iso: 'en-GB'},
      {code: 'de', name: 'Deutsch', iso: 'de-DE'},
      {code: 'nl', name: 'Nederlands', iso: 'nl-NL'},
      {code: 'fr', name: 'Français', iso: 'fr-FR'},
    ],
  },
})
