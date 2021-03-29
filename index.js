import path from 'path'
import {existsSync} from 'fs'
import Config from './nuxt.config.js'

export {Config}

export function findEnv(dir, files = ['.env.local', '.env', '.env.dist']) {
  for (const name of files) {
    const file = path.resolve(dir, name)
    if (existsSync(file)) {
      return file
    }
  }
  return false
}

export function loadEnv(file = null, config = {}) {
  config.path = file
  return require('dotenv').config(config)
}

export default function nuxtVesp(moduleOptions) {
  const options = Object.assign({}, this.options.Vesp, moduleOptions)

  if (options.components !== false) {
    this.addPlugin(path.resolve(__dirname, 'plugins/components.js'))
  }

  if (options.scss !== false) {
    this.options.css.push(path.resolve(__dirname, 'assets/scss/_components.scss'))
  }

  if (options.i18n !== false) {
    this.options.plugins.push(path.resolve(__dirname, 'plugins/i18n.js'))
  }

  if (options.axios !== false) {
    this.options.plugins.push(path.resolve(__dirname, 'plugins/axios.js'))
  }

  if (options.utils !== false) {
    this.options.plugins.push(path.resolve(__dirname, 'plugins/utils.js'))
  }

  if (options.filters !== false) {
    this.options.plugins.push(path.resolve(__dirname, 'plugins/filters.js'))
  }
}
