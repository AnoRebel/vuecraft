<script setup lang="ts">
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import ColorPicker from './ColorPicker.vue'
import OptionPicker from './OptionPicker.vue'
import { Label } from '~/components/ui/label'

const { config, setTheme } = useDesignSystem()
const { BASE_COLORS, ACCENT_THEMES, RADIUS_OPTIONS, SHADOW_INTENSITIES } = useConfigOptions()

// Group accent themes
const neutralThemes = ACCENT_THEMES.filter(t =>
  ['neutral', 'stone', 'zinc', 'gray', 'slate'].includes(t.name)
)
const vibrantThemes = ACCENT_THEMES.filter(t =>
  !['neutral', 'stone', 'zinc', 'gray', 'slate'].includes(t.name)
)
</script>

<template>
  <ConfigSection title="Theme" description="Colors, radius, and shadows">
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
                  : 'border-transparent'
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
                  : 'border-transparent'
              ]"
              :style="{ backgroundColor: theme.color }"
              @click="setTheme({ accentTheme: theme.name as any })"
            >
              <span class="sr-only">{{ theme.label }}</span>
            </button>
          </div>
        </div>

        <p class="text-xs text-muted-foreground">
          Selected: {{ ACCENT_THEMES.find(t => t.name === config.theme.accentTheme)?.label }}
        </p>
      </div>

      <!-- Border Radius -->
      <OptionPicker
        :model-value="config.theme.radius"
        :options="RADIUS_OPTIONS.map(r => ({ name: r.name, label: r.label }))"
        label="Border Radius"
        :columns="3"
        @update:model-value="(v) => setTheme({ radius: v as any })"
      />

      <!-- Shadow Intensity -->
      <OptionPicker
        :model-value="config.theme.shadowIntensity"
        :options="SHADOW_INTENSITIES.map(s => ({ name: s.name, label: s.label }))"
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
            { name: 'bold', label: 'Bold' }
          ]"
          label="Menu Accent"
          :columns="2"
          @update:model-value="(v) => setTheme({ menuAccent: v as any })"
        />

        <OptionPicker
          :model-value="config.theme.menuColor"
          :options="[
            { name: 'default', label: 'Default' },
            { name: 'inverted', label: 'Inverted' }
          ]"
          label="Menu Color"
          :columns="2"
          @update:model-value="(v) => setTheme({ menuColor: v as any })"
        />
      </div>
    </div>
  </ConfigSection>
</template>
