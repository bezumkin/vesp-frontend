<template>
  <section class="vesp-table">
    <slot name="header" v-bind="{hasFilters, showFilters, hideFilters}">
      <b-row v-if="headerActions.length || hasQuery" class="align-items-center mb-3">
        <b-col>
          <div v-if="headerActions.length">
            <b-btn
              v-for="(action, idx) in headerActions"
              :key="idx"
              v-bind="action"
              :size="action.size || 'md'"
              :class="action.class || (!idx ? 'col-12 col-md-auto' : 'col-12 col-md-auto ml-md-2 mt-2 mt-md-0')"
              :to="action.route ? {name: action.route, params: action.params || {}, query: action.query || {}} : null"
              v-on="action.function ? {click: action.function} : {}"
            >
              <fa :icon="action.icon" /> {{ action.title }}
            </b-btn>
          </div>
        </b-col>

        <b-col v-if="hasQuery" md="4" class="mt-2 mt-md-0">
          <b-input-group>
            <template v-if="hasFilters" #prepend>
              <b-button
                :pressed="tFiltersVisible"
                :variant="tFiltersVisible ? 'warning' : 'secondary'"
                @click="toggleFilters"
              >
                <fa icon="filter" />
              </b-button>
            </template>
            <b-form-input v-model.trim="tFilters.query" :placeholder="$t('components.table.query')" />
            <template #append>
              <b-button :disabled="!tFilters.query" @click="tFilters.query = null">
                <fa icon="times" />
              </b-button>
            </template>
          </b-input-group>
        </b-col>
      </b-row>
    </slot>
    <slot v-if="hasFilters" name="filters-wrapper" v-bind="{showFilters, hideFilters, isVisible: tFiltersVisible}">
      <b-alert variant="info" :show="tFiltersVisible" :dismissible="true" @dismissed="hideFilters">
        <slot name="filters" v-bind="{showFilters, hideFilters, isVisible: tFiltersVisible}" />
      </b-alert>
    </slot>

    <b-table
      ref="table"
      :items="items"
      :fields="tFields"
      :class="tableClass"
      :tbody-tr-class="rowClass"
      :current-page.sync="tPage"
      :per-page.sync="tLimit"
      :sort-by.sync="tSort"
      :sort-direction.sync="tDir"
      :sort-desc="tDir === 'desc'"
      :empty-text="$t('components.table.no_data')"
      :empty-filtered-text="$t('components.table.no_results')"
      :stacked="stacked"
      :responsive="responsive"
      :show-empty="showEmpty"
      :no-sort-reset="true"
      :no-local-sorting="true"
    >
      <template v-if="tableActions.length" #cell(actions)="row">
        <b-btn
          v-for="(action, idx) in tableActions"
          :key="idx"
          v-bind="action"
          :to="action.route ? mapRouteParams(action, row.item) : null"
          :size="action.size || 'sm'"
          @click="onClick(action, row)"
        >
          <fa :icon="action.icon" />
        </b-btn>
      </template>

      <template v-for="(_, slotName) in $scopedSlots" :slot="slotName" slot-scope="slotData">
        <slot :name="slotName" v-bind="slotData" />
      </template>
    </b-table>

    <slot name="footer">
      <b-row no-gutters align-v="center" align-h="center" class="b-table-pagination justify-content-md-start mt-5">
        <b-pagination
          v-if="totalRows > limit"
          v-model="tPage"
          class="m-0"
          :total-rows="totalRows"
          :per-page="limit"
          :limit="pageLimit"
        />

        <b-btn class="ml-2" @click.prevent="refresh">
          <fa icon="sync" :spin="busy" />
        </b-btn>

        <div class="col-12 col-md-auto mt-2 mt-md-0 ml-md-2 text-center">
          <slot name="pagination-data" v-bind="{totalRows}">
            {{ $tc('components.table.records', totalRows, {total: totalRows}) }}
          </slot>
        </div>
      </b-row>
    </slot>
  </section>
</template>

