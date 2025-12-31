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
const showMobileConfig = ref(false)

// Initialize from URL on mount
onMounted(() => {
  initFromUrl()
})

// SEO
useHead({
  title: 'Vuecraft - Universal Vue/Nuxt Theme Builder',
  meta: [
    {
      name: 'description',
      content:
        'Create beautiful themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS. Export to Vue or Nuxt projects.',
    },
  ],
})
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Toolbar -->
    <Toolbar />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Mobile Config Toggle Button -->
      <Button
        variant="outline"
        size="sm"
        class="lg:hidden fixed bottom-4 left-4 z-50 gap-2 shadow-lg"
        @click="showMobileConfig = !showMobileConfig"
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
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {{ showMobileConfig ? 'Close' : 'Config' }}
      </Button>

      <!-- Mobile Overlay -->
      <div
        v-if="showMobileConfig"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
        @click="showMobileConfig = false"
      />

      <!-- Config Panel (Left Sidebar) - Hidden on mobile, shown as drawer -->
      <aside
        :class="[
          'border-r flex-shrink-0 overflow-hidden bg-background transition-transform duration-300 ease-in-out z-50',
          'fixed lg:relative inset-y-0 left-0 w-[85vw] sm:w-80',
          showMobileConfig ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ]"
      >
        <!-- Mobile header with close button -->
        <div class="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 class="font-semibold">Configuration</h2>
          <Button variant="ghost" size="sm" @click="showMobileConfig = false">
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
        <ConfigPanel />
      </aside>

      <!-- Preview Panel (Main Content) -->
      <main class="flex-1 overflow-hidden relative w-full">
        <PreviewPanel />

        <!-- CSS Editor Toggle Button -->
        <Button
          variant="outline"
          size="sm"
          class="absolute bottom-4 right-4 gap-2 hidden sm:flex"
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

      <!-- CSS Editor Panel (Right Sidebar) - Hidden on mobile -->
      <aside
        v-if="showCSSEditor"
        class="w-[400px] border-l flex-shrink-0 overflow-hidden bg-background p-4 hidden md:block"
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
