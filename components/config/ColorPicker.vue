<script setup lang="ts">
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
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

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
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium">{{ label }}</label>
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
    <p class="text-xs text-muted-foreground">
      {{ options.find((o) => o.name === modelValue)?.label ?? 'Select a color' }}
    </p>
  </div>
</template>
