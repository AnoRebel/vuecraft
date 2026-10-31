<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import ColorPicker from './ColorPicker.vue'
import OptionPicker from './OptionPicker.vue'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'
import { Input } from '~/components/ui/input'
import type { BaseColorName, RadiusValue, ThemeName } from '~/types/config'

const { config, setTheme } = useDesignSystem()
const { BASE_COLORS, ACCENT_THEMES, RADIUS_OPTIONS, SHADOW_INTENSITIES } = useConfigOptions()

// Group accent themes
const neutralThemes = ACCENT_THEMES.filter((t) =>
  ['neutral', 'stone', 'zinc', 'gray', 'slate'].includes(t.name)
)
const vibrantThemes = ACCENT_THEMES.filter(
  (t) => !['neutral', 'stone', 'zinc', 'gray', 'slate'].includes(t.name)
)

// Custom primary colour (stored in the configuration)
const customColorHex = ref('#6366f1')
const isCustomColorActive = computed(() => !!config.theme.customPrimary)

watch(
  () => config.theme.customPrimary,
  (value) => {
    if (value && /^#[0-9a-f]{6}$/i.test(value)) customColorHex.value = value
  },
  { immediate: true }
)

function selectAccentTheme(themeName: string) {
  setTheme({ accentTheme: themeName as ThemeName })
}

function selectCustomColor() {
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(customColorHex.value)) {
    setTheme({ customPrimary: customColorHex.value })
  }
}

function clearCustomColor() {
  setTheme({ customPrimary: null })
}

// Exact radius (rem) - stored as radiusValue so in-between values survive
const radiusPresetToValue: Record<string, number> = {
  none: 0,
  sm: 0.25,
  md: 0.5,
  lg: 0.75,
  xl: 1,
  full: 2,
}

const customRadiusValue = computed(() => {
  if (typeof config.theme.radiusValue === 'number') return config.theme.radiusValue
  return radiusPresetToValue[config.theme.radius] ?? 0.5
})

function setRadiusValue(value: number) {
  setTheme({ radiusValue: Math.round(value * 100) / 100 })
}

const currentRadiusDisplay = computed(() => {
  if (typeof config.theme.radiusValue === 'number') return `${config.theme.radiusValue}rem`
  if (config.theme.custom?.radius) return config.theme.custom.radius
  const option = RADIUS_OPTIONS.find((r) => r.name === config.theme.radius)
  return option?.value ?? '0.5rem'
})
</script>

