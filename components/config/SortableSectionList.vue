<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core'
import SortableSectionZone from './SortableSectionZone.vue'

interface SectionConfig {
  id: string
  label: string
  visible: boolean
}

defineProps<{
  sections: SectionConfig[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'reorder', sections: SectionConfig[]): void
}>()
</script>

<template>
  <DnDProvider>
    <SortableSectionZone
      :sections="sections"
      @toggle="(id: string) => emit('toggle', id)"
      @reorder="(next: SectionConfig[]) => emit('reorder', next)"
    />
  </DnDProvider>
</template>
