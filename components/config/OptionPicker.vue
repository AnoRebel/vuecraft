<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Option {
  name: string
  label: string
  description?: string
  icon?: string
}

interface Props {
  modelValue: string
  options: Option[]
  label?: string
  columns?: 2 | 3 | 4 | 5
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function selectOption(name: string) {
  emit('update:modelValue', name)
}

const gridCols = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5'
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium">{{ label }}</label>
    <div :class="cn('grid gap-2', gridCols[columns])">
      <button
        v-for="option in options"
        :key="option.name"
        type="button"
        :class="cn(
          'flex flex-col items-center justify-center p-3 rounded-md border transition-all text-center',
          modelValue === option.name
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:border-primary/50 hover:bg-accent'
        )"
        @click="selectOption(option.name)"
      >
        <span class="text-sm font-medium">{{ option.label }}</span>
        <span v-if="option.description" class="text-xs text-muted-foreground mt-1">
          {{ option.description }}
        </span>
      </button>
    </div>
  </div>
</template>
