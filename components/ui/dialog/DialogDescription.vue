<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogDescription } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{ class?: HTMLAttributes['class'] }>(), { class: '' })
</script>

<template>
  <DialogDescription :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </DialogDescription>
</template>
