<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStorage, useMediaQuery } from '@vueuse/core'
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import { toast } from 'vue-sonner'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useBuilderUi } from '~/composables/useBuilderUi'
import Toolbar from '~/components/Toolbar.vue'
import ConfigPanel from '~/components/config/ConfigPanel.vue'
import PreviewPanel from '~/components/preview/PreviewPanel.vue'
import LiveCSSEditor from '~/components/config/LiveCSSEditor.vue'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent as UiDialogContent,
  DialogHeader,
  DialogTitle as UiDialogTitle,
} from '~/components/ui/dialog'

const { initFromUrl } = useDesignSystem()
const { showMobileConfig, showCSSPanel, showCSSDialog } = useBuilderUi()

// Only one configuration panel is mounted at a time (sidebar or mobile sheet)
const isDesktop = useMediaQuery('(min-width: 1024px)')

// Resizable sidebar (desktop)
const sidebarWidth = useStorage('vuecraft-sidebar-width', 320)
const isResizing = ref(false)
const MIN_WIDTH = 280
const MAX_WIDTH = 520

function startResize(e: PointerEvent) {
  e.preventDefault()
  isResizing.value = true
  const move = (ev: PointerEvent) => {
    sidebarWidth.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, ev.clientX))
  }
  const stop = () => {
    isResizing.value = false
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', stop)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', stop)
}

function resizeWithKeyboard(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') sidebarWidth.value = Math.max(MIN_WIDTH, sidebarWidth.value - 16)
  if (e.key === 'ArrowRight') sidebarWidth.value = Math.min(MAX_WIDTH, sidebarWidth.value + 16)
}

const OAUTH_ERRORS: Record<string, string> = {
  github_oauth_failed: 'GitHub sign-in failed. Please try again.',
  google_oauth_failed: 'Google sign-in failed. Please try again.',
}

onMounted(() => {
  initFromUrl()

  const route = useRoute()
  const error = route.query.error
  if (typeof error === 'string') {
    toast.error(OAUTH_ERRORS[error] ?? 'Sign-in failed. Please try again.')
    const { error: _e, ...rest } = route.query
    useRouter().replace({ query: rest })
  }
})

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
  <div class="flex h-dvh flex-col overflow-hidden">
    <Toolbar />

    <div class="relative flex min-h-0 flex-1 overflow-hidden">
      <!-- Config panel (desktop) -->
      <aside
        class="effects-sidebar relative hidden shrink-0 overflow-hidden border-r bg-background lg:flex"
        :style="{ width: `${sidebarWidth}px` }"
        aria-label="Theme configuration"
      >
        <ClientOnly>
          <ConfigPanel v-if="isDesktop" class="h-full w-full" />
        </ClientOnly>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize configuration panel"
          :aria-valuenow="sidebarWidth"
          :aria-valuemin="MIN_WIDTH"
          :aria-valuemax="MAX_WIDTH"
          tabindex="0"
          class="group absolute right-0 top-0 z-10 h-full w-1.5 cursor-ew-resize transition-colors hover:bg-primary/20 focus-visible:bg-primary/30 focus-visible:outline-none"
          :class="{ 'bg-primary/30': isResizing }"
          @pointerdown="startResize"
          @keydown="resizeWithKeyboard"
        />
      </aside>

      <!-- Config panel (mobile sheet) -->
      <DialogRoot v-model:open="showMobileConfig">
        <DialogPortal>
          <DialogOverlay class="vc-overlay fixed inset-0 z-[80] bg-black/50 lg:hidden" />
          <DialogContent
            class="effects-sidebar fixed inset-y-0 left-0 z-[80] flex w-[88vw] max-w-sm flex-col border-r bg-background shadow-xl transition-transform data-[state=closed]:-translate-x-full lg:hidden"
            aria-describedby="mobile-config-desc"
          >
            <DialogTitle class="sr-only">Configuration</DialogTitle>
            <p id="mobile-config-desc" class="sr-only">Adjust the theme. Press Escape to close.</p>
            <ConfigPanel class="min-h-0 flex-1" closable @close="showMobileConfig = false" />
          </DialogContent>
        </DialogPortal>
      </DialogRoot>

      <!-- Preview -->
      <main class="relative min-w-0 flex-1 overflow-hidden">
        <PreviewPanel />

        <Button
          v-if="!showMobileConfig"
          variant="outline"
          class="fixed bottom-4 left-4 z-30 bg-background shadow-lg lg:hidden"
          aria-label="Open configuration"
          @click="showMobileConfig = true"
        >
          <Icon name="lucide:sliders-horizontal" />
          Customize
        </Button>
      </main>

      <!-- CSS panel (desktop) -->
      <aside
        v-if="showCSSPanel"
        class="effects-sidebar hidden w-[400px] shrink-0 flex-col overflow-hidden border-l bg-background p-4 lg:flex"
        aria-label="Theme CSS"
      >
        <div class="mb-3 flex items-center justify-between">
          <h2 class="font-semibold">Theme CSS</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close CSS panel"
            @click="showCSSPanel = false"
          >
            <Icon name="lucide:x" />
          </Button>
        </div>
        <LiveCSSEditor />
      </aside>
    </div>

    <!-- CSS editor (mobile) -->
    <Dialog v-model:open="showCSSDialog">
      <UiDialogContent class="max-w-lg">
        <DialogHeader>
          <UiDialogTitle>Theme CSS</UiDialogTitle>
        </DialogHeader>
        <LiveCSSEditor />
      </UiDialogContent>
    </Dialog>
  </div>
</template>
