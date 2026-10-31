<script setup lang="ts">
import { DialogRoot } from 'reka-ui'

const props = withDefaults(defineProps<{ open?: boolean; modal?: boolean }>(), {
  open: false,
  modal: true,
})

const emit = defineEmits<{ 'update:open': [value: boolean] }>()
</script>

<template>
  <DialogRoot :open="props.open" :modal="props.modal" @update:open="emit('update:open', $event)">
    <slot />
  </DialogRoot>
</template>
