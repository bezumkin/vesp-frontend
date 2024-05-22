<template>
  <VespTable
    ref="table"
    v-model="page"
    class="mt-5 mb-5"
    :url="url"
    :fields="fields"
    :filters="filters"
    :on-load="onLoad"
    :header-actions="headerActions"
    :table-actions="tableActions"
    :limit="limit"
    sort="title"
    dir="asc"
  >
    <NuxtPage />
  </VespTable>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import type {ComputedRef} from 'vue'
import type {VespTableAction} from '../../src/module'

const url = 'posts'
const page = ref(1)
const filters = ref({query: ''})
const limit = 10
const table = ref()

const {t, mergeLocaleMessage} = useI18n()

const fields = computed(() => {
  return [
    {key: 'id', label: t('components.table.columns.id'), sortable: true},
    {key: 'userId', label: t('components.table.columns.userId'), sortable: true},
    {key: 'title', label: t('components.table.columns.title'), sortable: true},
    {key: 'body', label: t('components.table.columns.body')},
  ]
})
const headerActions = computed(() => {
  return [{route: {name: 'index-create'}, icon: 'plus', title: t('actions.create')}]
})
const tableActions: ComputedRef<VespTableAction[]> = computed(() => {
  return [
    {route: {name: 'index-id-edit'}, icon: 'edit', title: t('actions.edit')},
    {function: table.value?.delete, icon: 'times', title: t('actions.delete'), variant: 'danger'},
  ]
})

// Emulate response from Vesp Core
function onLoad(items: Record<string, any>) {
  if (filters.value.query) {
    items = items.filter(
      (row: any) => row.title.includes(filters.value.query) || row.body.includes(filters.value.query),
    )
  }
  const offset = (page.value - 1) * limit
  return {
    rows: items.slice(offset, offset + limit),
    total: items.length,
  }
}

mergeLocaleMessage('en', {
  components: {
    table: {columns: {id: 'Id', userId: 'User Id', title: 'Title', body: 'Text'}},
  },
})
mergeLocaleMessage('de', {
  components: {
    table: {columns: {id: 'Id', userId: 'Benutzer-ID', title: 'Titel', body: 'Text'}},
  },
})
mergeLocaleMessage('ru', {
  components: {
    table: {columns: {id: 'Id', userId: 'Id юзера', title: 'Заголовок', body: 'Текст'}},
  },
})
mergeLocaleMessage('nl', {
  components: {
    table: {columns: {id: 'Id', userId: 'Gebruiker Id', title: 'Titel', body: 'Tekst'}},
  },
})
mergeLocaleMessage('fr', {
  components: {
    table: {columns: {id: 'Id', userId: 'Utilisateur Id', title: 'Titre', body: 'Texte'}},
  },
})
</script>
