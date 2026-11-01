<script setup lang="ts">
import { computed } from 'vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'
import { Slider } from '~/components/ui/slider'
import type {
  BorderWidth,
  ComponentsConfig,
  RadiusValue,
  ShadowIntensity,
  StyleName,
} from '~/types/config'

const { config, setTheme, setComponents } = useDesignSystem()
const { STYLES, RADIUS_OPTIONS, SHADOW_INTENSITIES, BORDER_WIDTHS } = useConfigOptions()

const RADIUS_REM: Record<string, number> = { none: 0, sm: 0.25, md: 0.5, lg: 0.75, xl: 1, full: 2 }

const radiusPreset = computed(() =>
  config.theme.radiusValue == null && !config.theme.custom?.radius ? config.theme.radius : ''
)

const exactRadius = computed(() =>
  typeof config.theme.radiusValue === 'number'
    ? config.theme.radiusValue
    : (RADIUS_REM[config.theme.radius] ?? 0.5)
)

const radiusDisplay = computed(() => {
  if (typeof config.theme.radiusValue === 'number') return `${config.theme.radiusValue}rem`
  if (config.theme.custom?.radius) return `${config.theme.custom.radius} (preset)`
  return RADIUS_OPTIONS.find((r) => r.name === config.theme.radius)?.value ?? '0.5rem'
})

const radiusOptions = RADIUS_OPTIONS.map((r) => ({
  name: r.name,
  label:
    r.name === 'xl'
      ? 'XL'
      : r.name === 'none'
        ? 'None'
        : r.name === 'full'
          ? 'Full'
          : r.name.toUpperCase(),
  description: undefined,
}))

const ringWidths = [
  { name: 'thin', label: 'Thin' },
  { name: 'default', label: 'Default' },
  { name: 'thick', label: 'Thick' },
]
const ringOffsets = [
  { name: 'none', label: 'None' },
  { name: 'sm', label: 'Small' },
  { name: 'default', label: 'Default' },
]
</script>

<template>
  <div>
    <ConfigSection title="Components" static tour-id="components-config-section">
      <OptionPicker
        id="setting-style"
        :model-value="config.components.style"
        :options="STYLES.map((s) => ({ name: s.name, label: s.label, description: s.description }))"
        label="Style"
        @update:model-value="(v) => setComponents({ style: v as StyleName })"
      />
      <OptionPicker
        id="setting-border-width"
        :model-value="config.components.borderWidth"
        :options="BORDER_WIDTHS.map((b) => ({ name: b.name, label: b.label }))"
        label="Border width"
        @update:model-value="(v) => setComponents({ borderWidth: v as BorderWidth })"
      />
    </ConfigSection>

    <ConfigSection title="Shape & depth">
      <div id="setting-radius" class="space-y-1.5">
        <div class="flex items-baseline justify-between gap-2">
          <span class="text-sm font-medium">Radius</span>
          <span class="truncate font-mono text-xs text-muted-foreground">{{ radiusDisplay }}</span>
        </div>
        <OptionPicker
          :model-value="radiusPreset"
          :options="radiusOptions"
          @update:model-value="(v) => setTheme({ radius: v as RadiusValue })"
        />
        <div class="flex items-center gap-3 pt-1">
          <Slider
            :model-value="exactRadius"
            :min="0"
            :max="2"
            :step="0.05"
            class="flex-1"
            aria-label="Exact radius in rem"
            @update:model-value="
              (v: number) => setTheme({ radiusValue: Math.round(v * 100) / 100 })
            "
          />
          <span class="w-14 text-right font-mono text-xs text-muted-foreground">
            {{ exactRadius.toFixed(2) }}rem
          </span>
        </div>
      </div>

      <OptionPicker
        id="setting-shadow"
        :model-value="config.theme.custom?.shadows ? '' : config.theme.shadowIntensity"
        :options="SHADOW_INTENSITIES.map((s) => ({ name: s.name, label: s.label }))"
        label="Shadow"
        @update:model-value="(v) => setTheme({ shadowIntensity: v as ShadowIntensity })"
      />
    </ConfigSection>

    <ConfigSection title="Focus ring" :default-open="false">
      <OptionPicker
        id="setting-focus-width"
        :model-value="config.components.focusRingWidth"
        :options="ringWidths"
        label="Width"
        @update:model-value="
          (v) => setComponents({ focusRingWidth: v as ComponentsConfig['focusRingWidth'] })
        "
      />
      <OptionPicker
        id="setting-focus-offset"
        :model-value="config.components.focusRingOffset"
        :options="ringOffsets"
        label="Offset"
        @update:model-value="
          (v) => setComponents({ focusRingOffset: v as ComponentsConfig['focusRingOffset'] })
        "
      />
    </ConfigSection>
  </div>
</template>
