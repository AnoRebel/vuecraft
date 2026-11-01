<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useBuilderUi } from '~/composables/useBuilderUi'
import {
  CONFIG_TABS,
  DEFAULT_SECTIONS,
  SECTION_TAB,
  migrateSections,
  searchSettings,
  type ConfigTabId,
  type SectionConfig,
  type SettingEntry,
} from '~/config/configTabs'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import PresetThemes from './PresetThemes.vue'
import ColorsConfig from './ColorsConfig.vue'
import StyleConfig from './StyleConfig.vue'
import TypographyConfig from './TypographyConfig.vue'
import IconsConfig from './IconsConfig.vue'
import MotionConfig from './MotionConfig.vue'
import LayoutConfig from './LayoutConfig.vue'
import EffectsConfig from './EffectsConfig.vue'
import ExportConfig from './ExportConfig.vue'
import ComponentSelection from './ComponentSelection.vue'
import ConfigSection from './ConfigSection.vue'
import SortableSectionList from './SortableSectionList.vue'
import AccessibilityPanel from '~/components/AccessibilityPanel.vue'
import ColorPalettePanel from '~/components/ColorPalettePanel.vue'

defineProps<{ closable?: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { resetAll, randomize, undo } = useDesignSystem()
const { openDialog } = useBuilderUi()

const rootRef = ref<HTMLElement | null>(null)
const query = ref('')
const activeTab = useStorage<ConfigTabId>('vuecraft-config-tab', 'themes')
const activeTabInfo = computed(
  () => CONFIG_TABS.find((t) => t.id === activeTab.value) ?? CONFIG_TABS[0]!
)

// --- Sections (visibility and order, per tab) ------------------------------
const stored = useStorage<SectionConfig[]>('vuecraft-section-config', DEFAULT_SECTIONS)
const showSectionSettings = ref(false)

onMounted(() => {
  stored.value = migrateSections(stored.value)
})

const sectionsByTab = computed(() => {
  const map = new Map<ConfigTabId, SectionConfig[]>()
  for (const section of migrateSections(stored.value)) {
    const tab = SECTION_TAB[section.id]
    if (tab) map.set(tab, [...(map.get(tab) ?? []), section])
  }
  return map
})

function visibleSections(tab: ConfigTabId) {
  return (sectionsByTab.value.get(tab) ?? []).filter((s) => s.visible)
}

const tabSections = computed(() => sectionsByTab.value.get(activeTab.value) ?? [])

function toggleSection(id: string) {
  stored.value = migrateSections(stored.value).map((s) =>
    s.id === id ? { ...s, visible: !s.visible } : s
  )
}

/** Reorder the active tab's sections, keeping the others in place */
function handleReorder(reordered: SectionConfig[]) {
  const ids = new Set(reordered.map((s) => s.id))
  const queue = [...reordered]
  stored.value = migrateSections(stored.value).map((s) =>
    ids.has(s.id) ? { ...queue.shift()!, visible: s.visible } : s
  )
}

function resetSections() {
  stored.value = DEFAULT_SECTIONS.map((s) => ({ ...s }))
}

// --- Tabs ------------------------------------------------------------------
function selectTab(id: ConfigTabId) {
  activeTab.value = id
  showSectionSettings.value = false
  query.value = ''
}

function onRailKeydown(e: KeyboardEvent) {
  const index = CONFIG_TABS.findIndex((t) => t.id === activeTab.value)
  let next = index
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % CONFIG_TABS.length
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
    next = (index - 1 + CONFIG_TABS.length) % CONFIG_TABS.length
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = CONFIG_TABS.length - 1
  else return
  e.preventDefault()
  selectTab(CONFIG_TABS[next]!.id)
  nextTick(() =>
    rootRef.value?.querySelector<HTMLElement>(`[data-tab-id="${CONFIG_TABS[next]!.id}"]`)?.focus()
  )
}

// --- Search ----------------------------------------------------------------
const results = computed(() => searchSettings(query.value))

async function jumpTo(entry: SettingEntry) {
  selectTab(entry.tab)
  await nextTick()
  const el = rootRef.value?.querySelector<HTMLElement>(`#${entry.id}`)
  if (!el) {
    toast('That setting is in a hidden section', {
      description: 'Show it again from the section settings of this tab.',
    })
    return
  }
  // Open the collapsed group that contains it
  const body = el.closest<HTMLElement>('[data-section-body]')
  if (body && body.style.display === 'none') {
    body.parentElement?.querySelector<HTMLElement>('button[aria-expanded]')?.click()
    await nextTick()
  }
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  el.classList.add('vc-setting-flash')
  setTimeout(() => el.classList.remove('vc-setting-flash'), 1400)
}

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && results.value[0]) {
    e.preventDefault()
    jumpTo(results.value[0])
  } else if (e.key === 'Escape' && query.value) {
    e.stopPropagation()
    query.value = ''
  }
}

function handleReset() {
  resetAll()
  toast('All settings reset', { action: { label: 'Undo', onClick: undo } })
}
</script>

