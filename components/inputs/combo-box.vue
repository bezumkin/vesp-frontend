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
        <slot name="append" v-bind="{toggle: toggleDropdown, disabled, readonly, options}">
          <b-button :disabled="!options.length || disabled || readonly" tabindex="-1" @click.prevent="toggleDropdown">
            <fa icon="caret-down" />
          </b-button>
        </slot>
      </template>
    </b-input-group>

    <ul :class="{'vesp-combo-list dropdown-menu': true, show: dropdown}">
      <slot v-if="!options.length" name="no-results" v-bind="{hideDropdown, emptyText}">
        <li class="alert alert-info m-0" @click="hideDropdown" v-text="emptyText" />
      </slot>
      <template v-else>
        <slot name="list-header" v-bind="{hideDropdown}" />
        <b-dropdown-item
          v-for="(item, idx) in options"
          :key="item[valueField]"
          :class="{'vesp-combo-list-item': true}"
          :active="selected === idx"
          @click="(e) => onSelect(idx, e)"
        >
          <slot name="default" v-bind="{item}">
            {{ formatValue(item) }}
          </slot>
        </b-dropdown-item>
        <slot name="list-footer" v-bind="{hideDropdown}" />
      </template>
    </ul>
  </section>
</template>

<script>
import {BFormInput} from 'bootstrap-vue'

export default {
  name: 'VespInputComboBox',
  props: {
    ...BFormInput.extendOptions.props,
    value: {
      type: [String, Number],
      default: '',
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
    forceSelect: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'No results',
    },
    filterProps: {
      type: Object,
      default() {
        return {}
      },
    },
    formatValue: {
      type: Function,
      default(item) {
        return item[this.textField]
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
        // eslint-disable-next-line eqeqeq
        if (this.options.findIndex((item) => item[this.valueField] == this.internalValue) === -1) {
          this.reset()
        }
      }
    },
    internalValue(newValue) {
      this.setValue(newValue)
    },
  },
  created() {
    this.filtersHash = JSON.stringify(this.filterProps)
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
        try {
          const {data: res} = await this.$axios.get(this.url, {params})
          this.options = res.rows
          this.$emit('load', res.rows, res.total)
        } catch (e) {
          this.$emit('failure', e)
        } finally {
          this.loading = false
        }
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
        this.externalValue = this.formatValue(item)
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
      if (value && this.forceSelect && !this.internalValue && this.options.length) {
        this.onSelect(0)
      }
    },
    onSelect(idx, e) {
      if (e) {
        this.$refs.input.$el.focus()
      }
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
      this.$emit('keydown', e)
    },
    async setValue(value) {
      if (!value) {
        this.reset()
      } else {
        // eslint-disable-next-line eqeqeq
        if (this.options.findIndex((item) => item[this.valueField] == value) === -1) {
          const params = {...this.filterProps, combo: true}
          params[this.valueField] = value
          const {data: res} = await this.$axios.get(this.url, {params})
          // eslint-disable-next-line eqeqeq
          if (res[this.valueField] == value) {
            this.options.push(res)
          }
        }
        // eslint-disable-next-line eqeqeq
        const idx = this.options.findIndex((item) => item[this.valueField] == value)
        if (idx !== -1) {
          this.onSelect(idx)
        }
      }
    },
  },
}
</script>
