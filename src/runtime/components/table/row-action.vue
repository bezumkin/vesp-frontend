<template>
  <BButton
    v-if="typeof action.isActive !== 'function' || action.isActive(item)"
    :size="action.size || 'sm'"
    :variant="action.variant || 'secondary'"
    :class="action.class"
    :disabled="typeof action.isDisabled === 'function' && action.isDisabled(item)"
    :title="action.icon ? action.title : undefined"
    v-bind="action.route ? {to: mapRouteParams(action, item)} : {}"
    @click="onClick"
  >
    <template #default>
      <VespFa v-if="action.icon" :icon="action.icon" fixed-width />
      <template v-else>
        {{ action.title }}
      </template>
    </template>
  </BButton>
</template>

<script setup lang="ts">
import type {PropType} from 'vue'
import type {VespTableAction} from '../../../module'
import type {RouteLocationNamedRaw} from 'vue-router'

const props = defineProps({
  item: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  action: {
    type: Object as PropType<VespTableAction>,
    required: true,
  },
  primaryKey: {
    type: String,
    default: 'id',
  },
})

function onClick() {
  if (!props.action.function || typeof props.action.function !== 'function') {
    return
  }
  props.action.function(JSON.parse(JSON.stringify(props.item)))
}

function mapRouteParams(action: VespTableAction, item: Record<string, any>): RouteLocationNamedRaw | undefined {
  if (!action.route) {
    return undefined
  }
  if (!action.map) {
    action.map = {}
    if (Array.isArray(props.primaryKey)) {
      props.primaryKey.forEach((i: any) => {
        // @ts-ignore
        action.map[i] = i
      })
    } else {
      action.map[props.primaryKey] = props.primaryKey
    }
  }
  const params: Record<string, any> = {}
  for (const key of Object.keys(action.map)) {
    const val = action.map[key] as string
    if (/\./.test(val)) {
      const keys = val.split('.')
      let local: object | string = {...item}
      for (const i of keys) {
        if (local && typeof local === 'object' && i in local) {
          // @ts-ignore
          local = local[i]
        } else {
          local = ''
          break
        }
      }
      params[key] = local
    } else {
      params[key] = item[val]
    }
  }
  return {...action.route, params}
}
</script>
