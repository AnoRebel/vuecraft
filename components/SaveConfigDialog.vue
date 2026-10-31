<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useDesignSystem } from '~/composables/useDesignSystem'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const {
  savedConfigs,
  saveConfiguration,
  loadConfiguration,
  deleteConfiguration,
  renameConfiguration,
} = useDesignSystem()

const name = ref('')
const editingId = ref<string | null>(null)
const editingName = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) name.value = `My theme ${savedConfigs.value.length + 1}`
  }
)

function save() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  saveConfiguration(trimmed)
  toast.success(`Saved “${trimmed}”`)
  name.value = ''
}

function load(id: string, label: string) {
  if (loadConfiguration(id)) {
    toast.success(`Loaded “${label}”`)
    emit('update:open', false)
  }
}

function startRename(id: string, current: string) {
  editingId.value = id
  editingName.value = current
}

function commitRename() {
  if (editingId.value && editingName.value.trim()) {
    renameConfiguration(editingId.value, editingName.value.trim())
  }
  editingId.value = null
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Saved configurations</DialogTitle>
        <DialogDescription
          >Stored in this browser. Share a link to use them elsewhere.</DialogDescription
        >
      </DialogHeader>

      <form class="flex items-end gap-2" @submit.prevent="save">
        <div class="flex-1 space-y-1.5">
          <Label for="save-name">Name</Label>
          <Input id="save-name" v-model="name" placeholder="Theme name" />
        </div>
        <Button type="submit" :disabled="!name.trim()"><Icon name="lucide:save" />Save</Button>
      </form>

      <div class="max-h-72 space-y-1 overflow-y-auto">
        <p v-if="!savedConfigs.length" class="py-6 text-center text-sm text-muted-foreground">
          No saved configurations yet.
        </p>
        <div
          v-for="item in [...savedConfigs].reverse()"
          :key="item.id"
          class="flex items-center gap-2 rounded-md border p-2"
        >
          <div class="min-w-0 flex-1">
            <Input
              v-if="editingId === item.id"
              v-model="editingName"
              class="h-8"
              aria-label="New name"
              @keydown.enter.prevent="commitRename"
              @blur="commitRename"
            />
            <template v-else>
              <p class="truncate text-sm font-medium">{{ item.name }}</p>
              <p class="text-xs text-muted-foreground">{{ formatDate(item.createdAt) }}</p>
            </template>
          </div>
          <Button size="sm" variant="secondary" @click="load(item.id, item.name)">Load</Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Rename"
            @click="startRename(item.id, item.name)"
          >
            <Icon name="lucide:pencil" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Delete"
            @click="deleteConfiguration(item.id)"
          >
            <Icon name="lucide:trash-2" />
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
