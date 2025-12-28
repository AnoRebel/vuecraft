<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Props {
  open: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { getShareableUrl, exportConfigJson } = useDesignSystem()

const copied = ref<'url' | 'json' | null>(null)

const shareUrl = computed(() => {
  if (import.meta.client) {
    return getShareableUrl()
  }
  return ''
})

const configJson = computed(() => exportConfigJson())

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = 'url'
    setTimeout(() => {
      copied.value = null
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(configJson.value)
    copied.value = 'json'
    setTimeout(() => {
      copied.value = null
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Share Configuration</DialogTitle>
        <DialogDescription>
          Share your design system configuration with others.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Shareable URL -->
        <div class="space-y-2">
          <Label>Shareable URL</Label>
          <div class="flex gap-2">
            <Input
              :model-value="shareUrl"
              readonly
              class="font-mono text-xs"
            />
            <Button @click="copyUrl">
              {{ copied === 'url' ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">
            Anyone with this URL can view and use your configuration.
          </p>
        </div>

        <!-- JSON Export -->
        <div class="space-y-2">
          <Label>Configuration JSON</Label>
          <div class="relative">
            <div class="rounded-md border bg-muted/50 p-4 max-h-[200px] overflow-auto">
              <pre class="text-xs font-mono"><code>{{ configJson }}</code></pre>
            </div>
            <Button
              size="sm"
              variant="secondary"
              class="absolute top-2 right-2"
              @click="copyJson"
            >
              {{ copied === 'json' ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">
            Save this JSON to import your configuration later.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
