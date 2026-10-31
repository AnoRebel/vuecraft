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
import { Badge } from '~/components/ui/badge'
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

function swatches(preset: CustomThemePreset) {
  const set = (isDark.value ? preset.tokens.dark : preset.tokens.light) ?? {}
  return [set.primary, set.background, set['chart-2'] ?? set.accent].filter(Boolean) as string[]
}
</script>

<template>
  <ConfigSection
    title="Preset Themes"
    description="Quick start with curated themes"
    tour-id="preset-themes-section"
  >
    <div class="space-y-4">
      <!-- Active preset -->
      <div
        v-if="activeLabel"
        class="flex items-center justify-between gap-2 rounded-lg bg-muted/50 p-2"
      >
        <div class="flex min-w-0 items-center gap-2">
          <Icon name="lucide:palette" class="size-4 shrink-0 text-primary" />
          <span class="truncate text-sm font-medium">{{ activeLabel }}</span>
        </div>
        <Button variant="ghost" size="sm" class="h-6 px-2 text-xs" @click="openDialog('save')">
          <Icon name="lucide:save" class="size-3" />Save
        </Button>
      </div>

      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Search themes..."
          class="h-8 pl-8 text-sm"
          aria-label="Search themes"
        />
      </div>

      <div class="flex flex-wrap gap-1" role="group" aria-label="Filter presets">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          :aria-pressed="selectedCategory === category.id"
          :class="[
            'rounded-full border px-2 py-0.5 text-xs transition-colors',
            selectedCategory === category.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-transparent text-muted-foreground hover:bg-muted',
          ]"
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- Crystal Neuo -->
      <section v-if="filteredCrystal.length" class="space-y-2">
        <h4
          class="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Crystal Neuo
          <Badge variant="outline" class="px-1 py-0 text-[9px]">{{ filteredCrystal.length }}</Badge>
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in filteredCrystal"
            :key="preset.id"
            type="button"
            :aria-pressed="activeSource === preset.id"
            :class="
              cn(
                'group relative flex flex-col items-start rounded-lg border p-2.5 text-left transition-all',
                activeSource === preset.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )
            "
            :title="preset.description"
            @click="applyCustom(preset)"
          >
            <div class="mb-1.5 flex gap-1">
              <span
                v-for="(c, i) in swatches(preset)"
                :key="i"
                class="size-5 border"
                :style="{ backgroundColor: c, borderRadius: preset.tokens.radius }"
              />
            </div>
            <span class="text-xs font-medium transition-colors group-hover:text-primary">
              {{ preset.label.replace('Crystal Neuo ', '') }}
            </span>
            <span class="line-clamp-2 text-[10px] text-muted-foreground">{{
              preset.description
            }}</span>
            <Icon
              v-if="activeSource === preset.id"
              name="lucide:circle-check"
              class="absolute right-1.5 top-1.5 size-3.5 text-primary"
            />
          </button>
        </div>
      </section>

      <!-- Built-in -->
      <section v-if="filteredBuiltin.length" class="space-y-2">
        <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Vuecraft Presets
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in filteredBuiltin"
            :key="preset.name"
            type="button"
            :aria-pressed="isActiveBuiltin(preset.name)"
            :class="
              cn(
                'group relative flex flex-col items-start rounded-lg border p-2.5 text-left transition-all',
                isActiveBuiltin(preset.name)
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )
            "
            @click="applyBuiltin(preset.name, preset.label)"
          >
            <div class="mb-1.5 flex gap-1">
              <span
                class="size-5 rounded-full border"
                :style="{ backgroundColor: preset.preview.primary }"
              />
              <span
                class="size-5 rounded-full border"
                :style="{ backgroundColor: preset.preview.background }"
              />
            </div>
            <span class="text-xs font-medium transition-colors group-hover:text-primary">{{
              preset.label
            }}</span>
            <span class="line-clamp-1 text-[10px] text-muted-foreground">{{
              preset.description
            }}</span>
            <Icon
              v-if="isActiveBuiltin(preset.name)"
              name="lucide:circle-check"
              class="absolute right-1.5 top-1.5 size-3.5 text-primary"
            />
          </button>
        </div>
      </section>

      <!-- tweakcn -->
      <section v-if="filteredTweakcn.length" class="space-y-2">
        <h4
          class="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          tweakcn Presets
          <Badge variant="outline" class="px-1 py-0 text-[9px]">{{ filteredTweakcn.length }}</Badge>
        </h4>
        <div class="grid max-h-[400px] grid-cols-2 gap-2 overflow-y-auto pr-1">
          <button
            v-for="preset in filteredTweakcn"
            :key="preset.id"
            type="button"
            :aria-pressed="activeSource === preset.id"
            :class="
              cn(
                'group relative flex flex-col items-start rounded-lg border p-2.5 text-left transition-all',
                activeSource === preset.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )
            "
            @click="applyCustom(preset)"
          >
            <div class="mb-1.5 flex gap-1">
              <span
                v-for="(c, i) in swatches(preset)"
                :key="i"
                class="size-5 rounded-full border"
                :style="{ backgroundColor: c }"
              />
            </div>
            <span class="text-xs font-medium transition-colors group-hover:text-primary">{{
              preset.label
            }}</span>
            <span class="line-clamp-1 text-[10px] text-muted-foreground">{{
              preset.description
            }}</span>
            <Icon
              v-if="activeSource === preset.id"
              name="lucide:circle-check"
              class="absolute right-1.5 top-1.5 size-3.5 text-primary"
            />
          </button>
        </div>
      </section>

      <p
        v-if="!filteredCrystal.length && !filteredBuiltin.length && !filteredTweakcn.length"
        class="py-8 text-center text-sm text-muted-foreground"
      >
        No themes found for “{{ searchQuery }}”
      </p>
    </div>
  </ConfigSection>
</template>
