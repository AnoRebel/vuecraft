<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsList } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{ class?: HTMLAttributes['class'] }>(), { class: '' })
</script>

<template>
  <TabsList
    :class="
      cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>
