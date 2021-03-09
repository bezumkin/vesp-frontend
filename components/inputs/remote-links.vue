<template>
  <section class="vesp-remote-links">
    <b-input-group>
      <template #prepend>
        <b-form-select v-model="form.service" :options="myServices">
          <template #first>
            <b-form-select-option :value="null" disabled selected>---</b-form-select-option>
          </template>
        </b-form-select>
      </template>

      <b-form-input v-model="form.link" type="url" :disabled="!form.service" @keydown="onKeyDown" />

      <template #append>
        <b-button :disabled="!form.service || !form.link" @click.prevent="onAdd">
          <fa icon="check" />
        </b-button>
      </template>
    </b-input-group>

    <b-table-simple :responsive="true">
      <b-tbody>
        <b-tr v-for="(link, service) in myValue" :key="link">
          <b-td class="align-middle border-bottom">{{ getTitle(service) }}</b-td>
          <b-td class="align-middle border-bottom">
            <a v-if="service === 'email'" :href="'mailto:' + link" target="_blank" v-text="link" />
            <a v-else :href="link" target="_blank" v-text="link" />
          </b-td>
          <b-td class="align-middle border-bottom p-0 text-right">
            <b-button variant="light" class="text-danger" @click="onDelete(service)">
              <fa icon="times" />
            </b-button>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </section>
</template>

<script>
export default {
  name: 'VespRemoteLinks',
  props: {
    value: {
      type: [Array, Object],
      default() {
        return {}
      },
    },
    services: {
      type: Object,
      default() {
        return {facebook: 'Facebook', instagram: 'Instagram', twitter: 'Twitter'}
      },
    },
  },
  data() {
    return {
      form: {
        service: null,
        link: null,
      },
    }
  },
  computed: {
    myValue: {
      get() {
        return this.value && !Array.isArray(this.value) ? this.value : {}
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
    myServices() {
      const services = []
      for (const i in this.services) {
        services.push({text: this.services[i], value: i})
      }
      return services
    },
  },
  methods: {
    onKeyDown(e) {
      if (e.code === 'Enter') {
        e.stopPropagation()
        e.preventDefault()
        this.onAdd()
      }
    },
    onAdd() {
      if (!this.form.service || !this.form.link || !/\./.test(this.form.link)) {
        return
      }
      const value = JSON.parse(JSON.stringify(this.myValue))
      value[this.form.service] =
        !this.form.link.startsWith('http') && !/@/.test(this.form.link) ? 'https://' + this.form.link : this.form.link
      this.myValue = value
      this.form.service = null
      this.form.link = null
    },
    onDelete(key) {
      const value = JSON.parse(JSON.stringify(this.myValue))
      delete value[key]
      this.myValue = value
    },
    getTitle(service) {
      for (const i in this.services) {
        if (i === service) {
          return this.services[i]
        }
      }
      return service
    },
  },
}
</script>
