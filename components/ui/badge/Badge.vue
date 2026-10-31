<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  variant: 'default',
})

const variantClasses = {
  default: 'border-transparent bg-primary text-primary-foreground shadow-xs',
  secondary: 'border-transparent bg-secondary text-secondary-foreground ',
  destructive: 'border-transparent bg-destructive text-destructive-foreground shadow-xs',
  outline: 'text-foreground',
  success: 'border-transparent bg-chart-2/15 text-chart-2',
  warning: 'border-transparent bg-chart-4/20 text-foreground',
}

const classes = computed(() =>
  cn(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors whitespace-nowrap',
    variantClasses[props.variant],
    props.class
  )
)
</script>

<template>
  <span data-slot="badge" :data-variant="props.variant" :class="classes">
    <slot />
  </span>
</template>
