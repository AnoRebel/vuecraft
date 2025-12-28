<script setup lang="ts">
import { inject, computed } from 'vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
  value: string
}

const props = defineProps<Props>()

const tabs = inject<{
  activeTab: Ref<string>
  setActiveTab: (value: string) => void
}>('tabs')

const isActive = computed(() => tabs?.activeTab.value === props.value)

function handleClick() {
  tabs?.setActiveTab(props.value)
}
</script>

<template>
  <button
    type="button"
    role="tab"
    :aria-selected="isActive"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      { 'bg-background text-foreground shadow': isActive },
      props.class
    )"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
