<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeComparison } from '~/composables/useThemeComparison'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const {
  leftTheme,
  rightTheme,
  changedProperties,
  diffSummary,
  availablePresets,
  loadCurrentTheme,
  loadPresetTheme,
  swapThemes,
  clear,
  formatValue,
} = useThemeComparison()

const { serializeConfig } = useDesignSystem()

const leftSource = ref<'current' | 'preset'>('current')
const rightSource = ref<'preset'>('preset')
const leftPreset = ref('default')
const rightPreset = ref('new-york')

function loadLeft() {
  if (leftSource.value === 'current') {
    loadCurrentTheme('left', serializeConfig())
  } else {
    loadPresetTheme('left', leftPreset.value)
  }
}

function loadRight() {
  loadPresetTheme('right', rightPreset.value)
}

// Auto-load on open
const loaded = ref(false)
if (!loaded.value) {
  loadLeft()
  loadRight()
  loaded.value = true
}

const categoryLabels: Record<string, string> = {
  theme: 'Theme',
  typography: 'Typography',
  components: 'Components',
  icons: 'Icons',
  layout: 'Layout',
}

function handleClose() {
  emit('update:open', false)
  clear()
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="max-w-4xl max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Compare Themes</DialogTitle>
      </DialogHeader>

      <div class="flex-1 overflow-hidden mt-4">
        <!-- Theme Selectors -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Left Theme</label>
            <div class="flex gap-2">
              <Button
                :variant="leftSource === 'current' ? 'default' : 'outline'"
                size="sm"
                @click="leftSource = 'current'; loadLeft()"
              >
                Current
              </Button>
              <select
                v-model="leftPreset"
                class="flex-1 h-9 rounded-md border bg-background px-3 text-sm"
                @change="leftSource = 'preset'; loadLeft()"
              >
                <option v-for="preset in availablePresets" :key="preset.name" :value="preset.name">
                  {{ preset.label }}
                </option>
              </select>
            </div>
            <div v-if="leftTheme" class="text-xs text-muted-foreground">
              {{ leftTheme.name }} ({{ leftTheme.source }})
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Right Theme</label>
            <div class="flex gap-2">
              <select
                v-model="rightPreset"
                class="flex-1 h-9 rounded-md border bg-background px-3 text-sm"
                @change="loadRight()"
              >
                <option v-for="preset in availablePresets" :key="preset.name" :value="preset.name">
                  {{ preset.label }}
                </option>
              </select>
            </div>
            <div v-if="rightTheme" class="text-xs text-muted-foreground">
              {{ rightTheme.name }} ({{ rightTheme.source }})
            </div>
          </div>
        </div>

        <!-- Swap Button -->
        <div class="flex justify-center mb-4">
          <Button variant="outline" size="sm" @click="swapThemes">
            <Icon name="lucide:arrow-left-right" class="h-4 w-4 mr-2" />
            Swap
          </Button>
        </div>

        <!-- Summary -->
        <div v-if="leftTheme && rightTheme" class="mb-4 p-3 bg-muted rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ diffSummary.totalChanges }} differences found</span>
            <div class="flex gap-4 text-xs">
              <span v-for="(count, category) in diffSummary.byCategory" :key="category">
                {{ categoryLabels[category] }}: {{ count }}
              </span>
            </div>
          </div>
        </div>

        <!-- Diff Table -->
        <div v-if="leftTheme && rightTheme" class="overflow-auto max-h-[400px]">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-background border-b">
              <tr>
                <th class="text-left p-2 font-medium">Property</th>
                <th class="text-left p-2 font-medium">{{ leftTheme.name }}</th>
                <th class="text-left p-2 font-medium">{{ rightTheme.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="diff in changedProperties"
                :key="diff.path"
                class="border-b hover:bg-muted/50"
              >
                <td class="p-2">
                  <span class="font-mono text-xs">{{ diff.path }}</span>
                </td>
                <td class="p-2">
                  <span class="font-mono text-xs bg-red-500/10 text-red-700 dark:text-red-300 px-1 rounded">
                    {{ formatValue(diff.leftValue) }}
                  </span>
                </td>
                <td class="p-2">
                  <span class="font-mono text-xs bg-green-500/10 text-green-700 dark:text-green-300 px-1 rounded">
                    {{ formatValue(diff.rightValue) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="changedProperties.length === 0" class="text-center py-8 text-muted-foreground">
            No differences found - themes are identical
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
