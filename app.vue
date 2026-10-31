<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import PWAInstallPrompt from '~/components/PWAInstallPrompt.vue'

// Keeps the .dark class on <html> in sync with the stored colour mode
const { isDark } = useColorMode()
</script>

<template>
  <div>
    <NuxtPage />
    <PWAInstallPrompt />
    <Toaster :theme="isDark ? 'dark' : 'light'" position="bottom-right" rich-colors close-button />
  </div>
</template>
