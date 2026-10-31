<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsContent } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{ class?: HTMLAttributes['class']; value: string }>(), {
  class: '',
})
</script>

<template>
  <TabsContent
    :value="props.value"
    :class="cn('focus-visible:outline-2 focus-visible:outline-ring', props.class)"
  >
    <slot />
  </TabsContent>
</template>
