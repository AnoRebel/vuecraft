<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const percentage = computed(() => {
  return ((value.value - props.min) / (props.max - props.min)) * 100
})
</script>

<template>
  <div :class="cn('relative flex w-full touch-none select-none items-center', props.class)">
    <div class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <div
        class="absolute h-full bg-primary"
        :style="{ width: `${percentage}%` }"
      />
    </div>
    <input
      v-model.number="value"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="absolute inset-0 w-full cursor-pointer opacity-0"
    />
    <div
      class="absolute block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      :style="{ left: `calc(${percentage}% - 8px)` }"
    />
  </div>
</template>
