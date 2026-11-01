<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '~/lib/utils'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'
  disabled?: boolean
  asChild?: boolean
  as?: string
  type?: 'button' | 'submit' | 'reset'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  asChild: false,
  as: 'button',
  type: 'button',
  class: '',
})

const variantClasses = {
  default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  destructive:
    'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:outline-destructive',
  outline:
    'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizeClasses = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-6',
  icon: 'size-9',
  'icon-sm': 'size-8',
}

const classes = computed(() =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class
  )
)
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :type="props.as === 'button' && !props.asChild ? props.type : undefined"
    :disabled="props.disabled || undefined"
    data-slot="button"
    :data-variant="props.variant"
    :class="classes"
  >
    <slot />
  </Primitive>
</template>
