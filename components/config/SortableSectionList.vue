<script setup lang="ts">
import { useDroppable, DnDOperations } from '@vue-dnd-kit/core'
import SortableSectionItem from './SortableSectionItem.vue'

interface SectionConfig {
  id: string
  label: string
  visible: boolean
}

const props = defineProps<{
  sections: SectionConfig[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'reorder', sections: SectionConfig[]): void
}>()

const { elementRef } = useDroppable({
  groups: ['sections'],
  data: {
    source: props.sections,
  },
  events: {
    onDrop(dndStore) {
      // Apply the transfer operation to reorder items
      DnDOperations.applyTransfer(dndStore)
      // Create deep copy to emit and ensure proper reactivity
      emit(
        'reorder',
        props.sections.map((s) => ({ ...s }))
      )
    },
  },
})

function handleToggle(id: string) {
  emit('toggle', id)
}
</script>

<template>
  <div ref="elementRef" class="space-y-1.5 min-h-[100px]">
    <SortableSectionItem
      v-for="(section, index) in sections"
      :key="section.id"
      :section="section"
      :index="index"
      :source="sections"
      @toggle="handleToggle"
    />
  </div>
</template>
