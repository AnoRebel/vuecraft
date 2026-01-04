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

// Use computed to ensure the DnD library always has the latest reference
const sectionsRef = computed(() => props.sections)

const { elementRef } = useDroppable({
  groups: ['sections'],
  data: computed(() => ({
    source: sectionsRef.value,
  })),
  events: {
    onDrop(dndStore) {
      // Apply the transfer operation (modifies the source array in place)
      DnDOperations.applyTransfer(dndStore)

      // Emit the reordered sections with deep copy to ensure reactivity
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
