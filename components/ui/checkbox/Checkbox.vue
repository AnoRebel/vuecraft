<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    id?: string
    class?: HTMLAttributes['class']
  }>(),
  { modelValue: false, disabled: false, id: undefined, class: '' }
)
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <CheckboxRoot
    :id="props.id"
    data-slot="checkbox"
    :model-value="props.modelValue"
    :disabled="props.disabled"
    :class="
      cn(
        'peer inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        props.class
      )
    "
    @update:model-value="(v) => emit('update:modelValue', v === true)"
  >
    <CheckboxIndicator class="flex items-center justify-center">
      <Icon name="lucide:check" class="size-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
