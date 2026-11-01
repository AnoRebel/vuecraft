<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    items: { value: string; title: string; content: string }[]
    class?: HTMLAttributes['class']
    defaultValue?: string
  }>(),
  { class: '', defaultValue: undefined }
)
</script>

<template>
  <AccordionRoot
    type="single"
    collapsible
    :default-value="props.defaultValue"
    :class="cn('w-full', props.class)"
  >
    <AccordionItem
      v-for="item in props.items"
      :key="item.value"
      :value="item.value"
      class="border-b"
    >
      <AccordionHeader class="flex">
        <AccordionTrigger
          class="group flex flex-1 items-center justify-between gap-4 rounded-md py-3 text-left text-sm font-medium transition-all hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {{ item.title }}
          <Icon
            name="lucide:chevron-down"
            class="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="overflow-hidden text-sm text-muted-foreground">
        <div class="pb-3">{{ item.content }}</div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
