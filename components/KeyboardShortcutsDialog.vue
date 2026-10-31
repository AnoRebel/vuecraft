<script setup lang="ts">
import { computed } from 'vue'
import { SHORTCUTS, formatShortcut, isMacPlatform } from '~/composables/useKeyboardShortcuts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const sections = computed(() => {
  const groups = new Map<string, typeof SHORTCUTS>()
  for (const s of SHORTCUTS) groups.set(s.category, [...(groups.get(s.category) ?? []), s])
  return [...groups.entries()]
})
const isMac = computed(() => isMacPlatform())
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Keyboard shortcuts</DialogTitle>
        <DialogDescription
          >Single-key shortcuts work when no text field is focused.</DialogDescription
        >
      </DialogHeader>

      <div class="space-y-5">
        <section v-for="[category, items] in sections" :key="category">
          <h4 class="mb-2 text-xs font-medium uppercase text-muted-foreground">{{ category }}</h4>
          <dl class="space-y-1.5">
            <div v-for="s in items" :key="s.key" class="flex items-center justify-between gap-4">
              <dt class="text-sm">{{ s.description }}</dt>
              <dd>
                <kbd class="rounded border bg-muted px-2 py-0.5 font-mono text-xs">
                  {{ formatShortcut(s.key) }}
                </kbd>
              </dd>
            </div>
          </dl>
        </section>
        <p class="text-xs text-muted-foreground">
          {{ isMac ? '⌘ Command · ⇧ Shift · ⌥ Option' : 'Ctrl Control · Shift · Alt' }}
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
