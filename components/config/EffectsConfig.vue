<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import ConfigSection from './ConfigSection.vue'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'
import { Switch } from '~/components/ui/switch'
import {
  applyEffects,
  DEFAULT_EFFECTS,
  EFFECTS_STORAGE_KEY,
  type EffectsSettings,
} from '~/utils/effects'

const defaultSettings: EffectsSettings = { ...DEFAULT_EFFECTS }

const settings = useStorage<EffectsSettings>(EFFECTS_STORAGE_KEY, defaultSettings, undefined, {
  mergeDefaults: true,
})

watch(settings, (value) => applyEffects(value), { deep: true })
onMounted(() => applyEffects(settings.value))

// Reset to defaults
function resetEffects() {
  settings.value = { ...defaultSettings }
}

// Preset effects
const presets = [
  { name: 'none', label: 'None', settings: { ...defaultSettings } },
  {
    name: 'subtle',
    label: 'Subtle Glass',
    settings: {
      headerTransparency: 90,
      sidebarTransparency: 95,
      cardTransparency: 100,
      blurAmount: 4,
      enableBlur: true,
      enableGlassmorphism: false,
    },
  },
  {
    name: 'glass',
    label: 'Glassmorphism',
    settings: {
      headerTransparency: 70,
      sidebarTransparency: 75,
      cardTransparency: 85,
      blurAmount: 12,
      enableBlur: true,
      enableGlassmorphism: true,
    },
  },
  {
    name: 'frosted',
    label: 'Frosted',
    settings: {
      headerTransparency: 80,
      sidebarTransparency: 80,
      cardTransparency: 90,
      blurAmount: 20,
      enableBlur: true,
      enableGlassmorphism: false,
    },
  },
]

function applyPreset(preset: (typeof presets)[0]) {
  settings.value = { ...preset.settings }
}
</script>

<template>
  <ConfigSection
    title="Builder effects"
    description="Transparency, blur and glass for the builder interface."
    tour-id="effects-config-section"
    :default-open="false"
  >
    <div id="setting-effects-builder" class="space-y-5">
      <!-- Presets -->
      <div class="space-y-2">
        <Label>Presets</Label>
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="preset in presets"
            :key="preset.name"
            variant="outline"
            size="sm"
            class="justify-start"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </Button>
        </div>
      </div>

      <!-- Enable Toggles -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Label class="text-sm">Enable Blur</Label>
          <Switch v-model="settings.enableBlur" />
        </div>
        <div class="flex items-center justify-between">
          <Label class="text-sm">Glassmorphism</Label>
          <Switch v-model="settings.enableGlassmorphism" />
        </div>
      </div>

      <!-- Blur Amount -->
      <div v-if="settings.enableBlur" class="space-y-2">
        <div class="flex items-center justify-between">
          <Label class="text-sm">Blur Amount</Label>
          <span class="text-xs text-muted-foreground">{{ settings.blurAmount }}px</span>
        </div>
        <Slider v-model="settings.blurAmount" :min="0" :max="30" :step="1" class="w-full" />
      </div>

      <!-- Transparency Controls -->
      <div class="space-y-4">
        <Label class="text-sm font-medium">Transparency</Label>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Header</span>
            <span class="text-xs text-muted-foreground">{{ settings.headerTransparency }}%</span>
          </div>
          <Slider
            v-model="settings.headerTransparency"
            :min="0"
            :max="100"
            :step="5"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Sidebar</span>
            <span class="text-xs text-muted-foreground">{{ settings.sidebarTransparency }}%</span>
          </div>
          <Slider
            v-model="settings.sidebarTransparency"
            :min="0"
            :max="100"
            :step="5"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground">Cards</span>
            <span class="text-xs text-muted-foreground">{{ settings.cardTransparency }}%</span>
          </div>
          <Slider
            v-model="settings.cardTransparency"
            :min="0"
            :max="100"
            :step="5"
            class="w-full"
          />
        </div>
      </div>

      <!-- Reset Button -->
      <Button variant="ghost" size="sm" class="w-full" @click="resetEffects">
        <Icon name="lucide:undo-2" class="h-4 w-4 mr-2" />
        Reset Effects
      </Button>
    </div>
  </ConfigSection>
</template>
