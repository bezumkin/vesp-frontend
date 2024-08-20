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
  vite: {css: {preprocessorOptions: {scss: {quietDeps: true}}}},
  modules: ['../src/module.ts'],
  vesp: {
    icons: {
      solid: ['faUser', 'faUsers', 'faList'],
    },
  },
  i18n: {
    locales: [
      {code: 'ru', name: 'Русский', language: 'ru-RU'},
      {code: 'en', name: 'English', language: 'en-GB'},
      {code: 'de', name: 'Deutsch', language: 'de-DE'},
      {code: 'nl', name: 'Nederlands', language: 'nl-NL'},
      {code: 'fr', name: 'Français', language: 'fr-FR'},
    ],
  },
  compatibilityDate: '2024-08-20',
})
