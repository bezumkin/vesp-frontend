import en from './lexicons/en'
import de from './lexicons/de'
import ru from './lexicons/ru'

export default {
  head: {
    title: 'Vesp Frontend',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'},
    ],
  },
  modules: ['@nuxtjs/axios', '@nuxtjs/toast', '@nuxtjs/i18n', 'bootstrap-vue/nuxt'],
  buildModules: ['@nuxtjs/style-resources', '@nuxtjs/fontawesome', '@nuxtjs/date-fns', '@nuxtjs/eslint-module'],
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
    loaders: {
      sass: {
        implementation: require('sass'),
        sassOptions: {quietDeps: true},
      },
      scss: {
        implementation: require('sass'),
        sassOptions: {quietDeps: true},
      },
    },
  },
  css: ['~/assets/scss/index.scss'],
  styleResources: {
    scss: '~/assets/scss/_variables.scss',
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    componentPlugins: [
      'LayoutPlugin',
      'NavbarPlugin',
      'LinkPlugin',
      'AlertPlugin',
      'TablePlugin',
      'ModalPlugin',
      'PaginationPlugin',
      'ButtonPlugin',
      'OverlayPlugin',
      'FormPlugin',
      'FormGroupPlugin',
      'FormInputPlugin',
      'FormTextareaPlugin',
      'FormSelectPlugin',
      'InputGroupPlugin',
    ],
  },
  axios: {
    baseURL: '/api/',
  },
  router: {
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
  },
  toast: {
    position: 'bottom-right',
    keepOnHover: true,
    duration: 5000,
    theme: 'default',
  },
  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['faSync', 'faEdit', 'faTimes', 'faPlus', 'faRedo', 'faFilter', 'faCaretDown', 'faCalendarAlt'],
    },
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      {code: 'en', title: 'English'},
      {code: 'de', title: 'Deutsch'},
      {code: 'ru', title: 'Русский'},
    ],
    defaultLocale: 'en',
    differentDomains: false,
    vuex: {
      moduleName: 'i18n',
      syncLocale: true,
      syncMessages: true,
      syncRouteParams: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieDomain: null,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    parsePages: false,
    vueI18n: {
      fallbackLocale: 'en',
      messages: {en, de, ru},
    },
  },
  dateFns: {
    defaultLocale: 'en-GB',
    locales: ['en-GB', 'de', 'ru'],
    methods: ['parse', 'format', 'getUnixTime', 'formatDistanceToNow', 'differenceInSeconds'],
  },
  auth: {
    redirect: false,
    watchLoggedIn: true,
    resetOnError: true,
    strategies: {
      local: {
        endpoints: {
          login: {url: 'security/login', method: 'post', propertyName: 'token'},
          logout: {url: 'security/logout', method: 'post'},
          user: {url: 'user/profile', method: 'get', propertyName: 'user'},
        },
      },
    },
  },
}
