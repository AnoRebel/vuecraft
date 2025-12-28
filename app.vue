<script setup lang="ts">
import PWAInstallPrompt from '~/components/PWAInstallPrompt.vue'

// Provide the design system context to the entire app
const colorMode = useColorMode()

const isDark = computed(() => colorMode.preference.value === 'dark')
</script>

<template>
  <div :class="{ dark: isDark }">
    <NuxtPage />
    <PWAInstallPrompt />
  </div>
</template>
