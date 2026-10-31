<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogTitle } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{ class?: HTMLAttributes['class'] }>(), { class: '' })
</script>

<template>
  <DialogTitle :class="cn('text-lg font-semibold leading-none tracking-tight pr-6', props.class)">
    <slot />
  </DialogTitle>
</template>
