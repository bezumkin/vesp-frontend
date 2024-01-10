<template>
  <vesp-modal v-model="record" :url="url" :title="record.title" :update-key="updateKey" action-create="post">
    <template #form-fields>
      <b-form-group :label="$t('components.table.columns.title')">
        <b-form-input v-model="record.title" required />
      </b-form-group>

      <b-form-group :label="$t('components.table.columns.userId')">
        <b-form-input v-model="record.userId" required />
      </b-form-group>

      <b-form-group :label="$t('components.table.columns.body')">
        <b-form-textarea v-model="record.body" rows="5" required />
      </b-form-group>

      <b-form-group label="Date Picker">
        <vesp-input-date-picker v-model="record.date" type="datetime" />
      </b-form-group>

      <b-form-group label="Text Mask">
        <vesp-input-text-mask v-model="record.phone" required :state="!!(record.phone && record.phone.length === 12)" />
      </b-form-group>

      <b-form-group label="Color Picker">
        <vesp-input-color-picker
          v-model="record.color"
          @change="
            (color) => {
              record.color = color
            }
          "
        />
      </b-form-group>

      <b-form-group label="Password Input">
        <vesp-input-password v-model="record.password" />
      </b-form-group>

      <b-form-group label="Combo Box">
        <vesp-input-combo-box ref="combo" v-model="record.combo" :url="url" :on-load="onLoad" />
      </b-form-group>

      <b-form-group :label="$t('components.table.columns.body')">
        <b-form-textarea v-model="record.body" rows="5" required />
      </b-form-group>
    </template>
  </vesp-modal>
</template>

<script>
import VespInputDatePicker from '@/components/inputs/date-picker'
import VespInputTextMask from '@/components/inputs/text-mask'
import VespInputColorPicker from '@/components/inputs/color-picker'
import VespInputPassword from '@/components/inputs/password'
import VespInputComboBox from '@/components/inputs/combo-box'
import VespModal from '~/components/modal'
import {url} from '~/pages/index'

export default {
  name: 'CreatePage',
  components: {
    VespInputPassword,
    VespInputDatePicker,
    VespInputTextMask,
    VespInputColorPicker,
    VespInputComboBox,
    VespModal,
  },
  data() {
    return {
      url,
      record: {
        title: '',
        date: ['2020-03-05 12:15:55', '2020-03-08 12:15:55'],
        color: '#007bff',
        password: 'Test',
        combo: '',
        // date: '2020-03-05 12:15:55',
      },
      updateKey: 'json-posts',
    }
  },
  methods: {
    // Emulate response from Vesp Core
    onLoad(items) {
      const query = this.$refs.combo.externalValue
      if (query) {
        items = items.filter((row) => row.title.includes(query) || row.body.includes(query))
      }
      const limit = this.$refs.combo.limit
      const offset = (this.$refs.combo.page - 1) * limit

      return {
        rows: items.slice(offset, offset + limit),
        total: items.length,
      }
    },
  },
}
</script>
