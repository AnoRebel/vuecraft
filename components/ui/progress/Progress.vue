<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ modelValue?: number; class?: HTMLAttributes['class'] }>(),
  {
    modelValue: 0,
    class: '',
  }
)
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    :model-value="props.modelValue"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', props.class)"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 bg-primary transition-transform"
      :style="{ transform: `translateX(-${100 - props.modelValue}%)` }"
    />
  </ProgressRoot>
</template>
