<script setup lang="ts">
// Provide the design system context to the entire app
const colorMode = useColorMode()
</script>

<template>
  <div :class="{ dark: colorMode.preference === 'dark' }">
    <NuxtPage />
  </div>
</template>
