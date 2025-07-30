<template>
  <section class="vesp-remote-links">
    <BInputGroup>
      <template #prepend>
        <BFormSelect v-model="form.service" :options="myServices">
          <template #first>
            <BFormSelectOption :value="null" disabled selected>
              ---
            </BFormSelectOption>
          </template>
        </BFormSelect>
      </template>

      <BFormInput v-model="form.link" type="url" :disabled="!form.service" @keydown="onKeyDown" />

      <template #append>
        <BButton :disabled="!form.service || !form.link" @click.prevent="onAdd">
          <VespFa icon="check" fixed-width />
        </BButton>
      </template>
    </BInputGroup>

    <BTableSimple :responsive="true" class="vesp-table">
      <BTbody>
        <BTr v-for="(link, service) in myValue" :key="link">
          <BTd class="align-middle border-bottom">
            {{ getTitle(service) }}
          </BTd>
          <BTd class="align-middle border-bottom">
            <a v-if="service === 'email'" :href="'mailto:' + link" target="_blank" v-text="link" />
            <a v-else :href="link" target="_blank" v-text="link" />
          </BTd>
          <BTd class="actions pe-0">
            <BButton variant="light" class="text-danger" @click="onDelete(service)">
              <VespFa icon="times" fixed-width />
            </BButton>
          </BTd>
        </BTr>
      </BTbody>
    </BTableSimple>
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
  value[form.value.service]
    = !form.value.link.startsWith('http') && !/@/.test(form.value.link) ? 'https://' + form.value.link : form.value.link
  myValue.value = value
  form.value.service = ''
  form.value.link = ''
}

function onDelete(key: string) {
  const value = JSON.parse(JSON.stringify(myValue.value))
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
