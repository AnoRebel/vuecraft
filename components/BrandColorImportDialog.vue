<script setup lang="ts">
import { ref } from 'vue'
import { useBrandColorExtractor } from '~/composables/useBrandColorExtractor'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'apply', colors: { primary: string; accent?: string }): void
}>()

const { extractFromFile, lastResult, isExtracting, error, clear } =
  useBrandColorExtractor()

const fileInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

function openFilePicker() {
  fileInput.value?.click()
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    await extractFromFile(file)
  }
}

async function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false

  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    await extractFromFile(file)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  dragOver.value = true
}

function handleDragLeave() {
  dragOver.value = false
}

function applyColors() {
  if (lastResult.value?.suggestedPrimary) {
    emit('apply', {
      primary: lastResult.value.suggestedPrimary.cssValue,
      accent: lastResult.value.suggestedAccent?.cssValue,
    })
    emit('update:open', false)
    clear()
  }
}

function handleClose() {
  emit('update:open', false)
  clear()
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Import Brand Colors</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 mt-4">
        <!-- Upload Area -->
        <div
          class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
          :class="{
            'border-primary bg-primary/5': dragOver,
            'border-muted-foreground/25 hover:border-muted-foreground/50': !dragOver,
          }"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />

          <Icon name="lucide:image" class="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p class="text-sm text-muted-foreground mb-2">
            Drop your logo or brand image here
          </p>
          <Button variant="outline" size="sm" :disabled="isExtracting" @click="openFilePicker">
            <Icon v-if="isExtracting" name="lucide:loader-2" class="h-4 w-4 mr-2 animate-spin" />
            Choose File
          </Button>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-sm text-red-500">
          {{ error }}
        </div>

        <!-- Results -->
        <div v-if="lastResult" class="space-y-4">
          <div>
            <label class="text-xs font-medium text-muted-foreground">Extracted Colors</label>
            <div class="flex gap-1 mt-2">
              <div
                v-for="(color, index) in lastResult.colors"
                :key="index"
                class="flex-1 h-12 rounded cursor-pointer transition-transform hover:scale-105"
                :style="{ backgroundColor: color.hex }"
                :title="color.hex"
              />
            </div>
          </div>

          <div v-if="lastResult.suggestedPrimary" class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground">Suggested Theme Colors</label>
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded"
                  :style="{ backgroundColor: lastResult.suggestedPrimary.hex }"
                />
                <span class="text-sm">Primary</span>
              </div>
              <div v-if="lastResult.suggestedAccent" class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded"
                  :style="{ backgroundColor: lastResult.suggestedAccent.hex }"
                />
                <span class="text-sm">Accent</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="handleClose">Cancel</Button>
            <Button @click="applyColors">Apply Colors</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
