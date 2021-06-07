<template>
  <section class="vesp-combo">
    <b-input-group>
      <b-form-input
        ref="input"
        v-model="externalValue"
        v-bind="inputProps"
        autocomplete="off"
        @input="onInput"
        @change="onChange"
        @keydown="onKeydown"
      />
      <template #append>
        <b-button :disabled="!options.length || disabled || readonly" @click.prevent="toggleDropdown">
          <fa icon="caret-down" />
        </b-button>
      </template>
    </b-input-group>

    <ul :class="{'vesp-combo-list': true, show: dropdown}">
      <li v-if="!options.length" class="alert alert-info m-0" @click="hideDropdown" v-text="emptyText" />
      <li
        v-for="(item, idx) in options"
        v-else
        :key="item[valueField]"
        :class="{'vesp-combo-list-item': true, selected: selected === idx}"
        @click="onSelect(idx)"
        v-text="item[textField]"
      />
    </ul>
  </section>
</template>

<script>
export default {
  name: 'VespInputComboBox',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    inputmode: {
      type: String,
      default: 'text',
    },
    url: {
      type: String,
      default: '',
    },
    valueField: {
      type: String,
      default: 'id',
    },
    textField: {
      type: String,
      default: 'title',
    },
    limit: {
      type: [Number, String],
      default: 10,
    },
    sort: {
      type: String,
      default: null,
    },
    dir: {
      type: String,
      default: 'asc',
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    forceSelect: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'No results',
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
    filterProps: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      options: [],
      externalValue: '',
      selected: null,
      dropdown: false,
      filtersHash: null,
      loading: false,
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value || ''
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
    inputProps() {
      return {
        type: this.type,
        inputmode: this.inputmode,
        autofocus: this.autofocus,
        placeholder: this.placeholder,
        required: this.required,
        readonly: this.readonly,
        disabled: this.disabled,
      }
    },
  },
  watch: {
    async filterProps(value) {
      const hash = JSON.stringify(value)
      if (hash === this.filtersHash) {
        return
      }
      this.filtersHash = hash

      await this.fetch('')
      if (this.internalValue) {
        if (this.options.findIndex((item) => item[this.valueField] === this.internalValue) === -1) {
          this.reset()
        }
      }
    },
    internalValue(newValue) {
      this.setValue(newValue)
    },
  },
  async mounted() {
    if (!this.lazy) {
      await this.fetch()
    }
    if (this.internalValue) {
      this.setValue(this.internalValue)
    }
  },
  methods: {
    async fetch(query = this.externalValue) {
      if (this.url && !this.loading) {
        const params = {
          ...this.filterProps,
          ...{
            query,
            limit: this.limit,
            sort: this.sort || this.textField,
            dir: this.dir,
            combo: true,
          },
        }
        this.loading = true
        const {data: res} = await this.$axios.get(this.url, {params})
        this.options = res.rows
        this.loading = false
      }
    },
    reset() {
      this.internalValue = ''
      this.externalValue = ''
    },
    select(idx) {
      const item = this.options[idx]
      if (item) {
        this.internalValue = item[this.valueField]
        this.externalValue = item[this.textField]
        return item
      }
    },
    toggleDropdown(e) {
      e.stopPropagation()
      if (this.isDropdownVisible()) {
        this.hideDropdown()
      } else {
        this.showDropdown()
      }
    },
    showDropdown() {
      this.dropdown = true
      document.addEventListener('click', this.hideDropdown, {once: true})
    },
    hideDropdown() {
      this.dropdown = false
      this.selected = null
    },
    isDropdownVisible() {
      return this.dropdown
    },
    async onInput(value) {
      if (!value.length) {
        this.reset()
        if (!this.lazy) {
          await this.fetch()
        }
      } else {
        this.internalValue = ''
        await this.fetch()
        this.showDropdown()
      }
    },
    onChange(value) {
      this.$emit('change', value)
      if (value && !this.internalValue && this.options.length) {
        this.onSelect(0)
      }
    },
    onSelect(idx) {
      const item = this.select(idx)
      if (item) {
        this.$emit('select', item)
      }
    },
    onReset() {
      this.$emit('reset')
      this.reset()
      this.hideDropdown()
      if (!this.lazy) {
        this.fetch()
      } else {
        this.options = []
      }
    },
    onKeydown(e) {
      this.$emit('keydown', e)
      if (e.key === 'ArrowDown' && !this.isDropdownVisible() && this.options.length) {
        this.showDropdown()
      }
      if (e.key === 'ArrowDown' && (this.selected === null || this.selected < this.options.length - 1)) {
        this.selected = this.selected === null ? 0 : this.selected + 1
      } else if (this.selected !== null) {
        if (e.key === 'ArrowUp') {
          this.selected = this.selected === 0 ? null : this.selected - 1
        }
      }
      if (e.key === 'Enter') {
        if (this.isDropdownVisible()) {
          e.stopPropagation()
          e.preventDefault()
        }
        if (this.selected !== null) {
          this.onSelect(this.selected)
          this.hideDropdown()
        }
      }
      if (e.key === 'Escape' && this.isDropdownVisible()) {
        e.stopPropagation()
        e.preventDefault()
        this.hideDropdown()
      }
    },
    async setValue(value) {
      if (!value) {
        this.reset()
      } else {
        if (this.options.findIndex((item) => item[this.valueField] === value) === -1) {
          const params = {combo: true}
          params[this.valueField] = value
          const {data: res} = await this.$axios.get(this.url, {params})
          if (res[this.valueField] === value) {
            this.options.push(res)
          }
        }
        const idx = this.options.findIndex((item) => item[this.valueField] === value)
        if (idx !== -1) {
          this.select(idx)
        }
      }
    },
  },
}
</script>
