<template>
  <BFormInput v-model="record" v-bind="props" :formatter="formatValue" />
</template>

<script setup lang="ts">
// eslint-disable-next-line vue/no-dupe-keys
import {computed, watch} from 'vue'
import {BFormInput} from 'bootstrap-vue-next'
import Slugify from 'slugify'

const props = defineProps({
  ...BFormInput.props,
  modelValue: {
    type: String,
    default: '',
  },
  watch: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const record = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

watch(
  () => props.watch,
  (value) => {
    record.value = formatValue(value)
  },
)

function formatValue(value: string) {
  return Slugify(value, {
    replacement: '-',
    remove: /[^\w\s-]+/g,
    lower: true,
    strict: true,
  })
}
</script>
