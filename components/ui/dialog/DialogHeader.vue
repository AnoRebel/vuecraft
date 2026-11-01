<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), { class: '' })
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-left', props.class)">
    <slot />
  </div>
</template>
