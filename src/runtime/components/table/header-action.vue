<template>
  <BButton
    v-if="typeof action.isActive !== 'function' || action.isActive()"
    :size="action.size || 'md'"
    :variant="action.variant || 'secondary'"
    :to="action.route"
    :disabled="typeof action.isDisabled === 'function' && action.isDisabled()"
    @click="action.function"
  >
    <template #default>
      <VespFa v-if="action.icon" :icon="action.icon" fixed-width /> {{ action.title }}
    </template>
  </BButton>
</template>

<script setup lang="ts">
import type {PropType} from 'vue'
import type {VespTableAction} from '../../../module'

defineProps({
  action: {
    type: Object as PropType<VespTableAction>,
    required: true,
  },
})
</script>
