<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { cn } from '~/lib/utils'

interface Option {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    modelValue?: string
    options: Option[]
    placeholder?: string
    disabled?: boolean
    id?: string
    ariaLabel?: string
  }>(),
  {
    class: '',
    modelValue: '',
    placeholder: 'Select an option',
    disabled: false,
    id: undefined,
    ariaLabel: undefined,
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <SelectRoot
    :model-value="props.modelValue || undefined"
    :disabled="props.disabled"
    @update:model-value="(v) => emit('update:modelValue', String(v))"
  >
    <SelectTrigger
      :id="props.id"
      data-slot="select"
      :aria-label="props.ariaLabel"
      :class="
        cn(
          'flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:truncate',
          props.class
        )
      "
    >
      <SelectValue :placeholder="props.placeholder" />
      <Icon name="lucide:chevron-down" class="size-4 shrink-0 opacity-50" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="vc-pop relative z-[200] max-h-[min(24rem,var(--reka-select-content-available-height))] w-[var(--reka-select-trigger-width)] min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
      >
        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in props.options"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <span class="flex flex-col">
              <SelectItemText>{{ option.label }}</SelectItemText>
              <span v-if="option.description" class="text-xs text-muted-foreground">
                {{ option.description }}
              </span>
            </span>
            <SelectItemIndicator class="absolute right-2 inline-flex items-center">
              <Icon name="lucide:check" class="size-4" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
