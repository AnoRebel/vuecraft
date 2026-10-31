<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { RadioGroupRoot } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ modelValue?: string; class?: HTMLAttributes['class'] }>(),
  {
    modelValue: undefined,
    class: '',
  }
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <RadioGroupRoot
    :model-value="props.modelValue"
    :class="cn('grid gap-2', props.class)"
    @update:model-value="(v) => emit('update:modelValue', String(v))"
  >
    <slot />
  </RadioGroupRoot>
</template>
