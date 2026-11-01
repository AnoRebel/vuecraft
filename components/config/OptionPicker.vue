<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

interface Option {
  name: string
  label: string
  description?: string
  icon?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: Option[]
    label?: string
    /** Kept for compatibility; segmented controls size to their content */
    columns?: 2 | 3 | 4 | 5
    id?: string
  }>(),
  { label: undefined, columns: 3, id: undefined }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const selected = computed(() => props.options.find((o) => o.name === props.modelValue))
const labelId = computed(() => (props.id ? `${props.id}-label` : undefined))
</script>

<template>
  <div :id="id" class="space-y-1.5">
    <div v-if="label" class="flex items-baseline justify-between gap-2">
      <span :id="labelId" class="text-sm font-medium">{{ label }}</span>
    </div>
    <div
      role="radiogroup"
      :aria-labelledby="labelId"
      :aria-label="labelId ? undefined : label"
      class="flex flex-wrap gap-0.5 rounded-lg bg-muted p-0.5"
    >
      <button
        v-for="option in options"
        :key="option.name"
        type="button"
        role="radio"
        :aria-checked="modelValue === option.name"
        :aria-pressed="modelValue === option.name"
        :title="option.description"
        :class="
          cn(
            'inline-flex min-h-7 flex-1 basis-[calc(25%-2px)] items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 text-xs font-medium transition-colors',
            modelValue === option.name
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )
        "
        @click="emit('update:modelValue', option.name)"
      >
        <Icon v-if="option.icon" :name="option.icon" class="size-3.5" />
        {{ option.label }}
      </button>
    </div>
    <p v-if="selected?.description" class="text-xs text-muted-foreground">
      {{ selected.description }}
    </p>
  </div>
</template>
