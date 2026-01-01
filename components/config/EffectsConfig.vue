<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import ConfigSection from './ConfigSection.vue'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'
import { Switch } from '~/components/ui/switch'

// Persist effects settings
interface EffectsSettings {
  headerTransparency: number
  sidebarTransparency: number
  cardTransparency: number
  blurAmount: number
  enableBlur: boolean
  enableGlassmorphism: boolean
}

const defaultSettings: EffectsSettings = {
  headerTransparency: 100,
  sidebarTransparency: 100,
  cardTransparency: 100,
  blurAmount: 8,
  enableBlur: false,
  enableGlassmorphism: false,
}

const settings = useStorage<EffectsSettings>('vuecraft-effects', defaultSettings)

// Apply effects to CSS variables
function applyEffects() {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Header transparency (0-100)
  const headerAlpha = settings.value.headerTransparency / 100
  root.style.setProperty('--effects-header-opacity', headerAlpha.toString())

  // Sidebar transparency (0-100)
  const sidebarAlpha = settings.value.sidebarTransparency / 100
  root.style.setProperty('--effects-sidebar-opacity', sidebarAlpha.toString())

  // Card transparency (0-100)
  const cardAlpha = settings.value.cardTransparency / 100
  root.style.setProperty('--effects-card-opacity', cardAlpha.toString())

  // Blur amount
  const blurValue = settings.value.enableBlur ? `${settings.value.blurAmount}px` : '0px'
  root.style.setProperty('--effects-blur', blurValue)

  // Glassmorphism effect
  if (settings.value.enableGlassmorphism) {
    root.style.setProperty('--effects-glass-bg', 'rgba(255, 255, 255, 0.1)')
    root.style.setProperty('--effects-glass-border', 'rgba(255, 255, 255, 0.2)')
    root.style.setProperty('--effects-glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.1)')
  } else {
    root.style.removeProperty('--effects-glass-bg')
    root.style.removeProperty('--effects-glass-border')
    root.style.removeProperty('--effects-glass-shadow')
  }
}

// Watch for changes and apply
watch(settings, applyEffects, { deep: true })

// Apply on mount
onMounted(applyEffects)

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
    title="Effects"
    description="Transparency, blur, and glass effects"
    tour-id="effects-config-section"
    :default-open="false"
  >
    <div class="space-y-6">
      <!-- Presets -->
      <div class="space-y-2">
        <Label>Effect Presets</Label>
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
          <Switch v-model:checked="settings.enableBlur" />
        </div>
        <div class="flex items-center justify-between">
          <Label class="text-sm">Glassmorphism</Label>
          <Switch v-model:checked="settings.enableGlassmorphism" />
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
