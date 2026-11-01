<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import { useColorMode } from '~/composables/useColorMode'
import { useBuilderUi } from '~/composables/useBuilderUi'
import { TWEAKCN_PRESETS, PRESET_CATEGORIES, tweakcnToCustomPreset } from '~/config/tweakcnPresets'
import { CRYSTAL_NEUO_PRESETS } from '~/config/crystalNeuoPresets'
import type { CustomThemePreset } from '~/types/config'
import ConfigSection from './ConfigSection.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

const { applyPreset, applyCustomPreset, config, undo } = useDesignSystem()
const { PRESET_THEMES } = useConfigOptions()
const { isDark } = useColorMode()
const { openDialog } = useBuilderUi()

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const activeBuiltin = ref<string | null>(null)

const categories = [
  PRESET_CATEGORIES[0],
  { id: 'crystal-neuo', label: 'Crystal Neuo' },
  ...PRESET_CATEGORIES.slice(1),
]

const tweakcnPresets = TWEAKCN_PRESETS.map((p) => ({
  category: p.category as string,
  preset: tweakcnToCustomPreset(p),
}))

function matches(p: { label: string; description: string; tags?: readonly string[] }) {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return true
  return (
    p.label.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
  )
}

const filteredCrystal = computed(() =>
  ['all', 'crystal-neuo'].includes(selectedCategory.value)
    ? CRYSTAL_NEUO_PRESETS.filter(matches)
    : []
)

const filteredBuiltin = computed(() =>
  selectedCategory.value === 'all' ? PRESET_THEMES.filter(matches) : []
)

const filteredTweakcn = computed(() =>
  tweakcnPresets
    .filter(
      (p) =>
        (selectedCategory.value === 'all' || p.category === selectedCategory.value) &&
        matches(p.preset)
    )
    .map((p) => p.preset)
)

const activeSource = computed(() => config.theme.custom?.source ?? null)

const activeLabel = computed(() => {
  if (activeSource.value) {
    return (
      [...CRYSTAL_NEUO_PRESETS, ...tweakcnPresets.map((p) => p.preset)].find(
        (p) => p.id === activeSource.value
      )?.label ?? null
    )
  }
  return PRESET_THEMES.find((p) => p.name === activeBuiltin.value)?.label ?? null
})

function isActiveBuiltin(name: string) {
  return !activeSource.value && activeBuiltin.value === name
}

function applyBuiltin(name: string, label: string) {
  applyPreset(name)
  activeBuiltin.value = name
  toast(`Applied ${label}`, { action: { label: 'Undo', onClick: undo } })
}

function applyCustom(preset: CustomThemePreset) {
  applyCustomPreset(preset)
  activeBuiltin.value = null
  toast(`Applied ${preset.label}`, { action: { label: 'Undo', onClick: undo } })
}

function tileClass(active: boolean) {
  return cn(
    'flex h-9 min-w-0 items-center gap-2 rounded-md border px-2 text-left text-xs font-medium transition-colors',
    active
      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
      : 'hover:border-primary/50 hover:bg-muted'
  )
}

function swatches(preset: CustomThemePreset) {
  const set = (isDark.value ? preset.tokens.dark : preset.tokens.light) ?? {}
  return [set.primary, set.background, set['chart-2'] ?? set.accent].filter(Boolean) as string[]
}
</script>

<template>
  <div>
    <ConfigSection title="Presets" static tour-id="preset-themes-section">
      <!-- Active preset -->
      <div
        v-if="activeLabel"
        class="flex items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-1.5"
      >
        <div class="flex min-w-0 items-center gap-2">
          <Icon name="lucide:palette" class="size-3.5 shrink-0 text-primary" />
          <span class="truncate text-xs font-medium">{{ activeLabel }}</span>
        </div>
        <Button variant="ghost" size="sm" class="h-6 px-2 text-xs" @click="openDialog('save')">
          <Icon name="lucide:save" class="size-3" />Save
        </Button>
      </div>

      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Search themes..."
          class="h-8 pl-8 text-sm"
          aria-label="Search themes"
        />
      </div>

      <div
        class="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]"
        role="group"
        aria-label="Filter presets"
      >
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          :aria-pressed="selectedCategory === category.id"
          :class="[
            'shrink-0 rounded-full border px-2 py-0.5 text-xs transition-colors',
            selectedCategory === category.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:bg-muted',
          ]"
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>
    </ConfigSection>

    <ConfigSection
      v-if="filteredCrystal.length"
      :title="`Crystal Neuo · ${filteredCrystal.length}`"
    >
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="preset in filteredCrystal"
          :key="preset.id"
          type="button"
          :aria-pressed="activeSource === preset.id"
          :title="preset.description"
          :class="tileClass(activeSource === preset.id)"
          @click="applyCustom(preset)"
        >
          <span class="flex shrink-0 -space-x-1">
            <span
              v-for="(c, i) in swatches(preset)"
              :key="i"
              class="size-4 border border-background"
              :style="{ backgroundColor: c, borderRadius: preset.tokens.radius }"
            />
          </span>
          <span class="truncate">{{ preset.label.replace('Crystal Neuo ', '') }}</span>
        </button>
      </div>
    </ConfigSection>

    <ConfigSection v-if="filteredBuiltin.length" :title="`Vuecraft · ${filteredBuiltin.length}`">
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="preset in filteredBuiltin"
          :key="preset.name"
          type="button"
          :aria-pressed="isActiveBuiltin(preset.name)"
          :title="preset.description"
          :class="tileClass(isActiveBuiltin(preset.name))"
          @click="applyBuiltin(preset.name, preset.label)"
        >
          <span class="flex shrink-0 -space-x-1">
            <span
              class="size-4 rounded-full border border-background"
              :style="{ backgroundColor: preset.preview.primary }"
            />
            <span
              class="size-4 rounded-full border border-border"
              :style="{ backgroundColor: preset.preview.background }"
            />
          </span>
          <span class="truncate">{{ preset.label }}</span>
        </button>
      </div>
    </ConfigSection>

    <ConfigSection
      v-if="filteredTweakcn.length"
      :title="`tweakcn · ${filteredTweakcn.length}`"
      :default-open="!!searchQuery || selectedCategory !== 'all'"
    >
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="preset in filteredTweakcn"
          :key="preset.id"
          type="button"
          :aria-pressed="activeSource === preset.id"
          :title="preset.description"
          :class="tileClass(activeSource === preset.id)"
          @click="applyCustom(preset)"
        >
          <span class="flex shrink-0 -space-x-1">
            <span
              v-for="(c, i) in swatches(preset)"
              :key="i"
              class="size-4 rounded-full border border-background"
              :style="{ backgroundColor: c }"
            />
          </span>
          <span class="truncate">{{ preset.label }}</span>
        </button>
      </div>
    </ConfigSection>

    <p
      v-if="!filteredCrystal.length && !filteredBuiltin.length && !filteredTweakcn.length"
      class="py-8 text-center text-sm text-muted-foreground"
    >
      No themes found for “{{ searchQuery }}”
    </p>
  </div>
</template>
