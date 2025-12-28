<script setup lang="ts">
import { useDesignSystem } from '~/composables/useDesignSystem'
import Toolbar from '~/components/Toolbar.vue'
import ConfigPanel from '~/components/config/ConfigPanel.vue'
import PreviewPanel from '~/components/preview/PreviewPanel.vue'

const { initFromUrl } = useDesignSystem()

// Initialize from URL on mount
onMounted(() => {
  initFromUrl()
})

// SEO
useHead({
  title: 'shadcn-vue Create - Design System Customizer',
  meta: [
    {
      name: 'description',
      content:
        'Create and customize your shadcn-vue design system. Export to Vue or Nuxt projects with Tailwind CSS v4.',
    },
  ],
})
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Toolbar -->
    <Toolbar />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Config Panel (Left Sidebar) -->
      <aside class="w-80 border-r flex-shrink-0 overflow-hidden bg-background">
        <ConfigPanel />
      </aside>

      <!-- Preview Panel (Main Content) -->
      <main class="flex-1 overflow-hidden">
        <PreviewPanel />
      </main>
    </div>
  </div>
</template>
