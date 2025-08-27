import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '../src/module.ts'],
  ssr: true,
  css: ['~/assets/index.scss'],
  runtimeConfig: {
    public: {
      API_URL: 'https://jsonplaceholder.typicode.com/',
    },
  },
  compatibilityDate: '2025-07-24',
  vite: {css: {preprocessorOptions: {scss: {quietDeps: true}}}},
  eslint: {
    checker: true,
    config: {
      stylistic: {
        semi: false,
        arrowParens: true,
        quotes: 'single',
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
        blockSpacing: false,
      },
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
  vesp: {
    icons: {
      solid: ['faUser', 'faUsers', 'faList'],
    },
  },
})
