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
          <vesp-fa icon="check" fixed-width />
        </b-button>
      </template>
    </b-input-group>

    <b-table-simple :responsive="true" class="vesp-table">
      <b-tbody>
        <b-tr v-for="(link, service) in myValue" :key="link">
          <b-td class="align-middle border-bottom">{{ getTitle(service) }}</b-td>
          <b-td class="align-middle border-bottom">
            <a v-if="service === 'email'" :href="'mailto:' + link" target="_blank" v-text="link" />
            <a v-else :href="link" target="_blank" v-text="link" />
          </b-td>
          <b-td class="actions pe-0">
            <b-button variant="light" class="text-danger" @click="onDelete(service)">
              <vesp-fa icon="times" fixed-width />
            </b-button>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </section>
</template>

<script setup lang="ts">
import {ref, computed, type WritableComputedRef} from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
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
})
const emit = defineEmits(['update:modelValue'])

const form = ref({
  service: '',
  link: '',
})

const myValue: WritableComputedRef<Record<string, string>> = computed({
  get() {
    return props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})
const myServices = computed(() => {
  const services = []
  for (const i in props.services) {
    services.push({text: props.services[i], value: i})
  }
  return services
})

function onKeyDown(e: KeyboardEvent) {
  if (e.code === 'Enter') {
    e.stopPropagation()
    e.preventDefault()
    onAdd()
  }
}

function onAdd() {
  if (!form.value.service || !form.value.link || !/\./.test(form.value.link)) {
    return
  }
  const value = JSON.parse(JSON.stringify(myValue.value))
  value[form.value.service] =
    !form.value.link.startsWith('http') && !/@/.test(form.value.link) ? 'https://' + form.value.link : form.value.link
  myValue.value = value
  form.value.service = ''
  form.value.link = ''
}

function onDelete(key: string) {
  const value = JSON.parse(JSON.stringify(myValue.value))
  delete value[key]
  myValue.value = value
}

function getTitle(service: string) {
  for (const i in props.services) {
    if (i === service) {
      return props.services[i]
    }
  }
  return service
}
</script>
