<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '~/lib/utils'
import { parseColor, rgbToHex, rgbToOklch, formatOklch } from '~/utils/colorUtils'

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
  label: undefined,
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

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): string {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let sat = 0
  if (max !== min) {
    const d = max - min
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0)
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
  }
  return `hsl(${Math.round(h)} ${Math.round(sat * 100)}% ${Math.round(l * 100)}%)`
}

// The selected colour in the chosen notation
const formattedColor = computed(() => {
  const option = props.options.find((o) => o.name === props.modelValue)
  if (!option) return ''
  const css = getColorStyle(option)
  const rgb = parseColor(css)
  if (!rgb) return css
  switch (colorFormat.value) {
    case 'oklch':
      return css.startsWith('oklch') ? css : formatOklch(rgbToOklch(rgb))
    case 'hsl':
      return rgbToHsl(rgb)
    case 'rgb':
      return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`
    case 'hex':
      return rgbToHex(rgb)
    default:
      return css
  }
})
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between gap-2">
      <span v-if="label" class="text-sm font-medium">{{ label }}</span>
      <div
        v-if="showFormat"
        class="flex gap-0.5 rounded-md bg-muted p-0.5"
        role="group"
        aria-label="Colour value format"
      >
        <button
          v-for="format in formatOptions"
          :key="format.value"
          type="button"
          :aria-pressed="colorFormat === format.value"
          :class="[
            'rounded px-1.5 py-0.5 text-[10px] transition-colors',
            colorFormat === format.value
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="colorFormat = format.value"
        >
          {{ format.label }}
        </button>
      </div>
    </div>
    <div class="flex flex-wrap gap-1.5" role="radiogroup" :aria-label="label">
      <button
        v-for="option in options"
        :key="option.name"
        type="button"
        role="radio"
        :aria-checked="modelValue === option.name"
        :aria-label="option.label"
        :title="option.label"
        :class="
          cn(
            'size-7 rounded-full border shadow-xs transition-transform hover:scale-110',
            modelValue === option.name && 'ring-2 ring-ring ring-offset-2 ring-offset-background'
          )
        "
        :style="{ backgroundColor: getColorStyle(option) }"
        @click="selectColor(option.name)"
      />
    </div>
    <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>{{ options.find((o) => o.name === modelValue)?.label ?? 'Select a color' }}</span>
      <code
        v-if="showFormat && formattedColor"
        class="truncate rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]"
      >
        {{ formattedColor }}
      </code>
    </div>
  </div>
</template>
