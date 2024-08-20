<template>
  <div>
    <BFormGroup :label="$t('components.table.columns.title')">
      <BFormInput v-model="record.title" required />
    </BFormGroup>

    <BFormGroup :label="$t('components.table.columns.userId')">
      <BFormInput v-model="record.userId" required />
    </BFormGroup>

    <BFormGroup :label="$t('components.table.columns.body')">
      <BFormTextarea v-model="record.body" rows="5" required />
    </BFormGroup>

    <BFormGroup label="Uri Alias">
      <VespInputAlias v-model="record.alias" :watch="record.title" />
    </BFormGroup>

    <BFormGroup label="Date Picker">
      <VespInputDatePicker v-model="record.date" type="datetime" />
    </BFormGroup>

    <BFormGroup label="Text Mask">
      <VespInputTextMask v-model="record.phone" required :state="!!(record.phone && record.phone.length === 12)" />
    </BFormGroup>

    <BFormGroup label="Password Input">
      <VespInputPassword v-model="record.password" />
    </BFormGroup>

    <BFormGroup label="Combo Box">
      <VespInputComboBox ref="combo" v-model="record.combo" :url="url" :on-load="onLoad" force-select />
    </BFormGroup>

    <BFormGroup label="Remote Links">
      <VespInputRemoteLinks v-model="record.links" />
    </BFormGroup>
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
