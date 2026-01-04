<script setup lang="ts">
import { computed } from 'vue'
import { useDraggable } from '@vue-dnd-kit/core'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'

interface SectionConfig {
  id: string
  label: string
  visible: boolean
}

const props = defineProps<{
  section: SectionConfig
  index: number
  source: SectionConfig[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()

const { elementRef, handleDragStart, isDragging } = useDraggable({
  id: `section-${props.section.id}`,
  groups: ['sections'],
  data: computed(() => ({
    source: props.source,
    index: props.index,
    section: props.section,
  })),
})

// Wrapper to handle the event type mismatch
function onDragStart(event: MouseEvent | TouchEvent) {
  handleDragStart(event as unknown as PointerEvent)
}
</script>

<template>
  <div
    ref="elementRef"
    class="flex items-center justify-between gap-2 py-1.5 px-2 rounded bg-background/50 cursor-grab active:cursor-grabbing transition-all"
    :class="{
      'opacity-50 scale-95': isDragging,
      'ring-2 ring-primary/50': isDragging,
    }"
    @mousedown="onDragStart"
    @touchstart.passive="onDragStart"
  >
    <div class="flex items-center gap-2">
      <!-- Drag handle icon -->
      <div class="flex-shrink-0 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="9" cy="5" r="1" fill="currentColor" />
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="9" cy="19" r="1" fill="currentColor" />
          <circle cx="15" cy="5" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="19" r="1" fill="currentColor" />
        </svg>
      </div>
      <Label :for="`section-${section.id}`" class="text-xs cursor-pointer select-none">
        {{ section.label }}
      </Label>
    </div>
    <Switch
      :id="`section-${section.id}`"
      :model-value="section.visible"
      @update:model-value="emit('toggle', section.id)"
    />
  </div>
</template>
