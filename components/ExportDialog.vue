<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { generateCSSVariables, generateComponentsJson, generateExportPackage } from '~/utils/cssGenerator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { Badge } from '~/components/ui/badge'

interface Props {
  open: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { config } = useDesignSystem()
const activeTab = ref('css')
const copied = ref<string | null>(null)

const cssOutput = computed(() => generateCSSVariables(config))
const jsonOutput = computed(() => generateComponentsJson(config))
const exportPackage = computed(() => generateExportPackage(config))

async function copyToClipboard(content: string, type: string) {
  try {
    await navigator.clipboard.writeText(content)
    copied.value = type
    setTimeout(() => {
      copied.value = null
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadAll() {
  const pkg = exportPackage.value
  downloadFile(pkg.css, 'main.css', 'text/css')
  downloadFile(pkg.componentsJson, 'components.json', 'application/json')
  downloadFile(pkg.readme, 'README.md', 'text/markdown')
}
</script>

<template>
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent class="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Export Design System</DialogTitle>
        <DialogDescription>
          Download or copy your custom design system configuration.
        </DialogDescription>
      </DialogHeader>

      <Tabs v-model="activeTab" class="flex-1 overflow-hidden flex flex-col">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="json">components.json</TabsTrigger>
          <TabsTrigger value="readme">README</TabsTrigger>
        </TabsList>

        <TabsContent value="css" class="flex-1 overflow-hidden flex flex-col mt-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">main.css</span>
              <Badge variant="secondary">Tailwind CSS v4</Badge>
            </div>
            <div class="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                @click="copyToClipboard(cssOutput, 'css')"
              >
                {{ copied === 'css' ? 'Copied!' : 'Copy' }}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                @click="downloadFile(cssOutput, 'main.css', 'text/css')"
              >
                Download
              </Button>
            </div>
          </div>
          <div class="flex-1 overflow-auto rounded-md border bg-muted/50">
            <pre class="p-4 text-xs font-mono overflow-x-auto"><code>{{ cssOutput }}</code></pre>
          </div>
        </TabsContent>

        <TabsContent value="json" class="flex-1 overflow-hidden flex flex-col mt-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">components.json</span>
              <Badge variant="secondary">shadcn-vue CLI</Badge>
            </div>
            <div class="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                @click="copyToClipboard(jsonOutput, 'json')"
              >
                {{ copied === 'json' ? 'Copied!' : 'Copy' }}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                @click="downloadFile(jsonOutput, 'components.json', 'application/json')"
              >
                Download
              </Button>
            </div>
          </div>
          <div class="flex-1 overflow-auto rounded-md border bg-muted/50">
            <pre class="p-4 text-xs font-mono overflow-x-auto"><code>{{ jsonOutput }}</code></pre>
          </div>
        </TabsContent>

        <TabsContent value="readme" class="flex-1 overflow-hidden flex flex-col mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">README.md</span>
            <div class="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                @click="copyToClipboard(exportPackage.readme, 'readme')"
              >
                {{ copied === 'readme' ? 'Copied!' : 'Copy' }}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                @click="downloadFile(exportPackage.readme, 'README.md', 'text/markdown')"
              >
                Download
              </Button>
            </div>
          </div>
          <div class="flex-1 overflow-auto rounded-md border bg-muted/50">
            <pre class="p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap"><code>{{ exportPackage.readme }}</code></pre>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter class="mt-4">
        <Button variant="outline" @click="emit('update:open', false)">
          Close
        </Button>
        <Button @click="downloadAll">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download All
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
