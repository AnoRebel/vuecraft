<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
  content: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  side: 'top',
  delay: 200,
})

const isVisible = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

function show() {
  timeout = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

function hide() {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  isVisible.value = false
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
}
</script>

<template>
  <div
    class="relative inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
  >
    <slot />
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible"
        role="tooltip"
        :class="
          cn(
            'absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95',
            positionClasses[side],
            props.class
          )
        "
      >
        {{ content }}
      </div>
    </Transition>
  </div>
</template>