<template>
  <ConfigSection
    title="Theme"
    description="Colors, radius, and shadows"
    tour-id="theme-config-section"
  >
    <div class="space-y-6">
      <!-- Base Color -->
      <ColorPicker
        :model-value="config.theme.baseColor"
        :options="BASE_COLORS"
        label="Base Color"
        :show-format="true"
        @update:model-value="(v) => setTheme({ baseColor: v as BaseColorName })"
      />

      <!-- Accent Theme -->
      <div class="space-y-3">
        <Label>Accent Theme</Label>

        <div class="space-y-2">
          <p class="text-xs text-muted-foreground">Neutral</p>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="theme in neutralThemes"
              :key="theme.name"
              type="button"
              :title="theme.label"
              :class="[
                'h-8 w-full rounded-md border-2 transition-all hover:scale-105',
                config.theme.accentTheme === theme.name && !isCustomColorActive
                  ? 'border-foreground ring-2 ring-offset-2 ring-offset-background ring-ring'
                  : 'border-transparent',
              ]"
              :style="{ backgroundColor: theme.color }"
              @click="selectAccentTheme(theme.name)"
            >
              <span class="sr-only">{{ theme.label }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-xs text-muted-foreground">Vibrant</p>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="theme in vibrantThemes"
              :key="theme.name"
              type="button"
              :title="theme.label"
              :class="[
                'h-8 w-full rounded-md border-2 transition-all hover:scale-105',
                config.theme.accentTheme === theme.name && !isCustomColorActive
                  ? 'border-foreground ring-2 ring-offset-2 ring-offset-background ring-ring'
                  : 'border-transparent',
              ]"
              :style="{ backgroundColor: theme.color }"
              @click="selectAccentTheme(theme.name)"
            >
              <span class="sr-only">{{ theme.label }}</span>
            </button>
          </div>
        </div>

        <!-- Custom Color Picker - Always visible -->
        <div class="space-y-2 pt-2 border-t">
          <Label class="text-xs">Custom Color</Label>
          <div class="flex gap-2 items-center">
            <input
              v-model="customColorHex"
              type="color"
              :class="[
                'h-10 w-14 rounded cursor-pointer border-2 transition-all hover:scale-105',
                isCustomColorActive
                  ? 'border-foreground ring-2 ring-offset-2 ring-offset-background ring-ring'
                  : 'border-border',
              ]"
              aria-label="Custom primary color"
              @input="selectCustomColor"
            />
            <Input
              v-model="customColorHex"
              type="text"
              class="flex-1 h-8 text-xs font-mono"
              placeholder="#6366f1"
              @change="selectCustomColor"
            />
            <button
              v-if="isCustomColorActive"
              type="button"
              class="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              @click="clearCustomColor"
            >
              Clear
            </button>
          </div>
        </div>

        <p class="text-xs text-muted-foreground">
          Selected:
          {{
            isCustomColorActive
              ? `Custom (${customColorHex})`
              : ACCENT_THEMES.find((t) => t.name === config.theme.accentTheme)?.label
          }}
        </p>
      </div>

      <!-- Border Radius -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Label>Border Radius</Label>
          <span class="text-xs text-muted-foreground font-mono">{{ currentRadiusDisplay }}</span>
        </div>

        <OptionPicker
          :model-value="
            config.theme.radiusValue == null && !config.theme.custom?.radius
              ? config.theme.radius
              : ''
          "
          :options="RADIUS_OPTIONS.map((r) => ({ name: r.name, label: r.label }))"
          :columns="3"
          @update:model-value="(v) => setTheme({ radius: v as RadiusValue })"
        />

        <!-- Custom radius slider -->
        <div class="space-y-2 pt-2 border-t">
          <div class="flex items-center justify-between">
            <Label class="text-xs">Fine-tune</Label>
            <span class="text-xs text-muted-foreground">{{ customRadiusValue.toFixed(2) }}rem</span>
          </div>
          <Slider
            :model-value="customRadiusValue"
            :min="0"
            :max="2"
            :step="0.05"
            class="w-full"
            aria-label="Radius in rem"
            @update:model-value="setRadiusValue"
          />
        </div>
      </div>

      <!-- Shadow Intensity -->
      <OptionPicker
        :model-value="config.theme.shadowIntensity"
        :options="SHADOW_INTENSITIES.map((s) => ({ name: s.name, label: s.label }))"
        label="Shadow Intensity"
        :columns="4"
        @update:model-value="(v) => setTheme({ shadowIntensity: v as any })"
      />

      <!-- Menu Options -->
      <div class="grid grid-cols-2 gap-4">
        <OptionPicker
          :model-value="config.theme.menuAccent"
          :options="[
            { name: 'subtle', label: 'Subtle' },
            { name: 'bold', label: 'Bold' },
          ]"
          label="Menu Accent"
          :columns="2"
          @update:model-value="(v) => setTheme({ menuAccent: v as any })"
        />

        <OptionPicker
          :model-value="config.theme.menuColor"
          :options="[
            { name: 'default', label: 'Default' },
            { name: 'inverted', label: 'Inverted' },
          ]"
          label="Menu Color"
          :columns="2"
          @update:model-value="(v) => setTheme({ menuColor: v as any })"
        />
      </div>
    </div>
  </ConfigSection>
</template>
