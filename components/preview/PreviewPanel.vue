<script setup lang="ts">
import { ref, computed } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useResponsivePreview } from '~/composables/useResponsivePreview'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { Tooltip } from '~/components/ui/tooltip'
import PreviewDashboard from './PreviewDashboard.vue'
import PreviewCards from './PreviewCards.vue'
import PreviewForms from './PreviewForms.vue'
import PreviewAuth from './PreviewAuth.vue'
import PreviewComponents from './PreviewComponents.vue'
import PreviewColors from './PreviewColors.vue'
import PreviewTypography from './PreviewTypography.vue'
import ElementInspector from './ElementInspector.vue'
import ResponsivePreviewControls from '~/components/ResponsivePreviewControls.vue'
import { useColorBlindnessSimulation } from '~/composables/useColorBlindnessSimulation'
import { useBuilderUi } from '~/composables/useBuilderUi'

const { config } = useDesignSystem()
const { isResponsive, zoom, currentDimensions } = useResponsivePreview()

const TEMPLATES = [
  { value: 'dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { value: 'cards', label: 'Cards', icon: 'lucide:layout-grid' },
  { value: 'forms', label: 'Forms', icon: 'lucide:text-cursor-input' },
  { value: 'auth', label: 'Auth', icon: 'lucide:log-in' },
  { value: 'components', label: 'Components', icon: 'lucide:component' },
  { value: 'colors', label: 'Colors', icon: 'lucide:palette' },
  { value: 'typography', label: 'Typography', icon: 'lucide:type' },
] as const

const { activeTemplate, showCSSPanel, showCSSDialog } = useBuilderUi()
const { activeSimulation, simulationOptions, setSimulation, getCSSFilter, getSVGFilters } =
  useColorBlindnessSimulation()
const svgFilters = getSVGFilters()

function toggleCode() {
  if (window.matchMedia('(min-width: 1024px)').matches) showCSSPanel.value = !showCSSPanel.value
  else showCSSDialog.value = true
}
const inspectorEnabled = ref(false)
const isFullscreen = ref(false)
const scrollRef = ref<HTMLElement | null>(null)
const previewContainerRef = ref<HTMLElement | null>(null)

const frameStyles = computed(() => {
  const scale = zoom.value / 100
  const styles: Record<string, string> = {}
  if (scale !== 1) styles.zoom = String(scale)
  const filter = getCSSFilter()
  if (filter !== 'none') styles.filter = filter
  if (!isResponsive.value) {
    const { width, height } = currentDimensions.value
    if (typeof width === 'number') styles.width = `${width}px`
    if (typeof height === 'number') styles.minHeight = `${height}px`
  }
  return styles
})

onKeyStroke('Escape', () => {
  if (inspectorEnabled.value) inspectorEnabled.value = false
  else if (isFullscreen.value) isFullscreen.value = false
})
</script>

<template>
  <div
    class="@container/panel flex h-full min-h-0 flex-col bg-background"
    :class="{ 'fixed inset-0 z-[90]': isFullscreen }"
    data-tour-guide="preview-panel"
  >
    <!-- Preview header -->
    <div class="flex flex-wrap items-center gap-2 border-b px-2 py-2 sm:px-4">
      <Tabs v-model="activeTemplate" class="min-w-0 flex-1 md:basis-full @[78rem]/panel:basis-auto">
        <div class="-mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
          <TabsList class="w-max" data-tour-guide="preview-templates">
            <TabsTrigger
              v-for="t in TEMPLATES"
              :key="t.value"
              :value="t.value"
              class="px-2 text-xs sm:px-3 sm:text-sm"
            >
              <span class="sm:hidden"><Icon :name="t.icon" class="size-3.5" /></span>
              <span>{{ t.label }}</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div class="ml-auto flex items-center gap-1">
        <div class="hidden md:flex">
          <ResponsivePreviewControls />
        </div>
        <Tooltip content="Element inspector" side="bottom">
          <Button
            variant="ghost"
            size="icon-sm"
            class="hidden md:inline-flex"
            :class="{ 'bg-accent text-accent-foreground': inspectorEnabled }"
            :aria-pressed="inspectorEnabled"
            aria-label="Element inspector"
            @click="inspectorEnabled = !inspectorEnabled"
          >
            <Icon name="lucide:crosshair" />
          </Button>
        </Tooltip>
        <label class="sr-only" for="vision-sim">Color vision simulation</label>
        <select
          id="vision-sim"
          :value="activeSimulation"
          class="hidden h-8 rounded-md border border-input bg-background px-2 text-xs xl:block"
          title="Color vision simulation"
          @change="
            setSimulation(($event.target as HTMLSelectElement).value as typeof activeSimulation)
          "
        >
          <option v-for="o in simulationOptions" :key="o.value" :value="o.value">
            {{ o.value === 'normal' ? 'Normal vision' : o.label }}
          </option>
        </select>
        <Tooltip content="Theme CSS" side="bottom">
          <Button
            variant="ghost"
            size="icon-sm"
            :aria-pressed="showCSSPanel"
            aria-label="Show theme CSS"
            :class="{ 'bg-accent text-accent-foreground': showCSSPanel }"
            @click="toggleCode"
          >
            <Icon name="lucide:code-xml" />
          </Button>
        </Tooltip>
        <Tooltip
          :content="isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen preview'"
          side="bottom"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            :aria-pressed="isFullscreen"
            :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen preview'"
            @click="isFullscreen = !isFullscreen"
          >
            <Icon :name="isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'" />
          </Button>
        </Tooltip>
      </div>
    </div>

    <!-- SVG filters used by the colour vision simulation -->
    <div class="hidden" aria-hidden="true" v-html="svgFilters" />

    <!-- Preview viewport -->
    <div
      ref="scrollRef"
      class="relative min-h-0 flex-1 overflow-auto bg-muted/40"
      :class="[isResponsive ? 'p-0' : 'p-3 sm:p-6', isFullscreen ? '' : 'pb-20 lg:pb-0']"
    >
      <div
        ref="previewContainerRef"
        class="vc-preview @container relative mx-auto bg-background text-foreground transition-[width] duration-200"
        :class="{
          'w-full min-h-full': isResponsive,
          'max-w-none rounded-lg border shadow-lg': !isResponsive,
          'cursor-crosshair': inspectorEnabled,
        }"
        :data-style="config.components.style"
        :data-icons="config.icons.library"
        :style="frameStyles"
      >
        <div class="mx-auto w-full" style="max-width: var(--vc-container)">
          <PreviewDashboard v-if="activeTemplate === 'dashboard'" />
          <PreviewCards v-else-if="activeTemplate === 'cards'" />
          <PreviewForms v-else-if="activeTemplate === 'forms'" />
          <PreviewAuth v-else-if="activeTemplate === 'auth'" />
          <PreviewComponents v-else-if="activeTemplate === 'components'" />
          <PreviewColors v-else-if="activeTemplate === 'colors'" />
          <PreviewTypography v-else-if="activeTemplate === 'typography'" />
        </div>

        <ElementInspector
          :enabled="inspectorEnabled"
          :container-ref="previewContainerRef"
          @close="inspectorEnabled = false"
        />
      </div>

      <!-- Inspector mode indicator -->
      <div
        v-if="inspectorEnabled"
        class="sticky bottom-4 left-0 z-10 mx-auto mt-4 flex w-max items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs text-background shadow-lg"
      >
        <Icon name="lucide:crosshair" class="size-3" />
        <span>Inspector mode · Esc to exit</span>
        <button
          type="button"
          class="ml-1 rounded p-0.5 hover:bg-background/20"
          aria-label="Exit inspector mode"
          @click="inspectorEnabled = false"
        >
          <Icon name="lucide:x" class="size-3" />
        </button>
      </div>
    </div>
  </div>
</template>
