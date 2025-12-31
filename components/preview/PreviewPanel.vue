<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useColorMode } from '~/composables/useColorMode'
import { generateCSSVariables } from '~/utils/cssGenerator'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import PreviewDashboard from './PreviewDashboard.vue'
import PreviewCards from './PreviewCards.vue'
import PreviewForms from './PreviewForms.vue'
import PreviewAuth from './PreviewAuth.vue'
import PreviewComponents from './PreviewComponents.vue'
import ResponsivePreviewControls from '~/components/ResponsivePreviewControls.vue'

const { config } = useDesignSystem()
const { toggleColorMode, isDark } = useColorMode()

const activeTemplate = ref('dashboard')

// Generate CSS variables from config
const generatedCSS = computed(() => {
  return generateCSSVariables(config)
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

watch(
  () => config,
  () => {
    updatePreviewStyles()
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  updatePreviewStyles()
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
    <div class="flex-1 overflow-auto bg-background">
      <PreviewDashboard v-if="activeTemplate === 'dashboard'" />
      <PreviewCards v-else-if="activeTemplate === 'cards'" />
      <PreviewForms v-else-if="activeTemplate === 'forms'" />
      <PreviewAuth v-else-if="activeTemplate === 'auth'" />
      <PreviewComponents v-else-if="activeTemplate === 'components'" />
    </div>
  </div>
</template>
