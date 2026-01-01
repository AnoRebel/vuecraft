<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useColorMode } from '~/composables/useColorMode'
import { useResponsivePreview } from '~/composables/useResponsivePreview'
import { generateCSSVariables } from '~/utils/cssGenerator'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { Tooltip } from '~/components/ui/tooltip'
import PreviewDashboard from './PreviewDashboard.vue'
import PreviewCards from './PreviewCards.vue'
import PreviewForms from './PreviewForms.vue'
import PreviewAuth from './PreviewAuth.vue'
import PreviewComponents from './PreviewComponents.vue'
import ElementInspector from './ElementInspector.vue'
import ResponsivePreviewControls from '~/components/ResponsivePreviewControls.vue'

const { config } = useDesignSystem()
const { toggleColorMode, isDark } = useColorMode()
const { previewStyles, isResponsive } = useResponsivePreview()

const activeTemplate = ref('dashboard')
const inspectorEnabled = ref(false)
const previewContainerRef = ref<HTMLElement | null>(null)

// Generate CSS variables from config - this computed will reactively update
const generatedCSS = computed(() => {
  // Access specific config properties to ensure reactivity
  const { theme, typography, components, icons, layout } = config
  return generateCSSVariables({
    theme,
    typography,
    components,
    icons,
    layout,
    export: config.export,
  })
})

// Inject the generated CSS into a style tag
const styleId = 'design-system-preview-styles'

function updatePreviewStyles() {
  // Only run on client side - document is undefined during SSR
  if (import.meta.server) return

  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = styleId
    document.head.appendChild(styleEl)
  }

  // Extract just the CSS variables part (not the @import and @theme)
  const css = generatedCSS.value
  // Apply to the preview container
  styleEl.textContent = css.replace('@import "tailwindcss";', '')
}

// Watch the generated CSS directly - this is more reliable than watching config
watch(
  generatedCSS,
  () => {
    updatePreviewStyles()
  },
  { immediate: true }
)

onMounted(() => {
  // Ensure styles are applied after hydration
  nextTick(() => {
    updatePreviewStyles()
  })
})
</script>

<template>
  <div class="flex h-full flex-col" data-tour-guide="preview-panel">
    <!-- Preview Header -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b px-2 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-0"
    >
      <Tabs v-model="activeTemplate" class="w-full sm:w-auto">
        <TabsList
          class="w-full sm:w-auto grid grid-cols-5 sm:flex"
          data-tour-guide="preview-templates"
        >
          <TabsTrigger value="dashboard" class="text-xs sm:text-sm px-2 sm:px-3">
            <span class="hidden sm:inline">Dashboard</span>
            <span class="sm:hidden">Dash</span>
          </TabsTrigger>
          <TabsTrigger value="cards" class="text-xs sm:text-sm px-2 sm:px-3">Cards</TabsTrigger>
          <TabsTrigger value="forms" class="text-xs sm:text-sm px-2 sm:px-3">Forms</TabsTrigger>
          <TabsTrigger value="auth" class="text-xs sm:text-sm px-2 sm:px-3">Auth</TabsTrigger>
          <TabsTrigger value="components" class="text-xs sm:text-sm px-2 sm:px-3">
            <span class="hidden sm:inline">Components</span>
            <span class="sm:hidden">Comp</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div class="flex items-center gap-2 sm:ml-4 w-full sm:w-auto justify-end">
        <!-- Responsive Preview Controls - Hidden on mobile -->
        <div class="hidden md:flex items-center">
          <ResponsivePreviewControls />
          <div class="w-px h-6 bg-border mx-2" />
        </div>
        <!-- Element Inspector Toggle -->
        <Tooltip content="Element Inspector" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            :class="{ 'bg-blue-500/10 text-blue-500': inspectorEnabled }"
            @click="inspectorEnabled = !inspectorEnabled"
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
              <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
              <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
              <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
              <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
            </svg>
          </Button>
        </Tooltip>
        <Button
          variant="ghost"
          size="icon"
          data-tour-guide="dark-mode-toggle"
          @click="toggleColorMode"
        >
          <svg
            v-if="isDark"
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
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg
            v-else
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
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </Button>
      </div>
    </div>

    <!-- Preview Content -->
    <div
      class="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-4"
      :class="{ 'p-0': isResponsive }"
    >
      <div
        ref="previewContainerRef"
        class="bg-background overflow-auto shadow-lg transition-all duration-200 relative"
        :class="{
          'w-full h-full shadow-none': isResponsive,
          'border rounded-lg': !isResponsive,
          'cursor-crosshair': inspectorEnabled,
        }"
        :style="isResponsive ? {} : previewStyles"
      >
        <PreviewDashboard v-if="activeTemplate === 'dashboard'" />
        <PreviewCards v-else-if="activeTemplate === 'cards'" />
        <PreviewForms v-else-if="activeTemplate === 'forms'" />
        <PreviewAuth v-else-if="activeTemplate === 'auth'" />
        <PreviewComponents v-else-if="activeTemplate === 'components'" />

        <!-- Element Inspector Overlay -->
        <ElementInspector
          :enabled="inspectorEnabled"
          :container-ref="previewContainerRef"
          @close="inspectorEnabled = false"
        />
      </div>
    </div>

    <!-- Inspector Mode Indicator -->
    <div
      v-if="inspectorEnabled"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-full shadow-lg flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
        <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
        <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
        <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
      </svg>
      <span>Inspector Mode</span>
      <button class="ml-1 hover:bg-white/20 rounded p-0.5" @click="inspectorEnabled = false">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
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
      </button>
    </div>
  </div>
</template>
