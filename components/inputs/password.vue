<template>
  <div class="vesp-input-password">
    <b-form-input v-model="myValue" v-bind="$props" :type="passwordVisible ? 'text' : 'password'" v-on="$listeners" />
    <slot name="button" v-bind="{disabled: isDisabled, togglePassword}">
      <b-button variant="default" :disabled="isDisabled" tabindex="-1" @click="togglePassword">
        <slot name="icon">
          <fa icon="eye" />
        </slot>
      </b-button>
    </slot>
  </div>
</template>

<script>
import {BFormInput} from 'bootstrap-vue'

export default {
  name: 'VespInputPassword',
  props: {...BFormInput.extendOptions.props},
  data() {
    return {
      passwordVisible: false,
    }
  },
  computed: {
    myValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
    isDisabled() {
      return this.disabled || this.readonly
    },
  },
  methods: {
    togglePassword() {
      if (!this.isDisabled) {
        this.passwordVisible = !this.passwordVisible
      }
    },
  },
}
</script>
