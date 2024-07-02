import type {VespFile, VespFileOptions} from '../../module'
import {useRuntimeConfig} from '#imports'

export function getApiUrl(): string {
  const {public: config} = useRuntimeConfig()
  const SITE_URL = String(config.SITE_URL || 'http://localhost')
  const API_URL = String(config.API_URL || 'api')

  const url = /:\/\//.test(API_URL)
    ? API_URL
    : [
        SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL,
        API_URL.startsWith('/') ? API_URL.substring(1) : API_URL,
      ].join('/')
  return url.endsWith('/') ? url : url + '/'
}

export function getImageLink(file: VespFile | Record<string, any>, options?: VespFileOptions, prefix?: string): string {
  const params = [getApiUrl().slice(0, -1), prefix || 'image', file.uuid || file.id]
  if (file.updated_at) {
    if (!options) {
      options = {}
    }
    if (!options.fm) {
      options.fm = 'webp'
    }
    options.t = file.updated_at.split('.').shift()?.replaceAll(/\D/g, '')
  }
  return params.join('/') + '?' + new URLSearchParams(options as Record<string, string>).toString()
}
