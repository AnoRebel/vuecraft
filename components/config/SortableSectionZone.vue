<script setup lang="ts">
import { ref } from 'vue'
import { makeDroppable } from '@vue-dnd-kit/core'
import type { IDragEvent } from '@vue-dnd-kit/core'
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

const zoneRef = ref<HTMLElement | null>(null)

const { isDragOver } = makeDroppable(
  zoneRef,
  {
    groups: ['sections'],
    events: {
      onDrop(event: IDragEvent) {
        const result = event.helpers.suggestSort('vertical')
        if (!result) return
        emit(
          'reorder',
          (result.targetItems as SectionConfig[]).map((s) => ({ ...s }))
        )
      },
    },
  },
  () => props.sections
)

// Keyboard / button based reordering (accessible fallback to drag and drop)
function moveSection(index: number, delta: number) {
  const target = index + delta
  if (target < 0 || target >= props.sections.length) return
  const next = props.sections.map((s) => ({ ...s }))
  const [moved] = next.splice(index, 1)
  if (moved) next.splice(target, 0, moved)
  emit('reorder', next)
}
</script>

<template>
  <div
    ref="zoneRef"
    class="space-y-1.5 min-h-[100px] rounded-md transition-colors"
    :class="{ 'bg-primary/5': isDragOver }"
    role="list"
    aria-label="Preview sections"
  >
    <SortableSectionItem
      v-for="(section, index) in sections"
      :key="section.id"
      :section="section"
      :index="index"
      :source="sections"
      :is-first="index === 0"
      :is-last="index === sections.length - 1"
      @toggle="(id: string) => emit('toggle', id)"
      @move="(delta: number) => moveSection(index, delta)"
    />
  </div>
</template>
