<template>
  <BRow>
    <BCol cols="12" md="auto" class="d-flex justify-content-center">
      <slot name="default" v-bind="{refresh, total, page, limit, loading, pageLimit}">
        <BPagination
          v-if="total > limit"
          v-model="page"
          :total-rows="total"
          :per-page="limit"
          :limit="pageLimit"
          class="mb-md-0 me-md-3"
        />
      </slot>
    </BCol>
    <BCol cols="12" md="auto" class="d-flex align-items-center justify-content-center gap-2">
      <slot name="total" v-bind="{refresh, total, page, limit, loading, pageLimit}">
        <BButton class="border-0" @click="refresh">
          <BSpinner v-if="loading" :small="true" />
          <VespFa v-else icon="repeat" fixed-width />
        </BButton>
        {{ formatTotal(total) }}
      </slot>
    </BCol>
  </BRow>
</template>

<script setup lang="ts">
import {computed, type PropType} from 'vue'
import {useI18n} from 'vue-i18n'
import type {VespTable} from '#components'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  table: {
    type: Object as PropType<typeof VespTable>,
    default: undefined,
  },
  total: {
    type: Number,
    default: undefined,
  },
  limit: {
    type: Number,
    default: undefined,
  },
  pageLimit: {
    type: Number,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: undefined,
  },
  formatTotal: {
    type: Function,
    default: (total: number) => {
      return useI18n().t('components.table.records', {total: String(total).replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}, total)
    },
  },
})

const total = computed(() => props.total ?? props.table?.total ?? 0)
const limit = computed(() => props.limit ?? props.table?.limit ?? 100)
const pageLimit = computed(() => props.pageLimit ?? props.table?.pageLimit ?? 7)
const loading = computed(() => props.loading ?? props.table?.loading)

const emit = defineEmits(['update:modelValue', 'refresh'])

const page = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

function refresh() {
  emit('refresh')
  props.table?.refresh()
}
</script>
