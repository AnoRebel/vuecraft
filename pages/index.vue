<script setup lang="ts">
import { ref } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import Toolbar from '~/components/Toolbar.vue'
import ConfigPanel from '~/components/config/ConfigPanel.vue'
import PreviewPanel from '~/components/preview/PreviewPanel.vue'
import LiveCSSEditor from '~/components/config/LiveCSSEditor.vue'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const { initFromUrl } = useDesignSystem()

const showCSSEditor = ref(false)
const showMobileConfig = ref(false)
const showCSSDialog = ref(false)

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
          <path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          />
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
          'border-r flex-shrink-0 overflow-hidden transition-transform duration-300 ease-in-out z-50',
          'bg-background/[--effects-sidebar-opacity,1] backdrop-blur-[--effects-blur,0px] supports-[backdrop-filter]:bg-background/[--effects-sidebar-opacity,1]',
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

        <!-- CSS Editor Toggle Button - Desktop -->
        <Button
          variant="outline"
          size="sm"
          class="absolute bottom-4 right-4 gap-2 hidden md:flex"
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

        <!-- CSS Editor Toggle Button - Mobile (opens dialog) -->
        <Button
          variant="outline"
          size="icon"
          class="absolute bottom-4 right-4 flex md:hidden shadow-lg"
          title="Show CSS"
          @click="showCSSDialog = true"
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
        </Button>
      </main>

      <!-- CSS Editor Panel (Right Sidebar) - Hidden on mobile -->
      <aside
        v-if="showCSSEditor"
        class="w-[400px] border-l flex-shrink-0 overflow-hidden p-4 hidden md:block bg-background/[--effects-sidebar-opacity,1] backdrop-blur-[--effects-blur,0px] supports-[backdrop-filter]:bg-background/[--effects-sidebar-opacity,1]"
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

    <!-- Mobile CSS Editor Dialog -->
    <Dialog v-model:open="showCSSDialog">
      <DialogContent class="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>CSS Editor</DialogTitle>
        </DialogHeader>
        <div class="overflow-auto max-h-[calc(90vh-100px)]">
          <LiveCSSEditor />
        </div>
      </DialogContent>
    </Dialog>

    <!-- Floating Footer -->
    <footer
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border shadow-lg hidden lg:flex items-center gap-2 text-xs text-muted-foreground"
    >
      <span>Made with</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="text-red-500"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <span>by</span>
      <a
        href="https://github.com/AnoRebel"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-foreground hover:text-primary transition-colors"
      >
        AnoRebel
      </a>
      <span class="mx-1">|</span>
      <a
        href="https://github.com/AnoRebel/vuecraft"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        <span>GitHub</span>
      </a>
    </footer>
  </div>
</template>
