<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), { class: '' })
</script>

<template>
  <div :class="cn('relative overflow-hidden', props.class)">
    <div
      class="h-full w-full overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
    >
      <slot />
    </div>
  </div>
</template>
