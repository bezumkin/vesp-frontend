<template>
  <VespModal v-model="record" :url="url" method="patch" update-key="posts">
    <template #form-fields>
      <FormsItem v-model="record" />
    </template>
  </VespModal>
</template>

<script setup lang="ts">
import {useGet} from '../../../../src/runtime/utils/use-api'

const record = ref()

const url = 'posts/' + useRoute().params.id
try {
  record.value = await useGet(url)
} catch (e: any) {
  showError({statusCode: e.statusCode, statusMessage: e.message})
}
</script>
