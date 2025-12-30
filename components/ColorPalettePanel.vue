<script setup lang="ts">
import { ref, watch } from 'vue'
import { useColorPaletteGenerator, type PaletteColor } from '~/composables/useColorPaletteGenerator'
import { useDesignSystem } from '~/composables/useDesignSystem'

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

const { config: _config } = useDesignSystem()

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
      <h3 class="text-sm font-medium">Color Palette Generator</h3>
      <Button variant="outline" size="sm" @click="handleRandomize">
        <Icon name="lucide:shuffle" class="h-4 w-4 mr-2" />
        Random
      </Button>
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
          @click="
            selectedHarmony = harmony.value
            generate()
          "
        >
          {{ harmony.label }}
        </Button>
      </div>
    </div>

    <!-- Generated Palette -->
    <div v-if="currentPalette" class="space-y-2">
      <label class="text-xs text-muted-foreground">Generated Colors</label>
      <div class="flex gap-1">
        <div
          v-for="(color, index) in currentPalette.colors"
          :key="index"
          class="flex-1 h-12 rounded cursor-pointer transition-transform hover:scale-105"
          :style="{ backgroundColor: color.hex }"
          :title="color.cssValue"
        />
      </div>
    </div>

    <!-- Color Scale -->
    <div v-if="colorScale.length > 0" class="space-y-2">
      <label class="text-xs text-muted-foreground">Color Scale</label>
      <div class="flex gap-0.5">
        <div
          v-for="(color, index) in colorScale"
          :key="index"
          class="flex-1 h-8 first:rounded-l last:rounded-r"
          :style="{ backgroundColor: color.hex }"
          :title="`${(index + 1) * 100}: ${color.hex}`"
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
