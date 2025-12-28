<script setup lang="ts">
import { ref } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'

interface Props {
  open: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { importConfig } = useDesignSystem()

const jsonInput = ref('')
const error = ref<string | null>(null)
const success = ref(false)

function handleImport() {
  error.value = null
  success.value = false

  if (!jsonInput.value.trim()) {
    error.value = 'Please paste a configuration JSON'
    return
  }

  const result = importConfig(jsonInput.value)
  if (result) {
    success.value = true
    setTimeout(() => {
      emit('update:open', false)
      jsonInput.value = ''
      success.value = false
    }, 1000)
  } else {
    error.value = 'Invalid configuration format. Please check your JSON.'
  }
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    jsonInput.value = e.target?.result as string
  }
  reader.readAsText(file)
}
</script>

<template>
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Import Configuration</DialogTitle>
        <DialogDescription>
          Import a previously exported design system configuration.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>Upload JSON File</Label>
          <input
            type="file"
            accept=".json"
            class="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            @change="handleFileUpload"
          />
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">Or paste JSON</span>
          </div>
        </div>

        <div class="space-y-2">
          <Label>Configuration JSON</Label>
          <textarea
            v-model="jsonInput"
            class="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder='{"v": 1, "t": {...}, ...}'
          />
        </div>

        <div v-if="error" class="text-sm text-destructive">
          {{ error }}
        </div>
        <div v-if="success" class="text-sm text-green-600">
          Configuration imported successfully!
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)"> Cancel </Button>
        <Button @click="handleImport"> Import </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
