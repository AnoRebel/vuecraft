<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'destructive'
    title?: string
    class?: HTMLAttributes['class']
  }>(),
  { variant: 'default', title: '', class: '' }
)
</script>

<template>
  <div
    role="alert"
    data-slot="alert"
    :class="
      cn(
        'relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-0.5 rounded-lg border px-4 py-3 text-sm',
        props.variant === 'destructive'
          ? 'border-destructive/50 bg-card text-destructive [&_[data-desc]]:text-destructive/90'
          : 'bg-card text-card-foreground',
        props.class
      )
    "
  >
    <span class="row-span-2 mt-0.5"><slot name="icon" /></span>
    <div class="font-medium leading-tight">{{ props.title }}</div>
    <div data-desc class="text-muted-foreground"><slot /></div>
  </div>
</template>
