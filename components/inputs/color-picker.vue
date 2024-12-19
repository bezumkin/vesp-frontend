<template>
  <section class="vesp-color-picker">
    <div ref="picker">
      <slot name="picker">
        <div :style="{height: myHeight, background: myValue}" class="border rounded" style="cursor: pointer" />
      </slot>
    </div>
    <slot name="input" v-bind="{value: myValue, props: inputProps}">
      <b-form-input v-model="myValue" class="mt-1" v-bind="inputProps" />
    </slot>
  </section>
</template>

<script>
export default {
  name: 'VespInputColorPicker',
  props: {
    value: {
      type: String,
      default: '#ffffff',
    },
    alpha: {
      type: Boolean,
      default: false,
    },
    popup: {
      type: [String, Boolean],
      default: 'bottom',
    },
    height: {
      type: [String, Number],
      default: 50,
    },
    editor: {
      type: Boolean,
      default: true,
    },
    editorFormat: {
      type: String,
      default: 'hex',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      picker: null,
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
    myHeight() {
      return (typeof this.height === 'string' ? this.height.replace(/[\D]/g, '') : this.height) + 'px'
    },
    inputProps() {
      return {
        autofocus: this.autofocus,
        placeholder: this.placeholder,
        required: this.required,
        readonly: this.readonly,
        disabled: this.disabled,
      }
    },
  },
  mounted() {
    this.initPicker()
  },
  methods: {
    initPicker() {
      try {
        const Picker = require('vanilla-picker').default
        this.picker = new Picker(this.$refs.picker)
        this.picker.setOptions({
          popup: this.popup,
          alpha: this.alpha,
          editor: this.editor,
          editorFormat: this.editorFormat,
          color: this.myValue,
          onChange: this.onChange,
          onDone: this.onDone,
          onOpen: this.onOpen,
        })
      } catch (e) {
        console.error(e)
      }
    },
    onChange(color) {
      this.$emit('change', this.alpha ? color.hex : color.hex.slice(0, -2))
    },
    onDone(color) {
      this.myValue = this.alpha ? color.hex : color.hex.slice(0, -2)
    },
    onOpen() {
      try {
        this.picker.setOptions({color: this.myValue})
      } catch (e) {
        console.error(e)
      }

      const inputs = this.$refs.picker.getElementsByTagName('input')
      if (inputs.length) {
        inputs[0].classList.add('form-control')
      }
      const buttons = this.$refs.picker.getElementsByTagName('button')
      if (buttons.length) {
        buttons[0].classList.add('btn')
      }
    },
  },
}
</script>
