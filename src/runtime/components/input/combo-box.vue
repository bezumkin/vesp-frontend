<template>
  <div class="vesp-combo">
    <BInputGroup>
      <BFormInput
        ref="input"
        v-model="externalValue"
        v-bind="inputProps"
        autocomplete="off"
        @change="onChange"
        @keydown="onKeydown"
        @update:model-value="onInput"
      />
      <template #append>
        <slot name="append" v-bind="{toggle: toggleDropdown, disabled, readonly, options}">
          <BButton :disabled="!options.length || disabled || readonly" tabindex="-1" @click.prevent="toggleDropdown">
            <VespFa icon="caret-down" fixed-width />
          </BButton>
        </slot>
      </template>
    </BInputGroup>

    <ul :class="{'dropdown-menu vesp-combo-list': true, 'show': dropdown}">
      <slot v-if="!options.length" name="no-results" v-bind="{hideDropdown, emptyText}">
        <li class="alert alert-info m-0" @click="hideDropdown" v-text="emptyText" />
      </slot>
      <template v-else>
        <slot name="list-header" v-bind="{hideDropdown, total}" />
        <BDropdownItem
          v-for="(item, idx) in options"
          :key="item[valueField]"
          :class="{'vesp-combo-list-item': true}"
          :active="selected === idx"
          @click="(e: Event) => onSelect(idx, e)"
        >
          <slot name="default" v-bind="{item}">
            {{ prepareValue(item) }}
          </slot>
        </BDropdownItem>
        <slot name="list-footer" v-bind="{hideDropdown, total}">
          <BContainer v-if="total > options.length" class="my-2" @click="(e: Event) => e.stopPropagation()">
            <BPagination v-model="page" :per-page="limit" :limit="maxPages" :total-rows="total" />
          </BContainer>
        </slot>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch, onMounted, type Ref} from 'vue'
import {BFormInput} from 'bootstrap-vue-next'
import {useGet} from '../../utils/use-api'

const emit = defineEmits(['update:modelValue', 'load', 'failure', 'change', 'select', 'reset', 'keydown'])
const props = defineProps({
  ...BFormInput.props,
  modelValue: {
    type: [String, Number],
    default: '',
  },
  url: {
    type: String,
    required: true,
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
    type: Number,
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
    default: undefined,
  },
  maxPages: {
    type: Number,
    default: 5,
  },
  onLoad: {
    type: Function,
    default(items: any) {
      return items
    },
  },
})

const input = ref()
const options: Ref<Record<string, any>[]> = ref([])
const externalValue = ref('')
const selected: Ref<number | null> = ref(null)
const dropdown = ref(false)
const filtersHash = ref('')
const loading = ref(false)
const page = ref(props.page || 1)
const total = ref(0)
const skipWatchers = ref(false)

const internalValue = computed({
  get() {
    return props.modelValue || null
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

const inputProps = computed(() => {
  return {
    type: props.type,
    autofocus: props.autofocus,
    placeholder: props.placeholder,
    required: props.required,
    readonly: props.readonly,
    disabled: props.disabled,
  }
})

watch(
  () => props.filterProps,
  async (newValue) => {
    const hash = JSON.stringify(newValue)
    if (hash === filtersHash.value) {
      return
    }
    filtersHash.value = hash

    if (!props.lazy) {
      await fetch('')
      if (internalValue.value) {
        if (options.value.findIndex((item: any) => item[props.valueField] == internalValue.value) === -1) {
          reset()
        }
      }
    }
  },
)

watch(
  () => props.lazy,
  (newValue) => {
    if (newValue) {
      init()
    }
  },
)

watch(internalValue, (newValue) => {
  if (!props.skipWatchers) {
    setValue(newValue)
  }
})

onMounted(() => {
  filtersHash.value = JSON.stringify(props.filterProps)
  init()
})

async function init() {
  if (props.lazy) {
    return
  }
  await fetch()
  if (internalValue.value) {
    await setValue(internalValue.value)
  }
}

async function fetch(query = externalValue.value) {
  if (props.url && !loading.value) {
    const params = {
      ...props.filterProps,
      query,
      limit: props.limit,
      sort: props.sort || props.textField,
      dir: props.dir,
      page: page.value,
      combo: true,
    }
    loading.value = true
    try {
      const items = props.onLoad(await useGet(props.url, params))
      options.value = items.rows || []
      total.value = items.total || 0
      emit('load', options.value, total.value)
    } catch (e) {
      emit('failure', e)
    } finally {
      loading.value = false
    }
  }
}

function reset() {
  page.value = 1
  internalValue.value = null
  externalValue.value = ''
}

function select(idx: number) {
  page.value = 1
  const item = options.value[idx]
  if (item) {
    internalValue.value = item[props.valueField]
    externalValue.value = prepareValue(item)
    return item
  }
}

function toggleDropdown(e: Event) {
  e.stopPropagation()
  if (isDropdownVisible()) {
    hideDropdown()
  } else {
    showDropdown()
  }
}

function showDropdown() {
  dropdown.value = true
  document.addEventListener('click', hideDropdown, {once: true})
}

function hideDropdown() {
  dropdown.value = false
  selected.value = null
}

function isDropdownVisible() {
  return dropdown.value
}

async function onInput(value: string) {
  if (!value.length) {
    reset()
    if (!props.lazy) {
      await fetch()
    }
  } else {
    skipWatchers.value = true
    internalValue.value = null
    await fetch()
    showDropdown()
    skipWatchers.value = false
  }
}

function onChange(e: InputEvent) {
  const input = e.target as HTMLInputElement
  emit('change', input.value)
  if (input.value && props.forceSelect && !internalValue.value && options.value.length) {
    onSelect(0)
  }
}

function onSelect(idx: number, e?: Event) {
  if (e) {
    input.value.$el.focus()
  }
  const item = select(idx)
  if (item && item[props.valueField] !== internalValue.value) {
    emit('select', item)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' && !isDropdownVisible() && options.value.length) {
    showDropdown()
  }
  if (e.key === 'ArrowDown' && (selected.value === null || selected.value < options.value.length - 1)) {
    selected.value = selected.value === null ? 0 : selected.value + 1
  } else if (selected.value !== null) {
    if (e.key === 'ArrowUp') {
      selected.value = selected.value === 0 ? null : selected.value - 1
    }
  }
  if (e.key === 'Enter') {
    if (isDropdownVisible()) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (selected.value !== null) {
      onSelect(selected.value)
      hideDropdown()
    }
  }
  if (e.key === 'Escape' && isDropdownVisible()) {
    e.stopPropagation()
    e.preventDefault()
    hideDropdown()
  }
  emit('keydown', e)
}

async function setValue(value: string | number) {
  if (!value) {
    reset()
  } else {
    if (options.value.findIndex((item: any) => item[props.valueField] == value) === -1) {
      const params = {...props.filterProps, combo: true}
      params[props.valueField] = value
      const data = await useGet(props.url, params)

      if (data[props.valueField] == value) {
        options.value.push(data)
      }
    }

    const idx = options.value.findIndex((item: any) => item[props.valueField] == value)
    if (idx !== -1) {
      onSelect(idx)
    }
  }
}

function prepareValue(item: Record<string, any>) {
  return props.formatValue ? props.formatValue(item) : item[props.textField]
}

watch(page, () => {
  fetch(internalValue.value ? '' : externalValue.value)
})

defineExpose({total, page, limit: props.limit, options, externalValue})
</script>
