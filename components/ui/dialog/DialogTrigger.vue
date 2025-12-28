<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div @click="emit('click')">
    <slot />
  </div>
</template>