<script>
export default {
  name: 'VespTable',
  props: {
    value: {
      type: Number,
      default: null,
    },
    url: {
      type: String,
      required: true,
    },
    fields: {
      type: Array,
      default() {
        return []
      },
    },
    filters: {
      type: Object,
      default() {
        return {}
      },
    },
    updateKey: {
      type: String,
      required: false,
      default() {
        return this.url.split('/').join('-')
      },
    },
    primaryKey: {
      type: [String, Array],
      default: 'id',
    },
    sort: {
      type: String,
      required: false,
      default: null,
    },
    dir: {
      type: String,
      required: false,
      default: 'asc',
    },
    limit: {
      type: Number,
      required: false,
      default: 20,
    },
    stacked: {
      type: [String, Boolean],
      default: false,
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
      type: Array,
      default() {
        return []
      },
    },
    tableActions: {
      type: Array,
      default() {
        return []
      },
    },
    rowClass: {
      type: Function,
      required: false,
      default() {},
    },
    tableClass: {
      type: String,
      default: 'mt-3 mt-md-0',
    },
    pageLimit: {
      type: Number,
      default: 7,
    },
    onLoad: {
      type: Function,
      default(items) {
        return items
      },
    },
    onDelete: {
      type: Function,
      async default(item) {
        const properties = {
          title: this.$t('components.confirm_delete_title'),
          okVariant: 'danger',
          okTitle: this.$t('components.confirm_yes'),
          cancelTitle: this.$t('components.confirm_no'),
          footerClass: 'justify-content-between',
          hideHeaderClose: false,
          autoFocusButton: 'ok',
          centered: true,
        }
        const res = await this.$bvModal.msgBoxConfirm(this.$t('components.confirm_delete_message'), properties)
        if (res) {
          const params = {}
          if (Array.isArray(this.primaryKey)) {
            for (const i of this.primaryKey) {
              params[i] = item[i]
            }
          } else {
            params[this.primaryKey] = item[this.primaryKey]
          }
          try {
            await this.$axios.delete(this.url, {params})
            this.$emit('delete')
            this.refresh()
          } catch (e) {}
        }
      },
    },
    filtersVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      internalValue: 1,
      busy: false,
      totalRows: 0,
      items: (ctx) => {
        return this.loadTable(ctx)
      },
      tFiltersVisible: this.filtersVisible,
    }
  },
  computed: {
    tPage: {
      get() {
        return this.value === null ? this.internalValue : this.value
      },
      set(newValue) {
        this.internalValue = newValue
        this.$emit('input', newValue)
      },
    },
    tSort: {
      get() {
        return this.sort
      },
      set(newValue) {
        this.$emit('update:sort', newValue)
      },
    },
    tDir: {
      get() {
        return this.dir
      },
      set(newValue) {
        this.$emit('update:dir', newValue)
      },
    },
    tLimit: {
      get() {
        return this.limit
      },
      set(newValue) {
        this.$emit('update:limit', newValue)
      },
    },
    tFilters: {
      get() {
        return this.filters
      },
      set(newValue) {
        this.$emit('update:filters', newValue)
      },
    },
    tFields() {
      const fields = this.fields
      if (this.tableActions.length && fields.findIndex((item) => item.key === 'actions') === -1) {
        fields.push({key: 'actions', label: '', class: 'actions'})
      }
      return fields
    },
    hasQuery() {
      return Object.keys(this.tFilters).includes('query')
    },
    hasFilters() {
      const keys = Object.keys(this.tFilters)
      return this.hasQuery ? keys.length > 1 : keys.length > 0
    },
  },
  watch: {
    tFilters: {
      deep: true,
      handler() {
        if (this.tPage !== 1) {
          this.tPage = 1
        }
        this.refresh()
      },
    },
  },
  created() {
    this.$root.$on(`app::${this.updateKey}::update`, () => {
      this.refresh()
    })
  },
  beforeDestroy() {
    this.$root.$off(`app::${this.updateKey}::update`)
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    getParams(asObject = false) {
      let params = asObject ? {} : ''
      for (const i in this.filters) {
        if (Object.prototype.hasOwnProperty.call(this.filters, i)) {
          if (this.filters[i] !== '' && this.filters[i] !== null) {
            if (typeof this.filters[i] === 'object' && !asObject) {
              this.filters[i].forEach((v) => {
                params += `&${i}[]=${v}`
              })
            } else if (asObject) {
              params[i] = this.filters[i]
            } else {
              params += `&${i}=${this.filters[i]}`
            }
          }
        }
      }
      if (!asObject) {
        params += `&sort=${this.tSort}`
        params += `&dir=${this.tDir}`
      }

      return params
    },
    async loadTable(ctx) {
      const params = {
        page: ctx.currentPage,
        limit: ctx.perPage,
      }
      if (ctx.sortBy) {
        params.sort = ctx.sortBy
        params.dir = ctx.sortDesc ? 'desc' : 'asc'
        this.tSort = params.sort
        this.tDir = params.dir
      } else {
        this.tSort = null
      }

      for (const i in this.tFilters) {
        if (Object.prototype.hasOwnProperty.call(this.tFilters, i) && this.tFilters[i] !== undefined) {
          params[i] = this.tFilters[i]
        }
      }

      this.busy = true
      try {
        let {data: items} = await this.$axios.get(this.url, {params})
        items = this.onLoad(items)
        this.totalRows = items.total || 0

        return items.rows || []
      } catch (e) {
      } finally {
        this.busy = false
      }
    },
    mapRouteParams(action, item) {
      if (!action.map) {
        return {name: action.route, params: item, query: action.query || {}}
      }
      const tmp = {}
      for (const key of Object.keys(action.map)) {
        tmp[key] = item[action.map[key]]
      }
      return {name: action.route, params: tmp, query: action.query || {}}
    },
    onClick(action, row) {
      if (typeof action.function === 'function') {
        action.function(row.item, row)
      } else if (typeof action.function === 'string') {
        this[action.function](row.item)
      }
    },
    toggleFilters() {
      this.tFiltersVisible = !this.tFiltersVisible
    },
    showFilters() {
      this.tFiltersVisible = true
    },
    hideFilters() {
      this.tFiltersVisible = false
    },
  },
}
</script>
