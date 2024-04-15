<template>
  <div class="vesp-input-mask">
    <BFormInput
      ref="input"
      :model-value="internalValue"
      v-bind="props"
      :placeholder="internalPlaceholder"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch, onMounted, nextTick} from 'vue'
import {BFormInput} from 'bootstrap-vue-next'
import {createTextMaskInputElement} from 'text-mask-core'

const props = defineProps({
  ...BFormInput.props,
  modelValue: {
    type: String,
    default: '',
  },
  mask: {
    type: [String, Array],
    default: '+41 __ ___ __ __',
  },
  guide: {
    type: Boolean,
    default: true,
  },
  placeholderChar: {
    type: String,
    default: '_',
  },
  placeholder: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: '',
  },
  formatValue: {
    type: Function,
    default(value: string) {
      return value.replaceAll(/[^0-9+]/g, '')
    },
  },
  inputMode: {
    type: String,
    default: 'numeric',
  },
})
const emit = defineEmits(['update:modelValue'])

const input = ref()
const textMask = ref()
const internalValue = ref(props.modelValue)

const externalValue = computed({
  get() {
    return props.formatValue(internalValue.value)
  },
  async set(newValue) {
    await update(newValue)
    emit('update:modelValue', props.formatValue(internalValue.value))
  },
})

const maskArray = computed(() => {
  return Array.isArray(props.mask)
    ? props.mask
    : [...props.mask].map((char) => {
        return new RegExp(props.placeholderChar).test(char) ? /\d/ : char
      })
})

const maskPlaceholder = computed(() => {
  return maskArray.value
    .map((char: any) => {
      return char instanceof RegExp ? props.placeholderChar : char
    })
    .join('')
})

const internalPlaceholder = computed(() => {
  return props.placeholder || maskPlaceholder.value
})

const textMaskConfig = computed(() => {
  return {
    inputElement: input.value.$el,
    mask: maskArray.value,
    guide: props.guide,
    placeholderChar: props.placeholderChar,
  }
})

function onInput(newValue: string) {
  externalValue.value = newValue
}

async function update(value: string) {
  await nextTick(() => {
    textMask.value.update(value, textMaskConfig.value)
    internalValue.value = textMask.value.state.previousConformedValue
  })
}

watch(
  () => props.mask,
  () => {
    internalValue.value = ''
    externalValue.value = ''
    update('')
  },
)

watch(
  () => props.modelValue,
  (newValue: string, oldValue: string) => {
    if (newValue !== oldValue) {
      update(newValue)
    }
  },
)

onMounted(async () => {
  textMask.value = await createTextMaskInputElement(textMaskConfig.value)
  await update(props.modelValue)
})
</script>
