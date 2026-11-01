<script setup lang="ts">
import { computed } from 'vue'
import { initials } from '~/utils/sampleData'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ name: string; size?: 'sm' | 'md' | 'lg'; tone?: number; class?: string }>(),
  { size: 'md', tone: undefined, class: '' }
)

// Stable colour per name from the chart palette
const toneIndex = computed(() => {
  if (props.tone) return props.tone
  let hash = 0
  for (const c of props.name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  return (hash % 5) + 1
})

const sizes = { sm: 'size-7 text-[0.65rem]', md: 'size-9 text-xs', lg: 'size-14 text-base' }
</script>

<template>
  <span
    data-slot="avatar"
    :class="
      cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold ring-2 ring-background',
        sizes[props.size],
        props.class
      )
    "
    :style="{
      backgroundColor: `color-mix(in oklch, var(--color-chart-${toneIndex}) 22%, var(--color-background))`,
      color: `color-mix(in oklch, var(--color-chart-${toneIndex}) 75%, var(--color-foreground))`,
    }"
    :aria-label="name"
    role="img"
  >
    {{ initials(name) }}
  </span>
</template>
