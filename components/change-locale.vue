<template>
  <div>
    <slot name="default" v-bind="{locale, locales, setLocale}">
      <b-select :value="locale" @change="setLocale">
        <b-select-option v-for="item in locales" :key="item.code" :value="item.code" v-text="item.title" />
      </b-select>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'VespChangeLocale',
  computed: {
    locale() {
      return this.$i18n.locale
    },
    locales() {
      return this.$i18n.locales
    },
  },
  methods: {
    setLocale(value) {
      this.$i18n.setLocale(value)
    },
  },
}
</script>
