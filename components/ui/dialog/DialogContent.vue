<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes['class']; showClose?: boolean }>(),
  {
    class: '',
    showClose: true,
  }
)
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="vc-overlay fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px]" />
    <DialogContent
      data-slot="dialog-content"
      :class="
        cn(
          'vc-dialog fixed left-1/2 top-1/2 z-[100] grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-4 sm:p-6 shadow-lg max-h-[calc(100dvh-2rem)] overflow-y-auto focus:outline-none',
          props.class
        )
      "
    >
      <slot />
      <DialogClose
        v-if="showClose"
        class="absolute right-3 top-3 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
        aria-label="Close"
      >
        <Icon name="lucide:x" class="size-4" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
