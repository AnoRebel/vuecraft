<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    rows?: number
    class?: HTMLAttributes['class']
    id?: string
  }>(),
  { modelValue: '', placeholder: '', rows: 3, class: '', id: undefined }
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <textarea
    :id="props.id"
    data-slot="input"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :rows="props.rows"
    :class="
      cn(
        'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
