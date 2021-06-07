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

      <b-form-group>
        <vesp-input-date-picker v-model="record.date" type="datetime" />
      </b-form-group>

      <b-form-group>
        <vesp-input-text-mask v-model="record.phone" required :state="!!(record.phone && record.phone.length === 12)" />
      </b-form-group>

      <b-form-group>
        <vesp-input-color-picker
          v-model="record.color"
          @change="
            (color) => {
              record.color = color
            }
          "
        />
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
import VespModal from '~/components/modal'
import {url} from '~/pages/index'

export default {
  name: 'CreatePage',
  components: {VespInputDatePicker, VespInputTextMask, VespInputColorPicker, VespModal},
  data() {
    return {
      url,
      record: {
        title: '',
        date: ['2020-03-05 12:15:55', '2020-03-08 12:15:55'],
        color: '#007bff',
        // date: '2020-03-05 12:15:55',
      },
      updateKey: 'json-posts',
    }
  },
}
</script>
