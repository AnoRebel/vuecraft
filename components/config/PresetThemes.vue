<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import { useColorMode } from '~/composables/useColorMode'
import { useAuth } from '~/composables/useAuth'
import { TWEAKCN_PRESETS, PRESET_CATEGORIES, type TweakcnPreset } from '~/config/tweakcnPresets'
import ConfigSection from './ConfigSection.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const { applyPreset, config, saveConfiguration } = useDesignSystem()
const { PRESET_THEMES } = useConfigOptions()
const { isDark } = useColorMode()
const { isLoggedIn } = useAuth()

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const activePresetId = ref<string | null>(null)
const isEdited = ref(false)
const currentTweakcnPreset = ref<TweakcnPreset | null>(null)

// Track when config changes from preset
watch(
  () => config,
  () => {
    if (activePresetId.value) {
      isEdited.value = true
    }
  },
  { deep: true }
)

// Filter tweakcn presets based on search and category
const filteredTweakcnPresets = computed(() => {
  let presets = TWEAKCN_PRESETS

  if (selectedCategory.value !== 'all') {
    presets = presets.filter((p) => p.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    presets = presets.filter(
      (p) =>
        p.label.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  return presets
})

// Filter built-in presets based on search
const filteredBuiltinPresets = computed(() => {
  if (!searchQuery.value) return PRESET_THEMES

  const query = searchQuery.value.toLowerCase()
  return PRESET_THEMES.filter(
    (p) => p.label.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
  )
})

// Check if current config matches a preset (approximately)
function isActivePreset(presetName: string): boolean {
  const preset = PRESET_THEMES.find((p) => p.name === presetName)
  if (!preset) return false

  return (
    activePresetId.value === `builtin-${presetName}` ||
    (config.theme.accentTheme === preset.config.theme.accentTheme &&
      config.theme.radius === preset.config.theme.radius &&
      config.components.style === preset.config.components.style)
  )
}

function isActiveTweakcnPreset(presetId: string): boolean {
  return activePresetId.value === `tweakcn-${presetId}`
}

// Apply built-in preset
function handleApplyBuiltinPreset(presetName: string) {
  // Clear any inline styles from tweakcn presets first
  clearInlineStyles()
  currentTweakcnPreset.value = null
  applyPreset(presetName)
  activePresetId.value = `builtin-${presetName}`
  isEdited.value = false
}

// Clear all inline CSS variables
function clearInlineStyles() {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  // List of all color properties to clear
  const colorProps = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
    'sidebar',
    'sidebar-foreground',
    'sidebar-primary',
    'sidebar-primary-foreground',
    'sidebar-accent',
    'sidebar-accent-foreground',
    'sidebar-border',
    'sidebar-ring',
  ]

  colorProps.forEach((prop) => {
    root.style.removeProperty(`--color-${prop}`)
  })
  root.style.removeProperty('--radius')
}

// Apply tweakcn preset by setting CSS variables directly
function applyTweakcnPreset(preset: TweakcnPreset) {
  if (typeof document === 'undefined') return

  // Store the current preset for reapplication on theme toggle
  currentTweakcnPreset.value = preset

  const styles = isDark.value ? preset.styles.dark : preset.styles.light
  const root = document.documentElement

  // Clear any previously applied inline styles first
  clearInlineStyles()

  // Apply all color variables with nextTick to ensure DOM updates
  nextTick(() => {
    Object.entries(styles).forEach(([key, value]) => {
      if (key === 'radius') {
        root.style.setProperty('--radius', value)
      } else if (
        !key.startsWith('font-') &&
        !key.startsWith('shadow-') &&
        !key.startsWith('letter-') &&
        key !== 'spacing'
      ) {
        root.style.setProperty(`--color-${key}`, value)
      }
    })
  })

  activePresetId.value = `tweakcn-${preset.id}`
  isEdited.value = false
}

// Watch for theme mode changes and reapply preset if active
watch(isDark, () => {
  if (currentTweakcnPreset.value) {
    applyTweakcnPreset(currentTweakcnPreset.value)
  }
})

// Save edited preset
function saveEditedPreset() {
  const name = prompt('Enter a name for this theme:')
  if (name) {
    saveConfiguration(name)
    isEdited.value = false
  }
}
</script>

<template>
  <ConfigSection
    title="Preset Themes"
    description="Quick start with curated themes"
    tour-id="preset-themes-section"
  >
    <div class="space-y-4">
      <!-- Active Preset Indicator -->
      <div
        v-if="activePresetId"
        class="flex items-center justify-between p-2 rounded-lg bg-muted/50"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:palette" class="h-4 w-4 text-primary" />
          <span class="text-sm font-medium">
            {{ activePresetId.replace('builtin-', '').replace('tweakcn-', '') }}
          </span>
          <Badge v-if="isEdited" variant="secondary" class="text-xs">Edited</Badge>
        </div>
        <Button
          v-if="isEdited && isLoggedIn"
          variant="ghost"
          size="sm"
          class="h-6 px-2 text-xs"
          @click="saveEditedPreset"
        >
          <Icon name="lucide:save" class="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>

      <!-- Search Input -->
      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input v-model="searchQuery" placeholder="Search themes..." class="pl-8 h-8 text-sm" />
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-1">
        <button
          v-for="category in PRESET_CATEGORIES"
          :key="category.id"
          type="button"
          :class="[
            'px-2 py-0.5 text-xs rounded-full border transition-colors',
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-transparent text-muted-foreground hover:bg-muted border-border',
          ]"
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- Built-in Presets Section -->
      <div v-if="filteredBuiltinPresets.length > 0 && selectedCategory === 'all'" class="space-y-2">
        <h4 class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Vuecraft Presets
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in filteredBuiltinPresets"
            :key="preset.name"
            type="button"
            :class="
              cn(
                'relative flex flex-col items-start p-2.5 rounded-lg border transition-all text-left group',
                isActivePreset(preset.name)
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )
            "
            @click="handleApplyBuiltinPreset(preset.name)"
          >
            <!-- Preview Colors -->
            <div class="flex gap-1 mb-1.5">
              <div
                class="w-5 h-5 rounded-full border"
                :style="{ backgroundColor: preset.preview.primary }"
              />
              <div
                class="w-5 h-5 rounded-full border"
                :style="{ backgroundColor: preset.preview.background }"
              />
            </div>

            <!-- Name and Description -->
            <div class="text-xs font-medium group-hover:text-primary transition-colors">
              {{ preset.label }}
            </div>
            <div class="text-[10px] text-muted-foreground line-clamp-1">
              {{ preset.description }}
            </div>

            <!-- Active Indicator -->
            <div v-if="isActivePreset(preset.name)" class="absolute top-1.5 right-1.5">
              <Icon name="lucide:check-circle" class="h-3.5 w-3.5 text-primary" />
            </div>
          </button>
        </div>
      </div>

      <!-- TweakCN Presets Section -->
      <div v-if="filteredTweakcnPresets.length > 0" class="space-y-2">
        <h4
          class="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2"
        >
          <span>TweakCN Presets</span>
          <Badge variant="outline" class="text-[9px] px-1 py-0">{{
            filteredTweakcnPresets.length
          }}</Badge>
        </h4>
        <div class="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
          <button
            v-for="preset in filteredTweakcnPresets"
            :key="preset.id"
            type="button"
            :class="
              cn(
                'relative flex flex-col items-start p-2.5 rounded-lg border transition-all text-left group',
                isActiveTweakcnPreset(preset.id)
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )
            "
            @click="applyTweakcnPreset(preset)"
          >
            <!-- Preview Colors -->
            <div class="flex gap-1 mb-1.5">
              <div
                class="w-5 h-5 rounded-full border"
                :style="{
                  backgroundColor: isDark
                    ? preset.styles.dark.primary
                    : preset.styles.light.primary,
                }"
              />
              <div
                class="w-5 h-5 rounded-full border"
                :style="{
                  backgroundColor: isDark
                    ? preset.styles.dark.background
                    : preset.styles.light.background,
                }"
              />
            </div>

            <!-- Name and Description -->
            <div class="text-xs font-medium group-hover:text-primary transition-colors">
              {{ preset.label }}
            </div>
            <div class="text-[10px] text-muted-foreground line-clamp-1">
              {{ preset.description }}
            </div>

            <!-- Category Badge -->
            <Badge variant="outline" class="absolute top-1.5 right-1.5 text-[8px] px-1 py-0">
              {{ preset.category }}
            </Badge>

            <!-- Active Indicator -->
            <div v-if="isActiveTweakcnPreset(preset.id)" class="absolute bottom-1.5 right-1.5">
              <Icon name="lucide:check-circle" class="h-3.5 w-3.5 text-primary" />
            </div>
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="filteredBuiltinPresets.length === 0 && filteredTweakcnPresets.length === 0"
        class="py-8 text-center text-sm text-muted-foreground"
      >
        No themes found for "{{ searchQuery }}"
      </div>
    </div>
  </ConfigSection>
</template>
