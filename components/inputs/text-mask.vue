<template>
  <div>
    <b-form-input
      ref="input"
      v-model="internalValue"
      v-bind="{readonly, disabled, required, autofocus, inputmode, type, state}"
      :placeholder="internalPlaceholder"
      @input="onInput"
    />
  </div>
</template>
<script>
import {createTextMaskInputElement} from 'text-mask-core'

export default {
  name: 'VespInputTextMask',
  props: {
    value: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Boolean,
      default: null,
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
    formatValue: {
      type: Function,
      default(value) {
        return value.replaceAll(/[^0-9+]/g, '')
      },
    },
  },
  data() {
    return {
      type: 'text',
      inputmode: 'numeric',
      internalValue: this.value,
    }
  },
  computed: {
    externalValue: {
      get() {
        return this.formatValue(this.internalValue)
      },
      async set(newValue) {
        this.internalValue = newValue
        await this.update()
        this.$emit('input', this.formatValue(this.internalValue))
      },
    },
    maskArray() {
      return Array.isArray(this.mask)
        ? this.mask
        : [...this.mask].map((char) => {
            return new RegExp(this.placeholderChar).test(char) ? /\d/ : char
          })
    },
    maskPlaceholder() {
      return this.maskArray
        .map((char) => {
          return char instanceof RegExp ? this.placeholderChar : char
        })
        .join('')
    },
    internalPlaceholder() {
      return this.placeholder || this.maskPlaceholder
    },
    textMaskConfig() {
      return {
        inputElement: this.$refs.input.$el,
        mask: this.maskArray,
        guide: this.guide,
        placeholderChar: this.placeholderChar,
      }
    },
  },
  watch: {
    async mask() {
      this.internalValue = ''
      this.externalValue = ''
      await this.update()
      this.$refs.input.focus()
    },
  },
  async mounted() {
    this.textMask = createTextMaskInputElement(this.textMaskConfig)
    await this.update()
  },
  methods: {
    onInput(newValue) {
      this.externalValue = newValue
    },
    async update() {
      await this.$nextTick(() => {
        this.textMask.update(this.internalValue, this.textMaskConfig)
        this.internalValue = this.textMask.state.previousConformedValue
      })
    },
  },
}
</script>
