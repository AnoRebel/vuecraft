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
</script>

<template>
  <div
    v-if="isActive"
    role="tabpanel"
    :class="
      cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
