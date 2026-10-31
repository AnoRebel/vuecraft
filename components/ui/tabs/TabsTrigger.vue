<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsTrigger } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes['class']; value: string; disabled?: boolean }>(),
  {
    class: '',
    disabled: false,
  }
)
</script>

<template>
  <TabsTrigger
    :value="props.value"
    :disabled="props.disabled"
    :class="
      cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
