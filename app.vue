<script setup lang="ts">
import PWAInstallPrompt from '~/components/PWAInstallPrompt.vue'

// Provide the design system context to the entire app
const colorMode = useColorMode()
</script>

<template>
  <div :class="{ dark: colorMode.preference === 'dark' }">
    <NuxtPage />
    <PWAInstallPrompt />
  </div>
</template>
