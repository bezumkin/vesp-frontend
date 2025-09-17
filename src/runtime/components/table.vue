<template>
  <section class="vesp-table">
    <slot name="header">
      <BRow class="align-items-center mb-3">
        <BCol md="4">
          <slot name="header-start">
            <VespTableHeaderAction
              v-for="(action, idx) in headerActions"
              :key="idx"
              :action="action"
              :class="action.class || (!idx ? 'col-12 col-md-auto' : 'col-12 col-md-auto ms-md-2 mt-2 mt-md-0')"
            />
          </slot>
        </BCol>

        <BCol md="4">
          <slot name="header-middle" />
        </BCol>

        <BCol md="4" class="mt-2 mt-md-0">
          <slot name="header-end">
            <VespTableQuery v-if="hasQuery" v-model="tFilters.query" />
          </slot>
        </BCol>
      </BRow>
    </slot>

    <slot name="subheader" />

    <BOverlay :show="loading" opacity="0.25">
      <BTable ref="table" v-bind="tableProps">
        <template #cell(actions)="{item}">
          <VespTableRowAction v-for="(action, idx) in tableActions" :key="idx" :action="action" :item="item" />
        </template>

        <template v-for="slotName in Object.keys($slots)" #[slotName]="slotProps">
          <slot v-if="slotName !== 'default'" :name="slotName" v-bind="slotProps" />
        </template>
      </BTable>
    </BOverlay>
    <slot name="footer" v-bind="{refresh, total, page: tPage, limit, loading, pageLimit}">
      <VespTablePagination
        v-model="tPage"
        :total="total"
        :limit="limit"
        :page-limit="pageLimit"
        :loading="loading"
        class="mt-5 align-items-center justify-content-center justify-content-md-start g-0"
        @refresh="refresh"
      />
    </slot>

    <slot name="default" />

    <slot name="delete" v-bind="deleteProps">
      <VespConfirm
        v-if="deleteVisible"
        :title="deleteTitle"
        :on-ok="deleteItem"
        ok-title="actions.delete"
        @hidden="onDeleteCancel"
      >
        <BOverlay :opacity="0.5" :show="deleteLoading">
          <div v-html="t(deleteText)" />
        </BOverlay>
      </VespConfirm>
    </slot>
  </section>
</template>

<script setup lang="ts">
import {computed, type PropType, type Ref, ref, watch, useAttrs} from 'vue'
import {BTable} from 'bootstrap-vue-next'
import type {Breakpoint, TableField, BTableSortBy} from 'bootstrap-vue-next'
// @ts-ignore
import type {BTableSortByOrder, TableStrictClassValue} from 'bootstrap-vue-next/dist/src/types/TableTypes'
import {useI18n} from 'vue-i18n'
import type {VespTableAction, VespTableOnLoad} from '../../module'
import {useCustomFetch, useDelete} from '../utils/use-api'
import VespConfirm from './confirm.vue'
import VespTablePagination from './table/pagination.vue'
import VespTableHeaderAction from './table/header-action.vue'
import VespTableRowAction from './table/row-action.vue'
import VespTableQuery from './table/query.vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  ...BTable.props,
  modelValue: {
    type: Number,
    default: null,
  },
  url: {
    type: String,
    required: true,
  },
  fields: {
    type: Array as PropType<TableField[]>,
    default() {
      return []
    },
  },
  filters: {
    type: Object as PropType<Record<string, any>>,
    default() {
      return {}
    },
  },
  filtersDelay: {
    type: Number,
    default: 500,
  },
  updateKey: {
    type: String,
    default: '',
  },
  primaryKey: {
    type: [String, Array],
    default: 'id',
  },
  sort: {
    type: String,
    default: null,
  },
  dir: {
    type: String,
    default: 'asc',
  },
  limit: {
    type: Number,
    default: 20,
  },
  stacked: {
    type: String as PropType<Breakpoint>,
    default: undefined,
  },
  responsive: {
    type: Boolean,
    default: true,
  },
  showEmpty: {
    type: Boolean,
    default: true,
  },
  headerActions: {
    type: Array as PropType<VespTableAction[]>,
    default() {
      return []
    },
  },
  tableActions: {
    type: Array as PropType<VespTableAction[]>,
    default() {
      return []
    },
  },
  rowClass: {
    type: Function as PropType<(item: any) => TableStrictClassValue>,
    default() {
      return ''
    },
  },
  tableClass: {
    type: [String, Array, Object],
    default: 'mt-3 mt-md-0',
  },
  pageLimit: {
    type: Number,
    default: 7,
  },
  onLoad: {
    type: Function as PropType<VespTableOnLoad>,
    default(data: any) {
      return data
    },
  },
  /* getTableActions: {
    type: Function as PropType<VespTableGetActions>,
    default(data: any) {
      return data
    },
  }, */
  emptyText: {
    type: String,
    default: 'components.table.no_data',
  },
  emptyFilteredText: {
    type: String,
    default: 'components.table.no_results',
  },
  deleteTitle: {
    type: String,
    default: 'components.table.delete.title',
  },
  deleteText: {
    type: String,
    default: 'components.table.delete.confirm',
  },
  ignoreWatch: {
    type: Array,
    default() {
      return []
    },
  },
})

