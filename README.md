# Vesp Frontend

This library add default modules, plugins and settings to your Nuxt.js project to make it easier to start.

- [Bootstrap Vue](https://bootstrap-vue.org) as a main components library
- [Nuxt i18n](https://i18n.nuxtjs.org) for internalization
- [Nuxt Fontawesome](https://github.com/nuxt-community/fontawesome-module) for using famous icons (only solid pack)
- [Nuxt Axios](https://axios.nuxtjs.org) for making requests to remote APIs
- [Nuxt Style Resources](https://github.com/nuxt-community/style-resources-module) for using common sass variables in components
- [Nuxt Toast](https://www.npmjs.com/package/%40nuxtjs/toast) for displaying handy popup messages
- [Eslint](https://eslint.org) and [Prettier](https://prettier.io) to add rules for your code style
- **Node SASS** and **SASS loader** to support sass/scss styles in assets and components

## Quick Start

1. Create a [new Nuxt.js project](https://nuxtjs.org/docs/2.x/get-started/installation)

2. Then add the dependency:
```npm
yarn add @vesp/frontend
```
or
```npm
npm i @vesp/frontend
```

3. Change your nuxt.config.js to this
```js
import {Config} from '@vesp/frontend'

// Enable Vesp module
Config.modules.push('@vesp/frontend')

/*
// You can change the default config here
// Add a star icon to Fontawesome, for example
Config.fontawesome.icons.solid.push('faStar')
*/

export default Config
```

4. Now you can use Vesp components in your Nuxt project

### Config
When you connect the Vesp module, you can specify its options:
```js
Config.modules.push(['@vesp/frontend', {
  components: true, // load of Vesp Vue components
  scss: true, // load SCSS files for components
  i18n: true, // enable Russian rules for i18n pluralization
  axios: true, // add special interceptors to Axios to display requests errors
}])
```
By default all options are true.

## Components
@TODO add more detailed description of components

### Vesp-Table
This component extends BootstrapVue's `b-table` component and add a lot of features, including row actions and filters. 

### Vesp-Modal
This component extends BootstrapVue's `b-modal` component and add ability to submit forms.

### Vesp-Change-Locale
Simple component to change the current locale of project. 
You can use `#default` slot to change how it looks.

### Vesp-Input-Remote-Links
Component for adding a list of links in JSON object, where key will be the name of service and value is a link to it.
Very usefull for submitting a list of social networks for user.

### Vesp-Input-Combo-Box
`b-form-input` with popup list containing variants from remote API.

## Examples

See `layouts` and `pages` directories for examples of using components.

Just remember, that **you don't need to import components**, because they are already imported by `@vesp/frontend` module.
You can use `<vesp-table />` and other components freely.
