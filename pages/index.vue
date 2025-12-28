<script setup lang="ts">
import { ref } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import Toolbar from '~/components/Toolbar.vue'
import ConfigPanel from '~/components/config/ConfigPanel.vue'
import PreviewPanel from '~/components/preview/PreviewPanel.vue'
import LiveCSSEditor from '~/components/config/LiveCSSEditor.vue'
import { Button } from '~/components/ui/button'

const { initFromUrl } = useDesignSystem()

const showCSSEditor = ref(false)

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
      <main class="flex-1 overflow-hidden relative">
        <PreviewPanel />

        <!-- CSS Editor Toggle Button -->
        <Button
          variant="outline"
          size="sm"
          class="absolute bottom-4 right-4 gap-2"
          @click="showCSSEditor = !showCSSEditor"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {{ showCSSEditor ? 'Hide CSS' : 'Show CSS' }}
        </Button>
      </main>

      <!-- CSS Editor Panel (Right Sidebar) -->
      <aside
        v-if="showCSSEditor"
        class="w-[400px] border-l flex-shrink-0 overflow-hidden bg-background p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold">CSS Editor</h2>
          <Button variant="ghost" size="sm" @click="showCSSEditor = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
        <LiveCSSEditor />
      </aside>
    </div>
  </div>
</template>
