<script setup lang="ts">
import { ref, watch } from 'vue'
import { useColorPaletteGenerator, type PaletteColor } from '~/composables/useColorPaletteGenerator'
import { Button } from '~/components/ui/button'
import { toast } from 'vue-sonner'
import { useDesignSystem } from '~/composables/useDesignSystem'

const { config, setTheme, setCustomColors, undo } = useDesignSystem()

const {
  baseColor,
  selectedHarmony,
  currentPalette,
  harmonyTypes,
  setBaseColor,
  generate,
  generateColorScale,
  randomize,
} = useColorPaletteGenerator()

// Initialize with current primary color
const primaryHue = ref(270)
const primaryLightness = ref(0.5)
const primaryChroma = ref(0.15)

function updateBaseColor() {
  setBaseColor({
    l: primaryLightness.value,
    c: primaryChroma.value,
    h: primaryHue.value,
  })
  generate()
}

function handleRandomize() {
  randomize()
  if (baseColor.value) {
    primaryHue.value = baseColor.value.h
    primaryLightness.value = baseColor.value.l
    primaryChroma.value = baseColor.value.c
  }
  generate()
}

function selectHarmony(value: string) {
  selectedHarmony.value = value as typeof selectedHarmony.value
  generate()
}

// Generated colours are stored in the configuration (both colour modes)
function applyColor(color: PaletteColor, target: 'primary' | 'accent' | 'secondary' = 'primary') {
  if (target === 'primary') setTheme({ customPrimary: color.cssValue })
  else setCustomColors('both', { [target]: color.cssValue })
  toast.success(`Applied as ${target}`, { action: { label: 'Undo', onClick: undo } })
}

function applyPalette() {
  const colors = currentPalette.value?.colors ?? []
  if (!colors.length) return
  setTheme({ customPrimary: colors[0]!.cssValue })
  const tokens: Record<string, string> = {}
  colors.slice(0, 5).forEach((c, i) => (tokens[`chart-${i + 1}`] = c.cssValue))
  setCustomColors('both', tokens)
  toast.success('Palette applied', { action: { label: 'Undo', onClick: undo } })
}

// Remove only the tokens this panel sets, keeping any preset palette
const PALETTE_TOKENS = [
  'accent',
  'secondary',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
]

function clearAppliedColors() {
  const current = config.theme.custom
  const keep = (set?: Record<string, string>) =>
    set
      ? Object.fromEntries(Object.entries(set).filter(([k]) => !PALETTE_TOKENS.includes(k)))
      : undefined
  const custom = current
    ? JSON.parse(
        JSON.stringify({
          ...current,
          light: keep(current.light as Record<string, string>),
          dark: keep(current.dark as Record<string, string>),
        })
      )
    : null
  setTheme({ customPrimary: null, custom })
}

// Initialize
setBaseColor({ l: 0.5, c: 0.15, h: 270 })
generate()

const colorScale = ref<PaletteColor[]>([])

