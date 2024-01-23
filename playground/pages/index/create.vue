<template>
  <vesp-modal v-model="record" :url="url" :title="record.title">
    <template #form-fields>
      <forms-item v-model="record" />
    </template>
  </vesp-modal>
</template>

<script setup lang="ts">
const url = 'posts'
const record = ref({
  title: '',
  date: ['2020-03-05 12:15:55', '2020-03-08 12:15:55'],
  color: '#007bff',
  password: 'Test',
  combo: '',
  // date: '2020-03-05 12:15:55',
})
</script>
