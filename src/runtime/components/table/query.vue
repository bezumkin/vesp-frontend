<template>
  <BInputGroup>
    <BFormInput v-model="query" :placeholder="placeholder" />
    <template #append>
      <BButton :disabled="!query" @click="onReset">
        <VespFa :icon="icon" fixed-width />
      </BButton>
    </template>
  </BInputGroup>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'times',
  },
  placeholder: {
    type: String,
    default: () => {
      return useI18n().t('components.table.query')
    },
  },
})
const emit = defineEmits(['update:modelValue'])

const query = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

function onReset() {
  query.value = ''
}
</script>
