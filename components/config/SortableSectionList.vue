<script setup lang="ts">
import { computed } from 'vue'
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

// Make data reactive so it updates when sections change
const droppableData = computed(() => ({
  source: props.sections,
}))

const { elementRef } = useDroppable({
  groups: ['sections'],
  data: droppableData,
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
