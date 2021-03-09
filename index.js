import path from 'path'
import Config from './nuxt.config.js'

export {Config}

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
