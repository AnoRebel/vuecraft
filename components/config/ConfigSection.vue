<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  title: string
  description?: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true,
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="border-b border-border">
    <button
      type="button"
      class="flex w-full items-center justify-between py-4 text-left hover:bg-accent/50 transition-colors px-1 -mx-1 rounded-sm"
      @click="toggle"
    >
      <div>
        <h3 class="text-sm font-semibold">{{ title }}</h3>
        <p v-if="description" class="text-xs text-muted-foreground mt-0.5">
          {{ description }}
        </p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="cn('transition-transform duration-200', { 'rotate-180': isOpen })"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isOpen" class="pb-4 space-y-4 overflow-hidden">
        <slot />
      </div>
    </Transition>
  </div>
</template>
