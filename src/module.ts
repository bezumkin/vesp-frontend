import type {IconStyle} from '@fortawesome/fontawesome-svg-core'
import type {NuxtI18nOptions} from '@nuxtjs/i18n'
import type {PluginOptions} from 'vue-toastification'
import {
  defineNuxtModule,
  installModule,
  addPlugin,
  createResolver,
  addComponentsDir,
  addTemplate,
  addImportsDir,
} from '@nuxt/kit'

import type {Ref} from 'vue'
import type {ButtonVariant, Size} from 'bootstrap-vue-next'

export interface ModuleOptions {
  i18n?: NuxtI18nOptions | false
  auth?: boolean
  toast: PluginOptions | false
  icons?: {[key in IconStyle]?: string[]} | false
  proIcons?: {[key in IconStyle]?: string[]} | false
  sharpIcons?: {[key in IconStyle]?: string[]} | false
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@vesp/frontend',
    configKey: 'vesp',
  },
  defaults: {
    i18n: {
      strategy: 'no_prefix',
      defaultLocale: 'en',
      compilation: {
        strictMessage: false,
      },
    },
    icons: {
      solid: [
        'faEye',
        'faEyeSlash',
        'faPlus',
        'faRepeat',
        'faEdit',
        'faTimes',
        'faCaretDown',
        'faCalendarAlt',
        'faCheck',
      ],
    },
    auth: true,
    toast: {
      // @ts-ignore
      position: 'bottom-right',
      maxToasts: 5,
      timeout: 5000,
      closeButton: false,
      closeOnClick: false,
      transition: 'Vue-Toastification__slideBlurred',
    },
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.auth) {
      addPlugin(resolver.resolve('./runtime/plugins/auth'))
    }
    if (options.i18n) {
      addPlugin(resolver.resolve('./runtime/plugins/i18n'))
      await installModule('@nuxtjs/i18n', options.i18n)
    }
    if (options.toast) {
      addTemplate({
        filename: 'vesp.toast.mjs',
        write: true,
        getContents: () => 'export const options = ' + JSON.stringify(options.toast),
      })
      addPlugin(resolver.resolve('./runtime/plugins/toast.client'))
    }

    addPlugin(resolver.resolve('./runtime/plugins/vesp'))
    addPlugin(resolver.resolve('./runtime/plugins/date-picker.client'))
    await installModule('@bootstrap-vue-next/nuxt')
    await installModule('@pinia/nuxt')
    await installModule('nuxt3-fontawesome', {
      component: 'vesp-fa',
      suffix: false,
      icons: options.icons,
      proIcons: options.proIcons,
      sharpIcons: options.sharpIcons,
    })
    await addComponentsDir({path: resolver.resolve('./runtime/components'), prefix: 'vesp'})
    addImportsDir(resolver.resolve('./runtime/utils'))

    nuxt.hook('modules:done', () => {
      console.info('Vesp module is ready')
    })
  },
})

export type VespTableAction = {
  size?: keyof Size
  variant?: keyof ButtonVariant
  class?: String | Array<string> | Object
  route?: any
  function?: Function
  icon?: String | Array<string>
  title?: String
  map?: Record<string, string>
  key?: string
  isActive?: Function
}

export type VespTableOnLoad = (data: {total: number; rows: any[]; [key: string]: any}) => {
  total: number
  rows: any[]
  [key: string]: any
}

export type VespFile = {
  id?: number
  uuid: string
  updated_at?: string
  [key: string]: any
}

export type VespFileOptions = {
  w?: string | number
  h?: string | number
  fit?: string
  fm?: string
  t?: string | number
  [key: string]: any
}

export type VespUserRole = {
  id: number
  title: string
  scope: string[]
  [key: string]: any
}

export type VespUser = {
  id: number
  username: string
  fullname?: string
  password?: string
  email?: string
  active?: boolean
  role_id?: number
  role?: VespUserRole
  [key: string]: any
}

export type VespAuthStore = {
  user: Ref<VespUser | undefined>
  token: Ref<string | undefined>
  loggedIn: Ref<boolean>
  loadUser: Function
  login: Function
  logout: Function
  setToken: Function
}

declare module '#app' {
  export interface NuxtApp {
    $image: (file: VespFile | Record<string, any>, options?: VespFileOptions, prefix?: string) => string
    $scope: (scopes: string | string[]) => boolean
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $image: (file: VespFile | Record<string, any>, options?: VespFileOptions, prefix?: string) => string
    $scope: (scopes: string | string[]) => boolean
  }
}
