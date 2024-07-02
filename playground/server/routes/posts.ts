import {ofetch} from 'ofetch'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/json')

  return await ofetch(getApiUrl() + 'posts')
})
