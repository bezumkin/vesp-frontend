<template>
  <section class="vesp-date-picker">
    <b-form-input
      v-if="readonly || disabled"
      :value="Array.isArray(myValue) ? myValue.join(rangeSeparator) : myValue"
      :readonly="readonly"
      :disabled="disabled"
    />
    <vue2-datepicker
      v-else
      ref="datepicker"
      v-model="myValue"
      :range-separator="rangeSeparator"
      :input-class="inputClass"
      :confirm="type !== 'date'"
      :type="type"
      :range="range"
      :formatter="formatter"
      :lang="lang"
      :placeholder="placeholder"
      :title-format="titleFormat"
      :time-title-format="timeTitleFormat"
      :time-picker-options="timePickerOptions"
      :value-type="type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
      :input-attr="{required: required, autofocus: autofocus}"
      :disabled-date="disabledDate"
      :disabled-time="disabledTime"
      :minute-step="minuteStep"
      :show-second="showSecond"
      :editable="true"
      :append-to-body="false"
      @clear="onDateClear"
    >
      <template slot="icon-calendar">
        <b-btn v-show="!myValue || !myValue.length" variant="secondary" :disabled="disabled">
          <fa icon="calendar-alt" class="fa-fw" />
        </b-btn>
      </template>
      <template slot="icon-clear">
        <b-btn v-show="myValue" variant="secondary" :disabled="disabled">
          <fa icon="times" class="fa-fw" />
        </b-btn>
      </template>
      <template v-for="(_, slotName) in $scopedSlots" :slot="slotName" slot-scope="slotData">
        <slot :name="slotName" v-bind="slotData" />
      </template>
    </vue2-datepicker>
  </section>
</template>

<script>
import VueDatePicker from 'vue2-datepicker'

export default {
  name: 'VespInputDatePicker',
  components: {'vue2-datepicker': VueDatePicker},
  props: {
    value: {
      type: [String, Array],
      default: null,
    },
    width: {
      type: String,
      default: 'auto',
    },
    range: {
      type: Boolean,
      default() {
        return Array.isArray(this.value)
      },
    },
    type: {
      type: String,
      default: 'date',
    },
    internalFormat: {
      type: String,
      default() {
        return this.type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
      },
    },
    externalFormat: {
      type: String,
      default() {
        return this.type === 'datetime' ? 'dd.MM.yyyy HH:mm:ss' : 'dd.MM.yyyy'
      },
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
      default() {
        return this.$t(`components.datePicker.placeholder_${this.range ? 'range' : 'date'}`)
      },
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
    showSecond: {
      type: Boolean,
      default: true,
    },
    minuteStep: {
      type: Number,
      default: 1,
    },
    firstDayOfWeek: {
      type: [String, Number],
      default: 1,
    },
    titleFormat: {
      type: String,
      default() {
        return this.externalFormat.replace('yyyy', 'YYYY').replace('dd', 'DD')
      },
    },
    timeTitleFormat: {
      type: String,
      default() {
        return this.externalFormat.replace('yyyy', 'YYYY').replace('dd', 'DD')
      },
    },
    timePickerOptions: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      formatter: {
        stringify: (value) => {
          return value ? this.$dateFns.format(value, this.externalFormat) : null
        },
        parse: (date) => {
          return date ? this.$dateFns.parse(date, this.externalFormat, new Date()) : null
        },
      },
    }
  },
  computed: {
    myValue: {
      get() {
        let myValue
        if (this.range) {
          myValue = []
          if (this.value) {
            if (Array.isArray(this.value)) {
              this.value.forEach((v) => {
                myValue.push(this.formatValue(v))
              })
            } else {
              myValue.push(this.formatValue(this.value))
            }
          }
        } else {
          myValue = this.formatValue(this.value)
        }

        return myValue
      },
      set(newValue) {
        if (newValue && this.range) {
          const myValue = []
          newValue.forEach((v) => {
            myValue.push(this.formatValue(v, true))
          })
          this.$emit('input', myValue)
        } else {
          this.$emit('input', this.formatValue(newValue, true))
        }
        if (this.type === 'date') {
          this.$refs.datepicker.closePopup()
        }
      },
    },
    lang() {
      return {
        formatLocale: {
          ...this.$i18n.messages[this.$i18n.locale].components.datePicker,
          ...{firstDayOfWeek: this.firstDayOfWeek},
        },
      }
    },
  },
  methods: {
    onDateClear() {
      this.myValue = null
    },
    formatValue(value, toInternal = false) {
      if (!value || value.includes('0000-00-00')) {
        return null
      }
      if (this.type === 'date') {
        value = value.split(' ')[0]
      }
      try {
        return toInternal
          ? this.$dateFns.format(this.$dateFns.parse(value, this.externalFormat, new Date()), this.internalFormat)
          : this.$dateFns.format(new Date(value), this.externalFormat)
      } catch (e) {
        console.error(value, toInternal, e)
      }
    },
  },
}
</script>
