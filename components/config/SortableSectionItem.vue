<script setup lang="ts">
import { ref } from 'vue'
import { makeDraggable } from '@vue-dnd-kit/core'
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
  isFirst?: boolean
  isLast?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'move', delta: number): void
}>()

const itemRef = ref<HTMLElement | null>(null)

const { isDragging } = makeDraggable(
  itemRef,
  {
    id: `section-${props.section.id}`,
    groups: ['sections'],
    dragHandle: '[data-drag-handle]',
    activation: { distance: 4 },
  },
  () => [props.index, props.source]
)
</script>

<template>
  <div
    ref="itemRef"
    role="listitem"
    class="flex items-center justify-between gap-2 py-1.5 px-2 rounded bg-background/50 transition-all"
    :class="{
      'opacity-50 scale-95 ring-2 ring-primary/50': isDragging,
    }"
  >
    <div class="flex items-center gap-2 min-w-0">
      <button
        type="button"
        data-drag-handle
        class="flex-shrink-0 text-muted-foreground cursor-grab active:cursor-grabbing touch-none p-0.5 rounded hover:bg-muted"
        :aria-label="`Drag to reorder ${section.label}`"
      >
        <Icon name="lucide:grip-vertical" class="size-3.5" />
      </button>
      <Label :for="`section-${section.id}`" class="text-xs cursor-pointer select-none truncate">
        {{ section.label }}
      </Label>
    </div>
    <div class="flex items-center gap-1 flex-shrink-0">
      <button
        type="button"
        class="p-0.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        :disabled="isFirst"
        :aria-label="`Move ${section.label} up`"
        @click="emit('move', -1)"
      >
        <Icon name="lucide:chevron-up" class="size-3.5" />
      </button>
      <button
        type="button"
        class="p-0.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        :disabled="isLast"
        :aria-label="`Move ${section.label} down`"
        @click="emit('move', 1)"
      >
        <Icon name="lucide:chevron-down" class="size-3.5" />
      </button>
      <Switch
        :id="`section-${section.id}`"
        :model-value="section.visible"
        @update:model-value="emit('toggle', section.id)"
      />
    </div>
  </div>
</template>
