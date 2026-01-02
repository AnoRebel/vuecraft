<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import PresetThemes from './PresetThemes.vue'
import ThemeConfig from './ThemeConfig.vue'
import TypographyConfig from './TypographyConfig.vue'
import ComponentsConfig from './ComponentsConfig.vue'
import IconsConfig from './IconsConfig.vue'
import LayoutConfig from './LayoutConfig.vue'
import EffectsConfig from './EffectsConfig.vue'
import ComponentSelection from './ComponentSelection.vue'
import ExportConfig from './ExportConfig.vue'
import SortableSectionList from './SortableSectionList.vue'
import AccessibilityPanel from '~/components/AccessibilityPanel.vue'
import ColorPalettePanel from '~/components/ColorPalettePanel.vue'
import ThemeGalleryDialog from '~/components/ThemeGalleryDialog.vue'

const { resetAll, randomize } = useDesignSystem()

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
  icons: 'components',
  layout: 'components',
  selection: 'components',
  export: 'tools',
  accessibility: 'tools',
  palette: 'tools',
}

// Feature dialogs
const showGallery = ref(false)
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
  { id: 'icons', label: 'Icons', visible: true },
  { id: 'layout', label: 'Layout', visible: true },
  { id: 'selection', label: 'Component Selection', visible: true },
  { id: 'export', label: 'Export', visible: true },
  { id: 'accessibility', label: 'Accessibility', visible: true },
  { id: 'palette', label: 'Color Palette', visible: true },
]

const sectionConfigs = useStorage<SectionConfig[]>('vuecraft-section-config', defaultSections)

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

// Toggle section visibility
function toggleSection(id: string) {
  const section = sectionConfigs.value.find((s) => s.id === id)
  if (section) {
    section.visible = !section.visible
  }
}

// Handle reorder from drag-and-drop
function handleReorder(reorderedSections: SectionConfig[]) {
  sectionConfigs.value = reorderedSections
}

// Reset to defaults
function resetSections() {
  sectionConfigs.value = [...defaultSections]
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-3 py-2 min-w-0 flex-shrink-0">
      <h2 class="font-semibold flex-shrink-0 text-sm">Configuration</h2>
      <div class="flex gap-0.5 flex-shrink-0" data-tour-guide="shuffle-reset-buttons">
        <!-- Section Settings Toggle -->
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          :class="{ 'bg-muted': showSectionSettings }"
          title="Customize sections"
          @click="showSectionSettings = !showSectionSettings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
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
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          title="Shuffle theme"
          @click="randomize"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
          </svg>
        </Button>
        <Button variant="ghost" size="icon" class="h-8 w-8" title="Reset all" @click="resetAll">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
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
    <ScrollArea class="flex-1 px-3 min-h-0">
      <div class="py-2">
        <template v-for="section in visibleSections" :key="section.id">
          <PresetThemes v-if="section.id === 'presets'" />
          <ThemeConfig v-else-if="section.id === 'theme'" />

          <!-- Quick Actions (after theme) -->
          <div v-if="section.id === 'theme'" class="mb-4 mt-2">
            <Button variant="outline" size="sm" class="w-full" @click="showGallery = true">
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
                class="mr-2"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Browse Theme Gallery
            </Button>
          </div>

          <EffectsConfig v-else-if="section.id === 'effects'" />
          <TypographyConfig v-else-if="section.id === 'typography'" />
          <ComponentsConfig v-else-if="section.id === 'components'" />
          <IconsConfig v-else-if="section.id === 'icons'" />
          <LayoutConfig v-else-if="section.id === 'layout'" />
          <ComponentSelection v-else-if="section.id === 'selection'" />
          <ExportConfig v-else-if="section.id === 'export'" />

          <!-- Accessibility Panel -->
          <div v-else-if="section.id === 'accessibility'" class="mt-4 border-t pt-4">
            <h3 class="text-sm font-semibold mb-3">Accessibility Check</h3>
            <AccessibilityPanel />
          </div>

          <!-- Color Palette Generator -->
          <div v-else-if="section.id === 'palette'" class="mt-4 border-t pt-4">
            <h3 class="text-sm font-semibold mb-3">Color Palette Generator</h3>
            <ColorPalettePanel />
          </div>
        </template>
      </div>
    </ScrollArea>

    <!-- Theme Gallery Dialog -->
    <ThemeGalleryDialog v-model:open="showGallery" @apply="showGallery = false" />
  </div>
</template>
