<script setup lang="ts">
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import { cn } from '~/lib/utils'

const { applyPreset, config } = useDesignSystem()
const { PRESET_THEMES } = useConfigOptions()

// Check if current config matches a preset (approximately)
function isActivePreset(presetName: string): boolean {
  const preset = PRESET_THEMES.find((p) => p.name === presetName)
  if (!preset) return false

  return (
    config.theme.accentTheme === preset.config.theme.accentTheme &&
    config.theme.radius === preset.config.theme.radius &&
    config.components.style === preset.config.components.style
  )
}
</script>

<template>
  <ConfigSection title="Preset Themes" description="Quick start with curated themes">
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="preset in PRESET_THEMES"
        :key="preset.name"
        type="button"
        :class="
          cn(
            'relative flex flex-col items-start p-3 rounded-lg border transition-all text-left group',
            isActivePreset(preset.name)
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          )
        "
        @click="applyPreset(preset.name)"
      >
        <!-- Preview Colors -->
        <div class="flex gap-1 mb-2">
          <div
            class="w-6 h-6 rounded-full border"
            :style="{ backgroundColor: preset.preview.primary }"
          />
          <div
            class="w-6 h-6 rounded-full border"
            :style="{ backgroundColor: preset.preview.background }"
          />
        </div>

        <!-- Name and Description -->
        <div class="text-sm font-medium group-hover:text-primary transition-colors">
          {{ preset.label }}
        </div>
        <div class="text-xs text-muted-foreground line-clamp-2">
          {{ preset.description }}
        </div>

        <!-- Active Indicator -->
        <div
          v-if="isActivePreset(preset.name)"
          class="absolute top-2 right-2"
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
            class="text-primary"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
      </button>
    </div>
  </ConfigSection>
</template>
