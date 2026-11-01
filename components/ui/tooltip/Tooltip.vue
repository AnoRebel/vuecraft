<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    content: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    delay?: number
  }>(),
  { class: '', side: 'top', delay: 300 }
)
</script>

<template>
  <TooltipProvider :delay-duration="props.delay">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="props.side"
          :side-offset="6"
          :class="
            cn(
              'vc-pop z-[200] rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md',
              props.class
            )
          "
        >
          {{ props.content }}
          <TooltipArrow class="fill-foreground" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
