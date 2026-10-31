<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), { class: '' })
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn('rounded-xl border bg-card text-card-foreground shadow-sm effects-card', props.class)
    "
  >
    <slot />
  </div>
</template>