<template>
  <div ref="rootRef" class="flex h-full min-h-0 flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex min-w-0 shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
      <div class="min-w-0">
        <h2 class="truncate text-sm font-semibold">{{ activeTabInfo.label }}</h2>
        <p class="truncate text-[11px] text-muted-foreground">{{ activeTabInfo.description }}</p>
      </div>
      <div class="flex shrink-0 items-center gap-0.5" data-tour-guide="shuffle-reset-buttons">
        <Button
          variant="ghost"
          size="icon-sm"
          :class="{ 'bg-muted': showSectionSettings }"
          :aria-pressed="showSectionSettings"
          aria-label="Section settings for this tab"
          title="Show, hide or reorder sections"
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

    <!-- Search -->
    <div class="shrink-0 border-b px-3 py-2">
      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          v-model="query"
          type="search"
          placeholder="Search settings..."
          class="h-8 pl-8 text-sm"
          aria-label="Search settings"
          @keydown="onSearchKeydown"
        />
      </div>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- Tab rail -->
      <nav
        class="flex w-14 shrink-0 flex-col gap-0.5 overflow-y-auto border-r bg-muted/30 p-1"
        role="tablist"
        aria-orientation="vertical"
        aria-label="Settings categories"
        @keydown="onRailKeydown"
      >
        <button
          v-for="tab in CONFIG_TABS"
          :key="tab.id"
          type="button"
          role="tab"
          :data-tab-id="tab.id"
          :data-tour-guide="`config-tab-${tab.id}`"
          :aria-selected="activeTab === tab.id && !query"
          :aria-controls="`config-tab-panel-${tab.id}`"
          :tabindex="activeTab === tab.id ? 0 : -1"
          :title="tab.description"
          class="flex flex-col items-center gap-0.5 rounded-md px-1 py-2 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring"
          :class="
            activeTab === tab.id && !query
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
          "
          @click="selectTab(tab.id)"
        >
          <Icon :name="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </nav>

      <div class="relative min-w-0 flex-1">
        <!-- Search results -->
        <div
          v-if="query"
          class="absolute inset-0 overflow-y-auto p-2"
          role="listbox"
          aria-label="Matching settings"
        >
          <button
            v-for="r in results"
            :key="r.id"
            type="button"
            role="option"
            :aria-selected="false"
            class="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
            @click="jumpTo(r)"
          >
            <span class="truncate">{{ r.label }}</span>
            <span class="shrink-0 text-[11px] text-muted-foreground">
              {{ CONFIG_TABS.find((t) => t.id === r.tab)?.label }}
            </span>
          </button>
          <p v-if="!results.length" class="px-2 py-8 text-center text-sm text-muted-foreground">
            No settings match “{{ query }}”
          </p>
        </div>

        <!-- Tab panels (kept mounted so scroll position and open groups persist) -->
        <div
          v-for="tab in CONFIG_TABS"
          v-show="activeTab === tab.id && !query"
          :id="`config-tab-panel-${tab.id}`"
          :key="tab.id"
          role="tabpanel"
          :aria-label="tab.label"
          class="absolute inset-0 overflow-y-auto px-3"
        >
          <!-- Section settings for this tab -->
          <div
            v-if="showSectionSettings && activeTab === tab.id"
            class="mt-3 space-y-2 rounded-lg border bg-muted/30 p-2"
          >
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-medium uppercase text-muted-foreground">
                Sections in {{ tab.label }}
              </span>
              <Button variant="ghost" size="sm" class="h-6 px-2 text-[11px]" @click="resetSections">
                Reset
              </Button>
            </div>
            <SortableSectionList
              :sections="tabSections"
              @toggle="toggleSection"
              @reorder="handleReorder"
            />
          </div>

          <template v-for="section in visibleSections(tab.id)" :key="section.id">
            <div v-if="section.id === 'presets'" id="setting-presets">
              <PresetThemes />
              <Button
                variant="outline"
                size="sm"
                class="mb-3 w-full"
                @click="openDialog('gallery')"
              >
                <Icon name="lucide:layout-grid" />Browse theme gallery
              </Button>
            </div>
            <ColorsConfig v-else-if="section.id === 'colors'" />
            <ConfigSection
              v-else-if="section.id === 'palette'"
              id="setting-palette"
              title="Palette generator"
              :default-open="false"
            >
              <ColorPalettePanel />
            </ConfigSection>
            <ConfigSection
              v-else-if="section.id === 'accessibility'"
              id="setting-accessibility"
              title="Contrast check"
              :default-open="false"
            >
              <AccessibilityPanel />
            </ConfigSection>
            <StyleConfig v-else-if="section.id === 'style'" />
            <TypographyConfig v-else-if="section.id === 'typography'" />
            <IconsConfig v-else-if="section.id === 'icons'" />
            <MotionConfig v-else-if="section.id === 'motion'" />
            <LayoutConfig v-else-if="section.id === 'layout'" />
            <EffectsConfig v-else-if="section.id === 'effects'" />
            <ExportConfig v-else-if="section.id === 'export'" />
            <ComponentSelection v-else-if="section.id === 'selection'" />
          </template>

          <p
            v-if="!visibleSections(tab.id).length"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            All sections in this tab are hidden.
            <button
              type="button"
              class="text-primary underline"
              @click="showSectionSettings = true"
            >
              Show sections
            </button>
          </p>
          <div class="h-4" aria-hidden="true" />
        </div>
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
