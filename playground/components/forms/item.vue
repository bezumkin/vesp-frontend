<template>
  <div>
    <b-form-group :label="$t('components.table.columns.title')">
      <b-form-input v-model="record.title" required />
    </b-form-group>

    <b-form-group :label="$t('components.table.columns.userId')">
      <b-form-input v-model="record.userId" required />
    </b-form-group>

    <b-form-group :label="$t('components.table.columns.body')">
      <b-form-textarea v-model="record.body" rows="5" required />
    </b-form-group>

    <b-form-group label="Uri Alias">
      <vesp-input-alias v-model="record.alias" :watch="record.title" />
    </b-form-group>

    <b-form-group label="Date Picker">
      <vesp-input-date-picker v-model="record.date" type="datetime" />
    </b-form-group>

    <b-form-group label="Text Mask">
      <vesp-input-text-mask v-model="record.phone" required :state="!!(record.phone && record.phone.length === 12)" />
    </b-form-group>
    {{ record.phone }}

    <b-form-group label="Password Input">
      <vesp-input-password v-model="record.password" />
    </b-form-group>

    <b-form-group label="Combo Box">
      <vesp-input-combo-box ref="combo" v-model="record.combo" :url="url" :on-load="onLoad" />
    </b-form-group>

    <b-form-group label="Remote Links">
      <vesp-input-remote-links v-model="record.links" />
    </b-form-group>
  </div>
</template>

<script setup lang="ts">
const url = 'posts'
const combo = ref()

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
const record = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

function onLoad(items: Record<string, any>) {
  const query = combo.value.externalValue
  if (query) {
    items = items.filter((row: any) => row.title.includes(query))
  }
  const limit = combo.value.limit
  const offset = (combo.value.page - 1) * limit

  return {
    rows: items.slice(offset, offset + limit),
    total: items.length,
  }
}
</script>
