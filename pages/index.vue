<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
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

// Resizable sidebar
const sidebarWidth = useStorage('vuecraft-sidebar-width', 320)
const isResizing = ref(false)
const minWidth = 280
const maxWidth = 500

function startResize(e: MouseEvent) {
  e.preventDefault()
  isResizing.value = true
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
  if (!isResizing.value) return
  const newWidth = Math.min(maxWidth, Math.max(minWidth, e.clientX))
  sidebarWidth.value = newWidth
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

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
        class="!flex lg:!hidden fixed bottom-4 left-4 z-[60] gap-2 shadow-lg bg-background"
        @click="showMobileConfig = !showMobileConfig"
      >
        <Icon name="lucide:settings" class="h-4 w-4" />
        {{ showMobileConfig ? 'Close' : 'Config' }}
      </Button>

      <!-- Mobile Overlay -->
      <div
        v-if="showMobileConfig"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
        @click="showMobileConfig = false"
      />

      <!-- Config Panel (Left Sidebar) -->
      <aside
        class="hidden lg:flex flex-shrink-0 overflow-hidden border-r bg-background relative effects-sidebar"
        :style="{ width: `${sidebarWidth}px` }"
      >
        <ConfigPanel class="h-full w-full" />

        <!-- Resize Handle - Desktop only -->
        <div
          class="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-primary/20 transition-colors group"
          :class="{ 'bg-primary/30': isResizing }"
          @mousedown="startResize"
        >
          <div
            class="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon name="lucide:grip-vertical" class="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </aside>

      <!-- Mobile Config Panel (Slide-in drawer) -->
      <aside
        :class="[
          'lg:hidden fixed inset-y-0 left-0 z-50 w-[85vw] sm:w-80 border-r bg-background effects-sidebar',
          'transform transition-transform duration-300 ease-in-out',
          showMobileConfig ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <!-- Mobile header with close button -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="font-semibold">Configuration</h2>
          <Button variant="ghost" size="sm" @click="showMobileConfig = false">
            <Icon name="lucide:x" class="h-4 w-4" />
          </Button>
        </div>
        <ConfigPanel class="h-[calc(100%-57px)]" />
      </aside>

      <!-- Preview Panel (Main Content) -->
      <main class="flex-1 overflow-hidden relative min-w-0">
        <PreviewPanel />

        <!-- CSS Editor Toggle Button - Desktop -->
        <Button
          variant="outline"
          size="sm"
          class="absolute bottom-4 right-4 gap-2 !hidden lg:!flex"
          @click="showCSSEditor = !showCSSEditor"
        >
          <Icon name="lucide:code-2" class="h-4 w-4" />
          {{ showCSSEditor ? 'Hide CSS' : 'Show CSS' }}
        </Button>

        <!-- CSS Editor Toggle Button - Mobile (icon only, opens dialog) -->
        <Button
          variant="outline"
          size="icon"
          class="absolute bottom-4 right-4 !flex lg:!hidden shadow-lg bg-background"
          @click="showCSSDialog = true"
        >
          <Icon name="lucide:code-2" class="h-4 w-4" />
        </Button>
      </main>

      <!-- CSS Editor Panel (Right Sidebar) - Hidden on mobile -->
      <aside
        v-if="showCSSEditor"
        class="w-[400px] border-l flex-shrink-0 overflow-hidden p-4 hidden lg:block bg-background effects-sidebar"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold">CSS Editor</h2>
          <Button variant="ghost" size="sm" @click="showCSSEditor = false">
            <Icon name="lucide:x" class="h-4 w-4" />
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
      <Icon name="lucide:heart" class="h-3 w-3 text-red-500" />
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
        <Icon name="mdi:github" class="h-3 w-3" />
        <span>GitHub</span>
      </a>
    </footer>
  </div>
</template>
