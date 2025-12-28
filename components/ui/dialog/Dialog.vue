<script setup lang="ts">
import { provide } from 'vue'

interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function close() {
  emit('update:open', false)
}

provide('dialog', {
  open: toRef(props, 'open'),
  close,
})
</script>

<template>
  <slot />
</template>
