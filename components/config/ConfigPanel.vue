<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import PresetThemes from './PresetThemes.vue'
import ThemeConfig from './ThemeConfig.vue'
import TypographyConfig from './TypographyConfig.vue'
import ComponentsConfig from './ComponentsConfig.vue'
import IconsConfig from './IconsConfig.vue'
import LayoutConfig from './LayoutConfig.vue'
import EffectsConfig from './EffectsConfig.vue'
import MotionConfig from './MotionConfig.vue'
import ComponentSelection from './ComponentSelection.vue'
import ExportConfig from './ExportConfig.vue'
import SortableSectionList from './SortableSectionList.vue'
import AccessibilityPanel from '~/components/AccessibilityPanel.vue'
import ColorPalettePanel from '~/components/ColorPalettePanel.vue'
import { toast } from 'vue-sonner'
import { useBuilderUi } from '~/composables/useBuilderUi'

defineProps<{ closable?: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { resetAll, randomize, undo } = useDesignSystem()
const { openDialog } = useBuilderUi()

function handleReset() {
  resetAll()
  toast('All settings reset', { action: { label: 'Undo', onClick: undo } })
}

// Search and filter state
const searchQuery = ref('')
const selectedCategoryFilter = ref<string>('all')

const categoryFilters = [
  { id: 'all', label: 'All' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'typography', label: 'Typography' },
  { id: 'components', label: 'Components' },
  { id: 'tools', label: 'Tools' },
]

// Map sections to categories for filtering
const sectionCategories: Record<string, string> = {
  presets: 'appearance',
  theme: 'appearance',
  effects: 'appearance',
  typography: 'typography',
  components: 'components',
  motion: 'components',
  icons: 'components',
  layout: 'components',
  selection: 'components',
  export: 'tools',
  accessibility: 'tools',
  palette: 'tools',
}

// Feature dialogs
const showSectionSettings = ref(false)

// Section visibility and order preferences (persisted)
interface SectionConfig {
  id: string
  label: string
  visible: boolean
}

const defaultSections: SectionConfig[] = [
  { id: 'presets', label: 'Preset Themes', visible: true },
  { id: 'theme', label: 'Theme', visible: true },
  { id: 'effects', label: 'Effects', visible: true },
  { id: 'typography', label: 'Typography', visible: true },
  { id: 'components', label: 'Components', visible: true },
  { id: 'motion', label: 'Motion', visible: true },
  { id: 'icons', label: 'Icons', visible: true },
  { id: 'layout', label: 'Layout', visible: true },
  { id: 'selection', label: 'Component Selection', visible: true },
  { id: 'export', label: 'Export', visible: true },
  { id: 'accessibility', label: 'Accessibility', visible: true },
  { id: 'palette', label: 'Color Palette', visible: true },
]

const sectionConfigs = useStorage<SectionConfig[]>('vuecraft-section-config', defaultSections)

// Sections added in newer versions are appended to layouts saved earlier
onMounted(() => {
  const known = new Set(sectionConfigs.value.map((s) => s.id))
  const missing = defaultSections.filter((s) => !known.has(s.id))
  if (missing.length) {
    const next = [...sectionConfigs.value]
    for (const section of missing) {
      const after = defaultSections.findIndex((d) => d.id === section.id) - 1
      const anchor = next.findIndex((s) => s.id === defaultSections[after]?.id)
      next.splice(anchor >= 0 ? anchor + 1 : next.length, 0, { ...section })
    }
    sectionConfigs.value = next
  }
})

// Get visible sections in order with search and category filtering
const visibleSections = computed(() => {
  let sections = sectionConfigs.value.filter((s) => s.visible)

  // Apply category filter
  if (selectedCategoryFilter.value !== 'all') {
    sections = sections.filter((s) => sectionCategories[s.id] === selectedCategoryFilter.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    sections = sections.filter((s) => s.label.toLowerCase().includes(query))
  }

  return sections
})

// Toggle section visibility - create new array to properly trigger reactivity
function toggleSection(id: string) {
  sectionConfigs.value = sectionConfigs.value.map((s) =>
    s.id === id ? { ...s, visible: !s.visible } : s
  )
}

// Handle reorder from drag-and-drop - create new array with new objects
function handleReorder(reorderedSections: SectionConfig[]) {
  sectionConfigs.value = reorderedSections.map((s) => ({ ...s }))
}

// Reset to defaults - create deep copy
function resetSections() {
  sectionConfigs.value = defaultSections.map((s) => ({ ...s }))
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex min-w-0 shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
      <h2 class="shrink-0 text-sm font-semibold">Configuration</h2>
      <div class="flex shrink-0 items-center gap-0.5" data-tour-guide="shuffle-reset-buttons">
        <Button
          variant="ghost"
          size="icon-sm"
          :class="{ 'bg-muted': showSectionSettings }"
          :aria-pressed="showSectionSettings"
          aria-label="Customize sections"
          title="Customize sections"
          @click="showSectionSettings = !showSectionSettings"
        >
          <Icon name="lucide:list-checks" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Shuffle theme"
          title="Shuffle theme (R)"
          @click="randomize"
        >
          <Icon name="lucide:shuffle" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Reset all settings"
          title="Reset all"
          @click="handleReset"
        >
          <Icon name="lucide:rotate-ccw" />
        </Button>
        <Button
          v-if="closable"
          variant="ghost"
          size="icon-sm"
          aria-label="Close configuration"
          @click="emit('close')"
        >
          <Icon name="lucide:x" />
        </Button>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="border-b px-3 py-2 space-y-2 flex-shrink-0 bg-muted/20">
      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Search configurations..."
          class="pl-7 h-7 text-xs"
        />
      </div>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="cat in categoryFilters"
          :key="cat.id"
          type="button"
          :class="[
            'px-2 py-0.5 text-[10px] rounded-full border transition-colors',
            selectedCategoryFilter === cat.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-transparent text-muted-foreground hover:bg-muted border-border',
          ]"
          @click="selectedCategoryFilter = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Section Settings Panel (when visible) -->
    <div
      v-if="showSectionSettings"
      class="border-b bg-muted/30 px-3 py-2 space-y-2 max-h-[300px] overflow-y-auto flex-shrink-0"
    >
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-medium uppercase text-muted-foreground">Drag to Reorder</span>
        <Button variant="ghost" size="sm" class="h-5 px-2 text-[10px]" @click="resetSections">
          Reset
        </Button>
      </div>
      <SortableSectionList
        :sections="sectionConfigs"
        @toggle="toggleSection"
        @reorder="handleReorder"
      />
    </div>

    <!-- Config Sections -->
    <div class="min-h-0 flex-1 overflow-y-auto px-3">
      <div class="py-2 space-y-2">
        <template v-for="section in visibleSections" :key="section.id">
          <PresetThemes v-if="section.id === 'presets'" />
          <ThemeConfig v-else-if="section.id === 'theme'" />

          <!-- Quick Actions (after theme) -->
          <div v-if="section.id === 'theme'" class="mb-4 mt-2">
            <Button variant="outline" size="sm" class="w-full" @click="openDialog('gallery')">
              <Icon name="lucide:layout-grid" />
              Browse Theme Gallery
            </Button>
          </div>

          <EffectsConfig v-else-if="section.id === 'effects'" />
          <TypographyConfig v-else-if="section.id === 'typography'" />
          <ComponentsConfig v-else-if="section.id === 'components'" />
          <MotionConfig v-else-if="section.id === 'motion'" />
          <IconsConfig v-else-if="section.id === 'icons'" />
          <LayoutConfig v-else-if="section.id === 'layout'" />
          <ComponentSelection v-else-if="section.id === 'selection'" />
          <ExportConfig v-else-if="section.id === 'export'" />

          <!-- Accessibility Panel (no duplicate heading - component has its own) -->
          <div v-else-if="section.id === 'accessibility'" class="mt-4 border-t pt-4">
            <AccessibilityPanel />
          </div>

          <!-- Color Palette Generator -->
          <div v-else-if="section.id === 'palette'" class="mt-4 border-t pt-4">
            <h3 class="text-sm font-medium mb-3">Color Palette Generator</h3>
            <ColorPalettePanel />
          </div>
        </template>
      </div>
    </div>

    <!-- Credits -->
    <footer
      class="flex shrink-0 items-center justify-center gap-1.5 border-t px-3 py-2 text-xs text-muted-foreground"
    >
      <span>Made with</span>
      <Icon name="lucide:heart" class="size-3 text-red-500" aria-label="love" />
      <span>by</span>
      <a
        href="https://github.com/AnoRebel"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-foreground hover:text-primary"
        >AnoRebel</a
      >
      <span aria-hidden="true">·</span>
      <a
        href="https://github.com/AnoRebel/vuecraft"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 hover:text-primary"
      >
        <Icon name="mdi:github" class="size-3" />GitHub
      </a>
    </footer>
  </div>
</template>