watch(
  baseColor,
  (newColor) => {
    if (newColor) {
      colorScale.value = generateColorScale(newColor, 9)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="handleRandomize">
          <Icon name="lucide:shuffle" class="h-4 w-4 mr-2" />
          Random
        </Button>
        <Button variant="ghost" size="sm" @click="clearAppliedColors">
          <Icon name="lucide:undo-2" class="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>

    <!-- Base Color Controls -->
    <div class="space-y-3">
      <div>
        <label class="text-xs text-muted-foreground">Hue ({{ Math.round(primaryHue) }}°)</label>
        <input
          v-model.number="primaryHue"
          type="range"
          min="0"
          max="360"
          class="w-full h-2 rounded-full appearance-none cursor-pointer"
          style="
            background: linear-gradient(
              to right,
              oklch(0.6 0.2 0),
              oklch(0.6 0.2 60),
              oklch(0.6 0.2 120),
              oklch(0.6 0.2 180),
              oklch(0.6 0.2 240),
              oklch(0.6 0.2 300),
              oklch(0.6 0.2 360)
            );
          "
          @input="updateBaseColor"
        />
      </div>

      <div>
        <label class="text-xs text-muted-foreground"
          >Lightness ({{ Math.round(primaryLightness * 100) }}%)</label
        >
        <input
          v-model.number="primaryLightness"
          type="range"
          min="0.1"
          max="0.9"
          step="0.01"
          class="w-full h-2 bg-gradient-to-r from-gray-900 to-white rounded-full appearance-none cursor-pointer"
          @input="updateBaseColor"
        />
      </div>

      <div>
        <label class="text-xs text-muted-foreground"
          >Chroma ({{ Math.round(primaryChroma * 100) }}%)</label
        >
        <input
          v-model.number="primaryChroma"
          type="range"
          min="0"
          max="0.3"
          step="0.01"
          class="w-full h-2 bg-gradient-to-r from-gray-400 to-purple-500 rounded-full appearance-none cursor-pointer"
          @input="updateBaseColor"
        />
      </div>
    </div>

    <!-- Harmony Type -->
    <div>
      <label class="text-xs text-muted-foreground mb-2 block">Harmony</label>
      <div class="grid grid-cols-2 gap-2">
        <Button
          v-for="harmony in harmonyTypes"
          :key="harmony.value"
          :variant="selectedHarmony === harmony.value ? 'default' : 'outline'"
          size="sm"
          class="text-xs justify-start"
          @click="selectHarmony(harmony.value)"
        >
          {{ harmony.label }}
        </Button>
      </div>
    </div>

    <!-- Generated Palette -->
    <div v-if="currentPalette" class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-xs text-muted-foreground">Generated Colors</label>
        <Button variant="default" size="sm" class="h-6 px-2 text-xs" @click="applyPalette">
          <Icon name="lucide:check" class="h-3 w-3 mr-1" />
          Apply All
        </Button>
      </div>
      <div class="flex gap-1">
        <div v-for="(color, index) in currentPalette.colors" :key="index" class="flex-1 space-y-1">
          <button
            type="button"
            class="w-full h-12 rounded cursor-pointer transition-transform hover:scale-105 hover:ring-2 hover:ring-ring hover:ring-offset-2"
            :style="{ backgroundColor: color.hex }"
            :title="`Click to apply as primary: ${color.cssValue}`"
            @click="applyColor(color, 'primary')"
          />
          <div class="flex gap-0.5">
            <button
              type="button"
              class="flex-1 h-4 rounded-sm text-[8px] bg-muted/50 hover:bg-muted flex items-center justify-center"
              title="Apply as accent"
              @click="applyColor(color, 'accent')"
            >
              A
            </button>
            <button
              type="button"
              class="flex-1 h-4 rounded-sm text-[8px] bg-muted/50 hover:bg-muted flex items-center justify-center"
              title="Apply as secondary"
              @click="applyColor(color, 'secondary')"
            >
              S
            </button>
          </div>
        </div>
      </div>
      <p class="text-xs text-muted-foreground text-center">
        Click color to apply as primary, A for accent, S for secondary
      </p>
    </div>

    <!-- Color Scale -->
    <div v-if="colorScale.length > 0" class="space-y-2">
      <label class="text-xs text-muted-foreground">Color Scale</label>
      <div class="flex gap-0.5">
        <button
          v-for="(color, index) in colorScale"
          :key="index"
          type="button"
          class="flex-1 h-8 first:rounded-l last:rounded-r cursor-pointer hover:ring-1 hover:ring-ring"
          :style="{ backgroundColor: color.hex }"
          :title="`${(index + 1) * 100}: ${color.hex} - Click to apply`"
          @click="applyColor(color, 'primary')"
        />
      </div>
      <div class="flex justify-between text-xs text-muted-foreground">
        <span>100</span>
        <span>500</span>
        <span>900</span>
      </div>
    </div>
  </div>
</template>
