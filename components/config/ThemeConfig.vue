<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import ColorPicker from './ColorPicker.vue'
import OptionPicker from './OptionPicker.vue'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'

const { config, setTheme } = useDesignSystem()
const { BASE_COLORS, ACCENT_THEMES, RADIUS_OPTIONS, SHADOW_INTENSITIES } = useConfigOptions()

// Group accent themes
const neutralThemes = ACCENT_THEMES.filter((t) =>
  ['neutral', 'stone', 'zinc', 'gray', 'slate'].includes(t.name)
)
const vibrantThemes = ACCENT_THEMES.filter(
  (t) => !['neutral', 'stone', 'zinc', 'gray', 'slate'].includes(t.name)
)

// Custom radius value support
const showCustomRadius = ref(false)
const customRadiusValue = ref(0.5)

// Map preset to slider value
const radiusPresetToValue: Record<string, number> = {
  none: 0,
  sm: 0.25,
  md: 0.5,
  lg: 0.75,
  xl: 1,
  full: 1.5,
}

// Initialize custom radius from current preset
watch(
  () => config.theme.radius,
  (preset) => {
    if (!showCustomRadius.value) {
      customRadiusValue.value = radiusPresetToValue[preset] ?? 0.5
    }
  },
  { immediate: true }
)

// Get closest preset from custom value
function getClosestPreset(value: number): string {
  const presets = Object.entries(radiusPresetToValue)
  let closest = presets[0]!
  let minDiff = Math.abs(value - closest[1])

  for (const [name, presetValue] of presets) {
    const diff = Math.abs(value - presetValue)
    if (diff < minDiff) {
      minDiff = diff
      closest = [name, presetValue]
    }
  }

  return closest[0]
}

// Current radius display value
const currentRadiusDisplay = computed(() => {
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
        @update:model-value="(v) => setTheme({ baseColor: v as any })"
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
                config.theme.accentTheme === theme.name
                  ? 'border-foreground ring-2 ring-offset-2 ring-offset-background ring-ring'
                  : 'border-transparent',
              ]"
              :style="{ backgroundColor: theme.color }"
              @click="setTheme({ accentTheme: theme.name as any })"
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
                config.theme.accentTheme === theme.name
                  ? 'border-foreground ring-2 ring-offset-2 ring-offset-background ring-ring'
                  : 'border-transparent',
              ]"
              :style="{ backgroundColor: theme.color }"
              @click="setTheme({ accentTheme: theme.name as any })"
            >
              <span class="sr-only">{{ theme.label }}</span>
            </button>
          </div>
        </div>

        <p class="text-xs text-muted-foreground">
          Selected: {{ ACCENT_THEMES.find((t) => t.name === config.theme.accentTheme)?.label }}
        </p>
      </div>

      <!-- Border Radius -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Label>Border Radius</Label>
          <span class="text-xs text-muted-foreground font-mono">{{ currentRadiusDisplay }}</span>
        </div>

        <OptionPicker
          :model-value="config.theme.radius"
          :options="RADIUS_OPTIONS.map((r) => ({ name: r.name, label: r.label }))"
          :columns="3"
          @update:model-value="(v) => setTheme({ radius: v as any })"
        />

        <!-- Custom radius slider -->
        <div class="space-y-2 pt-2 border-t">
          <div class="flex items-center justify-between">
            <Label class="text-xs">Fine-tune</Label>
            <span class="text-xs text-muted-foreground">{{ customRadiusValue.toFixed(2) }}rem</span>
          </div>
          <Slider
            v-model="customRadiusValue"
            :min="0"
            :max="2"
            :step="0.05"
            class="w-full"
            @update:model-value="
              (v: number) => {
                customRadiusValue = v
                setTheme({ radius: getClosestPreset(v) as any })
              }
            "
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
