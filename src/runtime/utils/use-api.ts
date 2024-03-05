import type {FetchContext, FetchOptions} from 'ofetch'
import {ofetch} from 'ofetch'
import type {UseFetchOptions} from 'nuxt/app'
import type {Composer} from 'vue-i18n'
import {useFetch, useNuxtApp} from '#app'
import {getApiUrl} from './vesp'
import {useToastError} from './use-toast'
import useAuth from './use-auth'

function onRequest({options}: FetchContext): void {
  const {token} = useAuth()
  if (token.value) {
    const headers = new Headers(options.headers || {})
    headers.set('Authorization', token.value)
    options.headers = headers
  }
}

function onResponseError({response}: FetchContext): void {
  if (process.client && response?._data) {
    const i18n = useNuxtApp().$i18n as Composer
    useToastError(i18n.t(response._data))
  }
}

export function useApi(endpoint: string, options: FetchOptions<any> = {}) {
  return ofetch(endpoint, {
    baseURL: getApiUrl(),
    onRequest,
    onResponseError,
    ...options,
  })
}

export function useCustomFetch(endpoint: string, options: UseFetchOptions<any> = {}) {
  return useFetch(endpoint, {
    baseURL: getApiUrl(),
    key: options.key || endpoint.split('/').join('-'),
    onRequest,
    onResponseError,
    ...options,
  })
}

export function useGet(endpoint: string, params = {}, options: FetchOptions<any> = {}) {
  return useApi(endpoint, {...options, query: params, method: 'GET'})
}

export function usePost(endpoint: string, params = {}, options: FetchOptions<any> = {}) {
  return useApi(endpoint, {...options, body: params, method: 'POST'})
}

export function usePut(endpoint: string, params = {}, options: FetchOptions<any> = {}) {
  return useApi(endpoint, {...options, body: params, method: 'PUT'})
}

export function usePatch(endpoint: string, params = {}, options: FetchOptions<any> = {}) {
  return useApi(endpoint, {...options, body: params, method: 'PATCH'})
}

export function useDelete(endpoint: string, params = {}, options: FetchOptions<any> = {}) {
  return useApi(endpoint, {...options, query: params, method: 'DELETE'})
}
