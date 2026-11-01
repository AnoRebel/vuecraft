<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsRoot } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes['class']; defaultValue?: string; modelValue?: string }>(),
  { class: '', defaultValue: undefined, modelValue: undefined }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <TabsRoot
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :class="cn('flex flex-col gap-2', props.class)"
    @update:model-value="(v) => emit('update:modelValue', String(v))"
  >
    <slot />
  </TabsRoot>
</template>
