<template>
  <div class="vesp-date-picker">
    <BFormInput
      v-if="readonly || disabled"
      :model-value="Array.isArray(myValue) ? myValue.join(rangeSeparator) : myValue"
      :readonly="readonly"
      :disabled="disabled"
    />
    <ClientOnly v-else>
      <VueDatePicker
        ref="datepicker"
        v-model:value="myValue"
        :range-separator="rangeSeparator"
        :input-class="inputClass"
        :confirm="type !== 'date'"
        :type="type"
        :range="range"
        :formatter="formatter"
        :lang="lang"
        :placeholder="placeholder || $t(`components.datePicker.placeholder_${range ? 'range' : 'date'}`)"
        :title-format="fnTitleFormat"
        :time-title-format="fnTimeTitleFormat"
        :time-picker-options="timePickerOptions"
        :value-type="type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
        :input-attr="{required, autofocus}"
        :disabled-date="disabledDate"
        :disabled-time="disabledTime"
        :editable="true"
        :append-to-body="false"
        @clear="onDateClear"
      >
        <template #icon-calendar>
          <BButton v-show="!myValue || !myValue.length" variant="secondary" :disabled="disabled">
            <VespFa icon="calendar-alt" fixed-width />
          </BButton>
        </template>
        <template #icon-clear>
          <BButton v-show="myValue" variant="secondary" :disabled="disabled">
            <VespFa icon="times" fixed-width />
          </BButton>
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotData">
          <slot :name="slotName" v-bind="slotData" />
        </template>
      </VueDatePicker>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {format, parse} from 'date-fns'
import {useI18n} from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: null,
  },
  width: {
    type: String,
    default: 'auto',
  },
  range: {
    type: Boolean,
    default: undefined,
  },
  type: {
    type: String,
    default: 'date',
  },
  internalFormat: {
    type: String,
    default: '',
  },
  externalFormat: {
    type: String,
    default: '',
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
  readonly: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  inputClass: {
    type: [String, Object],
    default: 'form-control',
  },
  disabledDate: {
    type: Function,
    default() {
      return false
    },
  },
  rangeSeparator: {
    type: String,
    default: ' ~ ',
  },
  disabledTime: {
    type: Function,
    default() {
      return false
    },
  },
  firstDayOfWeek: {
    type: [String, Number],
    default: 1,
  },
  titleFormat: {
    type: Function,
    default() {
      return ''
    },
  },
  timeTitleFormat: {
    type: Function,
    default() {
      return ''
    },
  },
  timePickerOptions: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const range = ref(props.range === undefined ? Array.isArray(props.modelValue) : props.range)
const datepicker = ref()
const internalFormat = computed(() => {
  return props.internalFormat || (props.type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd')
})
const externalFormat = computed(() => {
  return props.externalFormat || (props.type === 'datetime' ? 'dd.MM.yyyy HH:mm:ss' : 'dd.MM.yyyy')
})
const formatter = {
  stringify: (value?: Date) => {
    return value ? format(value, externalFormat.value) : null
  },
  parse: (date?: string) => {
    return date ? parse(date, externalFormat.value, new Date()) : null
  },
}
const myValue = computed({
  get() {
    let myValue
    if (range.value) {
      myValue = []
      if (props.modelValue) {
        if (Array.isArray(props.modelValue)) {
          props.modelValue.forEach((v) => {
            myValue.push(formatValue(v))
          })
        } else {
          myValue.push(formatValue(props.modelValue))
        }
      }
    } else {
      myValue = formatValue(props.modelValue)
    }

    return myValue
  },
  set(newValue) {
    if (newValue && Array.isArray(newValue)) {
      const value: string[] = []
      newValue.forEach((v) => {
        value.push(formatValue(v, true) || '')
      })
      emit('update:modelValue', value)
    } else {
      emit('update:modelValue', formatValue(newValue, true))
    }
    if (props.type === 'date') {
      datepicker.value?.closePopup()
    }
  },
})

const {messages, locale} = useI18n()
const lang = computed(() => {
  return {
    formatLocale: {
      // @ts-ignore
      ...messages.value[locale.value].components.datePicker,
      ...{firstDayOfWeek: props.firstDayOfWeek},
    },
  }
})

function onDateClear() {
  myValue.value = ''
}

function formatValue(value: any, toInternal = false) {
  if (!value || value.includes('0000-00-00')) {
    return ''
  }

  if (props.type === 'date') {
    value = value.split(' ')[0]
  }
  try {
    return toInternal
      ? format(parse(value, externalFormat.value, new Date()), internalFormat.value)
      : format(new Date(value), externalFormat.value)
  } catch (e) {
    console.error(value, toInternal, e)
  }
}

const fnTitleFormat = computed(() => {
  return props.titleFormat ? props.titleFormat() : externalFormat.value.replace('yyyy', 'YYYY').replace('dd', 'DD')
})

const fnTimeTitleFormat = computed(() => {
  return props.timeTitleFormat
    ? props.timeTitleFormat()
    : externalFormat.value.replace('yyyy', 'YYYY').replace('dd', 'DD')
})
</script>
