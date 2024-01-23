<template>
  <svg
    v-if="parsedIcon"
    :class="classes.classes"
    aria-hidden="true"
    focusable="false"
    :data-prefix="parsedIcon.prefix"
    :data-icon="parsedIcon.iconName"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${parsedIcon.icon[0]} ${parsedIcon.icon[1]}`"
  >
    <path class="" style="" fill="currentColor" :d="parsedIcon.icon[4] as string"></path>
  </svg>
</template>

<script setup lang="ts">
import type {IconLookup} from '@fortawesome/fontawesome-svg-core'
import {computed} from 'vue'
import {icon as faIcon, parse as faParse} from '@fortawesome/fontawesome-svg-core'

const props = defineProps({
  border: {
    type: Boolean,
    default: false,
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
  flip: {
    type: [Boolean, String],
    default: false,
    validator: (value: any) => [true, false, 'horizontal', 'vertical', 'both'].includes(value),
  },
  icon: {
    type: [Object, Array, String],
    required: true,
  },
  mask: {
    type: [Object, Array, String],
    default: null,
  },
  maskId: {
    type: String,
    default: null,
  },
  listItem: {
    type: Boolean,
    default: false,
  },
  pull: {
    type: String,
    default: null,
    validator: (value: any) => ['right', 'left'].includes(value),
  },
  pulse: {
    type: Boolean,
    default: false,
  },
  rotation: {
    type: [String, Number],
    default: null,
    validator: (value: any) => [90, 180, 270].includes(Number.parseInt(value, 10)),
  },
  swapOpacity: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: null,
    validator: (value: any) =>
      ['2xs', 'xs', 'sm', 'lg', 'xl', '2xl', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'].includes(
        value,
      ),
  },
  spin: {
    type: Boolean,
    default: false,
  },
  transform: {
    type: [String, Object],
    default: null,
  },
  symbol: {
    type: [Boolean, String],
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  titleId: {
    type: String,
    default: null,
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  bounce: {
    type: Boolean,
    default: false,
  },
  shake: {
    type: Boolean,
    default: false,
  },
  beat: {
    type: Boolean,
    default: false,
  },
  fade: {
    type: Boolean,
    default: false,
  },
  beatFade: {
    type: Boolean,
    default: false,
  },
  flash: {
    type: Boolean,
    default: false,
  },
  spinPulse: {
    type: Boolean,
    default: false,
  },
  spinReverse: {
    type: Boolean,
    default: false,
  },
})

const icon = computed(() => normalizeIconArgs(props.icon))
const mask = computed(() => {
  const tmp = normalizeIconArgs(props.mask)
  if (tmp) {
    return objectWithKey('mask', tmp)
  }
  return undefined
})
const classes = computed(() => objectWithKey('classes', classList(props)))
const transform = computed(() =>
  objectWithKey(
    'transform',
    typeof props.transform === 'object' ? props.transform : faParse.transform(props.transform),
  ),
)

const parsedIcon = computed(() => {
  if (icon.value) {
    return faIcon(icon.value as IconLookup, {
      ...classes.value,
      ...transform.value,
      ...mask.value,
      symbol: props.symbol,
      title: props.title,
      titleId: props.titleId,
      maskId: props.maskId,
    })
  }
  return undefined
})

function normalizeIconArgs(icon: Record<string, any> | string | string[] | null) {
  if (icon) {
    if (typeof icon === 'string') {
      return {prefix: 'fas', iconName: icon}
    }

    if (Array.isArray(icon) && icon.length === 2) {
      return {prefix: icon[0], iconName: icon[1]}
    }

    if (typeof icon === 'object' && 'prefix' in icon && 'iconName' in icon) {
      return icon
    }
  }
}

function objectWithKey(key: string, value: any) {
  return (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value) ? {[key]: value} : {}
}

function classList(props: Record<string, any>) {
  const classes = {
    'fa-spin': props.spin,
    'fa-pulse': props.pulse,
    'fa-fw': props.fixedWidth,
    'fa-border': props.border,
    'fa-li': props.listItem,
    'fa-inverse': props.inverse,
    'fa-flip': props.flip === true,
    'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
    'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both',
    [`fa-${props.size}`]: props.size !== null,
    [`fa-rotate-${props.rotation}`]: props.rotation !== null,
    [`fa-pull-${props.pull}`]: props.pull !== null,
    'fa-swap-opacity': props.swapOpacity,
    'fa-bounce': props.bounce,
    'fa-shake': props.shake,
    'fa-beat': props.beat,
    'fa-fade': props.fade,
    'fa-beat-fade': props.beatFade,
    'fa-flash': props.flash,
    'fa-spin-pulse': props.spinPulse,
    'fa-spin-reverse': props.spinReverse,
  }

  const enabled = Object.keys(classes)
    .map((key) => (classes[key] ? key : null))
    .filter((key) => key)

  return ['svg-inline--fa', ...enabled]
}

if (!parsedIcon.value) {
  console.info('Could not find one or more icon(s)', icon.value)
}
</script>
