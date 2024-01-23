<template>
  <div class="vesp-input-password">
    <b-form-input v-model="record" v-bind="props" :type="passwordVisible ? 'text' : 'password'" />
    <slot name="button" v-bind="{disabled, togglePassword, passwordVisible}">
      <b-button variant="link" :disabled="disabled" tabindex="-1" @click="togglePassword">
        <slot name="icon" v-bind="{disabled, togglePassword, passwordVisible}">
          <vesp-fa v-if="passwordVisible" key="slash" icon="eye-slash" fixed-width />
          <vesp-fa v-else key="eye" icon="eye" fixed-width />
        </slot>
      </b-button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {BFormInput} from 'bootstrap-vue-next'

const props = defineProps({
  ...BFormInput.props,
  modelValue: {
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

const disabled = computed(() => props.disabled || props.readonly)
const passwordVisible = ref(false)

function togglePassword() {
  if (!disabled.value) {
    passwordVisible.value = !passwordVisible.value
  }
}
</script>
