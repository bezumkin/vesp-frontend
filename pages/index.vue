<template>
  <div>
    <b-container class="mt-5 mb-5">
      <vesp-table
        ref="table"
        v-model="page"
        :url="url"
        :fields="fields"
        :filters="filters"
        :on-load="onLoad"
        :header-actions="headerActions"
        :table-actions="tableActions"
        :limit="limit"
        :update-key="updateKey"
      />
    </b-container>
    <nuxt-child />
  </div>
</template>

<script>
import VespTable from '~/components/table'
export const url = 'https://jsonplaceholder.typicode.com/posts'

export default {
  name: 'IndexPage',
  components: {VespTable},
  data() {
    return {
      url,
      limit: 10,
      filters: {
        query: '',
      },
      page: 1,
      updateKey: 'json-posts',
      sort: 'title',
      dir: 'desc',
    }
  },
  computed: {
    fields() {
      return [
        {key: 'id', label: this.$t('components.table.columns.id'), sortable: true},
        {key: 'userId', label: this.$t('components.table.columns.userId'), sortable: true},
        {key: 'title', label: this.$t('components.table.columns.title'), sortable: true},
        {key: 'body', label: this.$t('components.table.columns.body')},
      ]
    },
    headerActions() {
      return [{route: 'index-create', icon: 'plus', title: this.$t('actions.create')}]
    },
    tableActions() {
      return [
        {route: 'index-edit-id', icon: 'edit', title: this.$t('actions.edit'), map: {id: 'id'}},
        {function: 'onDelete', icon: 'times', title: this.$t('actions.delete'), variant: 'danger'},
      ]
    },
  },
  created() {
    this.addLexicons()
  },
  methods: {
    // Emulate response from Vesp Core
    onLoad(items) {
      if (this.filters.query) {
        items = items.filter((row) => row.title.includes(this.filters.query) || row.body.includes(this.filters.query))
      }
      const limit = this.limit
      const offset = (this.page - 1) * limit

      return {
        rows: items.slice(offset, offset + limit),
        total: items.length,
      }
    },
    addLexicons() {
      this.$i18n.mergeLocaleMessage('en', {
        components: {
          table: {
            columns: {
              userId: 'User Id',
              title: 'Title',
              body: 'Text',
            },
          },
        },
      })
      this.$i18n.mergeLocaleMessage('de', {
        components: {
          table: {
            columns: {
              userId: 'Benutzer-ID',
              title: 'Titel',
              body: 'Text',
            },
          },
        },
      })
      this.$i18n.mergeLocaleMessage('ru', {
        components: {
          table: {
            columns: {
              userId: 'Id юзера',
              title: 'Заголовок',
              body: 'Текст',
            },
          },
        },
      })
    },
  },
}
</script>
