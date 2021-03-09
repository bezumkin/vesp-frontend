<template>
  <div>
    <b-navbar variant="light">
      <b-container>
        <b-navbar-brand>Vesp</b-navbar-brand>
        <vesp-change-locale class="col-3" />
      </b-container>
    </b-navbar>

    <nuxt />
  </div>
</template>

<script>
import VespChangeLocale from '~/components/change-locale'

export default {
  components: {VespChangeLocale},
}
</script>