const {t} = useI18n()
const table = ref()
const internalValue = ref(1)
const tSort = ref(props.sort)
const tDir = ref(props.dir)
const tSortBy = computed<BTableSortBy[]>(() => {
  return [{key: props.sort, order: (props.dir || 'asc') as BTableSortByOrder}]
})
const tFilters = computed(() => props.filters)
const tLimit = computed(() => props.limit)
const tPage = computed({
  get() {
    return props.modelValue === null ? internalValue.value : props.modelValue
  },
  set(newValue) {
    internalValue.value = newValue
    emit('update:modelValue', newValue)
  },
})
const tFields = computed(() => {
  const fields = [...props.fields]
  if (props.tableActions.length && fields.findIndex((item) => item.key === 'actions') === -1) {
    fields.push({key: 'actions', label: '', class: 'actions'})
  }
  return fields
})
const hasQuery = computed(() => {
  return Object.keys(tFilters.value).includes('query')
})

const attrs = useAttrs()
const tableProps = computed(() => {
  const values = {
    ...props,
    ...{
      url: props.url,
      items: items.value,
      fields: tFields.value,
      class: props.tableClass,
      perPage: tLimit.value,
      sortBy: tSortBy.value,
      multisort: tSortBy.value.length > 1,
      emptyText: t(props.emptyText),
      emptyFilteredText: t(props.emptyFilteredText),
      noLocalSorting: true,
      tbodyTrClass: props.rowClass,
      onSorted: onSort,
    },
    ...attrs,
  }
  delete values.headerActions
  delete values.tableActions
  delete values.filters
  delete values.filtersDelay
  delete values.rowClass
  delete values.deleteTitle
  delete values.deleteText
  delete values.url
  delete values.updateKey
  delete values.sort
  delete values.dir
  delete values.limit
  delete values.pageLimit
  delete values.ignoreWatch

  return values
})
const updateKey = props.updateKey || props.url.split('/').join('-')

const deleteVisible = ref(false)
const deleteLoading = ref(false)
const deleting: Ref<Record<any, any>> = ref({})
const deleteProps = {item: deleting, visible: deleteVisible, loading: deleteLoading, deleteItem}

const params = computed(() => {
  return {
    limit: props.limit,
    page: tPage.value,
    ...getParams(true),
  }
})
const {
  data,
  refresh,
  pending: loading,
} = useCustomFetch(props.url, {
  key: updateKey,
  query: params,
  watch: false,
  onResponse({response}) {
    response._data = props.onLoad(response._data)
  },
})
const total = computed(() => data.value?.total || 0)
const items = computed(() => data.value?.rows || [])

function setItems(rows: Record<string, any>[]) {
  if (data.value) {
    data.value = {...data.value, rows}
  }
}

function onSort(value: BTableSortBy | string) {
  if (typeof value === 'string') {
    if (tSort.value === value) {
      tDir.value = tDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      tDir.value = 'asc'
    }
    tSort.value = value
  } else if (value.key && value.order) {
    tSort.value = value.key
    tDir.value = value.order
  } else {
    tSort.value = ''
    tDir.value = ''
  }
}

function getParams(asObject = false) {
  const params: Record<string, any> = {}
  Object.keys(props.filters).forEach((i) => {
    if (props.filters[i] !== '' && props.filters[i] !== null) {
      if (Array.isArray(props.filters[i])) {
        props.filters[i].forEach((v2, k2) => {
          params[`${i}[${k2}]`] = v2
        })
      } else {
        params[i] = typeof props.filters[i] === 'object' && !asObject
          ? JSON.stringify(props.filters[i])
          : props.filters[i]
      }
    }
  })
  if (tSort.value) {
    params.sort = tSort.value
    params.dir = tDir.value
  }

  return asObject ? JSON.parse(JSON.stringify(params)) : new URLSearchParams(params).toString()
}

function onDelete(item: any) {
  deleteVisible.value = true
  deleting.value = item
}

function onDeleteCancel() {
  deleteVisible.value = false
  deleting.value = {}
}

async function deleteItem() {
  deleteLoading.value = true
  const item = deleting.value
  try {
    if (typeof props.primaryKey === 'string' && item[props.primaryKey]) {
      await useDelete(props.url + '/' + item[props.primaryKey])
    } else if (Array.isArray(props.primaryKey)) {
      const params: Record<string, any> = {}
      props.primaryKey.forEach((i: any) => {
        params[i] = item[i]
      })
      await useDelete(props.url, params)
    } else {
      await useDelete(props.url, item)
    }
    deleteVisible.value = false
    await refresh()
  } catch (e) {
    console.error(e)
  } finally {
    deleteLoading.value = false
  }
}

const exposeObject: Record<string, any> = {
  getParams,
  page: tPage,
  sort: tSort,
  dir: tDir,
  limit: tLimit,
  pageLimit: props.pageLimit,
  loading,
  delete: onDelete,
  refresh,
  items,
  total,
  setItems,
}

const addToExpose = [
  'clearSelected',
  'selectAllRows',
  'selectRow',
  'unselectRow',
  'isRowSelected',
  'displayItems',
  'getStringValue',
]
addToExpose.forEach((key) => {
  exposeObject[key] = function (args: any) {
    // eslint-disable-next-line prefer-spread
    return key in table.value ? table.value[key].apply(table.value, args) : undefined
  }
})

defineExpose(exposeObject)

if (!props.ignoreWatch.includes('filters')) {
  let timeout: number
  watch(tFilters, () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    // @ts-ignore
    timeout = setTimeout(() => {
      if (tPage.value !== 1) {
        tPage.value = 1
      } else {
        refresh()
      }
    }, props.filtersDelay)
  }, {deep: true})
}
if (!props.ignoreWatch.includes('limit')) {
  watch(tLimit, () => refresh())
}
if (!props.ignoreWatch.includes('page')) {
  watch(tPage, () => refresh())
}
if (!props.ignoreWatch.includes('sort')) {
  watch([tSort, tDir], () => refresh())
}
</script>
