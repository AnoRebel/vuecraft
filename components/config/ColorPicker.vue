<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '~/lib/utils'

interface ColorOption {
  name: string
  label: string
  color?: string
  hue?: number
}

interface Props {
  modelValue: string
  options: readonly ColorOption[]
  label?: string
  showFormat?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFormat: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Color format options
type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex'
const colorFormat = ref<ColorFormat>('oklch')
const formatOptions: { value: ColorFormat; label: string }[] = [
  { value: 'oklch', label: 'OKLCH' },
  { value: 'hsl', label: 'HSL' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hex', label: 'HEX' },
]

function selectColor(name: string) {
  emit('update:modelValue', name)
}

function getColorStyle(option: ColorOption): string {
  if (option.color) {
    return option.color
  }
  if (option.hue !== undefined) {
    return `oklch(0.6 0.15 ${option.hue})`
  }
  return 'oklch(0.5 0.1 0)'
}

// Convert oklch to different formats for display
function oklchToHsl(l: number, c: number, h: number): string {
  // Simplified conversion - in practice you'd use a proper color library
  const saturation = Math.min(100, c * 500)
  const lightness = l * 100
  return `hsl(${Math.round(h)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`
}

function oklchToRgb(l: number, c: number, h: number): string {
  // Simplified conversion for display purposes
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const b = c * Math.sin(hRad)

  // Simplified Lab to RGB (approximate)
  let r = l + 0.3963377774 * a + 0.2158037573 * b
  let g = l - 0.1055613458 * a - 0.0638541728 * b
  let bl = l - 0.0894841775 * a - 1.291485548 * b

  // Apply gamma correction (simplified)
  r = Math.round(Math.max(0, Math.min(1, r ** 3)) * 255)
  g = Math.round(Math.max(0, Math.min(1, g ** 3)) * 255)
  bl = Math.round(Math.max(0, Math.min(1, bl ** 3)) * 255)

  return `rgb(${r}, ${g}, ${bl})`
}

function oklchToHex(l: number, c: number, h: number): string {
  const rgb = oklchToRgb(l, c, h)
  const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/)
  if (!match) return '#000000'
  const r = parseInt(match[1]!).toString(16).padStart(2, '0')
  const g = parseInt(match[2]!).toString(16).padStart(2, '0')
  const b = parseInt(match[3]!).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

// Get formatted color value for display
const formattedColor = computed(() => {
  const option = props.options.find((o) => o.name === props.modelValue)
  if (!option) return ''

  const l = 0.6
  const c = 0.15
  const h = option.hue ?? 0

  switch (colorFormat.value) {
    case 'oklch':
      return `oklch(${l} ${c} ${h})`
    case 'hsl':
      return oklchToHsl(l, c, h)
    case 'rgb':
      return oklchToRgb(l, c, h)
    case 'hex':
      return oklchToHex(l, c, h)
    default:
      return `oklch(${l} ${c} ${h})`
  }
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label v-if="label" class="text-sm font-medium">{{ label }}</label>
      <!-- Color Format Toggle -->
      <div v-if="showFormat" class="flex gap-0.5 bg-muted rounded p-0.5">
        <button
          v-for="format in formatOptions"
          :key="format.value"
          type="button"
          :class="[
            'px-1.5 py-0.5 text-[10px] rounded transition-colors',
            colorFormat === format.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="colorFormat = format.value"
        >
          {{ format.label }}
        </button>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="option in options"
        :key="option.name"
        type="button"
        :title="option.label"
        :class="
          cn(
            'h-8 w-full rounded-md border-2 transition-all hover:scale-105',
            modelValue === option.name
              ? 'border-foreground ring-2 ring-offset-2 ring-offset-background ring-ring'
              : 'border-transparent'
          )
        "
        :style="{ backgroundColor: getColorStyle(option) }"
        @click="selectColor(option.name)"
      >
        <span class="sr-only">{{ option.label }}</span>
      </button>
    </div>
    <div class="flex items-center justify-between text-xs text-muted-foreground">
      <span>{{ options.find((o) => o.name === modelValue)?.label ?? 'Select a color' }}</span>
      <code
        v-if="showFormat && formattedColor"
        class="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded"
      >
        {{ formattedColor }}
      </code>
    </div>
  </div>
</template>
