<template>
  <b-modal ref="modal" class="vesp-modal" v-bind="$props" v-on="listeners">
    <template #default>
      <b-overlay :opacity="0.5" :show="loading">
        <b-form ref="form" @submit.prevent="submit">
          <slot name="form-fields" v-bind="{record, loading, submit}" />
          <input type="submit" class="d-none" />
        </b-form>
      </b-overlay>
    </template>
    <template #modal-footer="{cancel}">
      <b-btn :variant="cancelVariant" :disabled="loading" @click="cancel" v-text="cancelTitle" />
      <b-btn v-if="url" :variant="okVariant" :disabled="loading" @click="formSubmit" v-text="okTitle" />
    </template>
    <template v-for="(_, slotName) in $scopedSlots" :slot="slotName" slot-scope="slotData">
      <slot :name="slotName" v-bind="{...slotData, record, loading, submit, formSubmit}" />
    </template>
  </b-modal>
</template>

<script>
import {BModal} from 'bootstrap-vue'

export default {
  name: 'VespModal',
  props: {
    ...BModal.extendOptions.props,
    url: {
      type: String,
      default: null,
    },
    value: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    updateKey: {
      type: String,
      required: false,
      default() {
        return this.url ? this.url.split('/').join('-') : null
      },
    },
    visible: {
      type: Boolean,
      default: true,
    },
    footerClass: {
      type: [Object, Array, String],
      default: 'pt-2 justify-content-between',
    },
    okTitle: {
      type: String,
      default() {
        return this.$t('actions.submit')
      },
    },
    cancelTitle: {
      type: String,
      default() {
        return this.$t('actions.cancel')
      },
    },
    beforeSubmit: {
      type: Function,
      default(record) {
        return record
      },
    },
    actionCreate: {
      type: String,
      default: 'put',
    },
    actionEdit: {
      type: String,
      default: 'patch',
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    record: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
    listeners() {
      const listeners = {...this.$listeners}
      if (!listeners.hidden) {
        listeners.hidden = this.goBack
      }
      return listeners
    },
  },
  methods: {
    formSubmit() {
      let form = this.$refs.form
      if (!form && this.$scopedSlots.default) {
        const slot = this.$scopedSlots.default()
        for (const item of slot) {
          if (item.context && item.context.$refs && item.context.$refs.form) {
            form = item.context.$refs.form
            break
          }
        }
      }
      if (form) {
        const submit = form.querySelector('[type="submit"]')
        if (submit) {
          submit.click()
        } else {
          this.submit()
        }
      } else {
        this.submit()
      }
    },
    async submit() {
      if (!this.url) {
        return
      }
      try {
        const record = this.beforeSubmit(JSON.parse(JSON.stringify(this.record)))
        if (record) {
          if (typeof record === 'string') {
            this.$toast.error(record)
          } else {
            this.loading = true
            const method = record.id ? this.actionEdit : this.actionCreate
            const {data} = await this.$axios[method](this.url, record)
            this.$emit('after-submit', data)

            if (this.updateKey) {
              this.$root.$emit(`app::${this.updateKey}::update`, data)
            }
            this.cancel()
          }
        }
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    hide() {
      if (this.$refs.modal) {
        this.$refs.modal.hide()
      }
    },
    goBack() {
      const idx = this.$route.matched.findIndex((item) => item.name === this.$route.name)
      if (idx > -1 && this.$route.matched[idx].parent) {
        this.$router.push({
          name: this.$route.matched[idx].parent.name,
          params: this.$route.params,
          query: this.$route.query,
        })
      } else {
        this.$router.go(-1)
      }
    },
  },
}
</script>
