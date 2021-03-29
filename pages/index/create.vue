<template>
  <vesp-modal v-model="record" :url="url" :title="record.title" :update-key="updateKey" action-create="post">
    <template #form-fields>
      <b-form-group :label="$t('components.table.columns.title')">
        <b-form-input v-model="record.title" />
      </b-form-group>

      <b-form-group :label="$t('components.table.columns.userId')">
        <b-form-input v-model="record.userId" required />
      </b-form-group>

      <b-form-group :label="$t('components.table.columns.body')">
        <b-form-textarea v-model="record.body" rows="5" required />
      </b-form-group>
    </template>
  </vesp-modal>
</template>

<script>
import {url} from '~/pages/index'
import VespModal from '~/components/modal'

export default {
  name: 'CreatePage',
  components: {VespModal},
  data() {
    return {
      url,
      record: {
        title: '',
      },
      updateKey: 'json-posts',
    }
  },
}
</script>
