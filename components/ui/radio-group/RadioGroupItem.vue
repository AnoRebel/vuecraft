<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ value: string; id?: string; class?: HTMLAttributes['class'] }>(),
  {
    id: undefined,
    class: '',
  }
)
</script>

<template>
  <RadioGroupItem
    :id="props.id"
    :value="props.value"
    data-slot="radio"
    :class="
      cn(
        'inline-flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border border-input text-primary shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=checked]:border-primary',
        props.class
      )
    "
  >
    <RadioGroupIndicator class="size-2 rounded-full bg-primary" />
  </RadioGroupItem>
</template>
