<script setup lang="ts">
import { computed } from 'vue'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { formatKey } = useKeyboardShortcuts()

const isMac = computed(() => {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
})

const shortcuts = [
  { category: 'General', items: [
    { key: 'Ctrl+S', description: 'Save configuration' },
    { key: 'Ctrl+D', description: 'Toggle dark mode' },
    { key: '?', description: 'Show keyboard shortcuts' },
  ]},
  { category: 'Editing', items: [
    { key: 'Ctrl+Z', description: 'Undo' },
    { key: 'Ctrl+Shift+Z', description: 'Redo' },
    { key: 'Ctrl+R', description: 'Randomize theme' },
  ]},
  { category: 'Export', items: [
    { key: 'Ctrl+E', description: 'Open export dialog' },
    { key: 'Ctrl+I', description: 'Open import dialog' },
  ]},
  { category: 'Navigation', items: [
    { key: '1-5', description: 'Switch preview template' },
    { key: 'Escape', description: 'Close dialogs' },
  ]},
]
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
      </DialogHeader>

      <div class="space-y-6 mt-4">
        <div v-for="section in shortcuts" :key="section.category">
          <h4 class="text-xs font-medium text-muted-foreground uppercase mb-2">
            {{ section.category }}
          </h4>
          <div class="space-y-2">
            <div
              v-for="shortcut in section.items"
              :key="shortcut.key"
              class="flex items-center justify-between py-1"
            >
              <span class="text-sm">{{ shortcut.description }}</span>
              <kbd
                class="px-2 py-1 text-xs font-mono bg-muted rounded border border-border"
              >
                {{ formatKey(shortcut.key) }}
              </kbd>
            </div>
          </div>
        </div>

        <p class="text-xs text-muted-foreground">
          {{ isMac ? '⌘ = Command, ⌥ = Option, ⇧ = Shift' : 'Ctrl = Control' }}
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
