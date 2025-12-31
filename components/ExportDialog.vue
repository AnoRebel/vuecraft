<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import type { UILibrary } from '~/types/config'
import {
  generateUniversalCSS,
  generateUniversalConfig,
  generateUniversalExportPackage,
  getUILibraryInfo,
} from '~/utils/cssGenerator'
import {
  generateInitCommand,
  generateAddCommand,
  generateUniversalSetupScript,
  getLibraryCommands,
} from '~/utils/cliGenerator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
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

const { config, setExport } = useDesignSystem()
const { UI_LIBRARIES } = useConfigOptions()
const activeTab = ref('css')
const copied = ref<string | null>(null)

// Computed values based on UI library
const selectedLibrary = computed(() => config.export.uiLibrary)
const libraryInfo = computed(() => getUILibraryInfo(selectedLibrary.value))

const cssOutput = computed(() => generateUniversalCSS(config))
const configOutput = computed(() => generateUniversalConfig(config))
const exportPackage = computed(() => generateUniversalExportPackage(config))

// CLI commands
const setupScript = computed(() => generateUniversalSetupScript(config))
const libraryCommands = computed(() => getLibraryCommands(config))

// shadcn-vue specific commands
const initCommand = computed(() => generateInitCommand(config))
const addCommand = computed(() => generateAddCommand(config.export.includeComponents))

function selectLibrary(library: UILibrary) {
  setExport({ uiLibrary: library })
}

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
  if (pkg.config) {
    const configType = pkg.configFilename.endsWith('.json') ? 'application/json' : 'text/plain'
    downloadFile(pkg.config, pkg.configFilename, configType)
  }
  downloadFile(pkg.readme, 'README.md', 'text/markdown')
  // Download additional files if any
  if (pkg.additionalFiles) {
    for (const file of pkg.additionalFiles) {
      downloadFile(file.content, file.filename, 'text/plain')
    }
  }
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

      <!-- UI Library Selector -->
      <div class="flex gap-2 pb-4 border-b">
        <button
          v-for="lib in UI_LIBRARIES"
          :key="lib.name"
          class="flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors"
          :class="[
            selectedLibrary === lib.name
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50',
          ]"
          @click="selectLibrary(lib.name as UILibrary)"
        >
          <span class="font-medium text-sm">{{ lib.label }}</span>
          <span class="text-xs text-muted-foreground text-center">{{ lib.description }}</span>
        </button>
      </div>

      <Tabs v-model="activeTab" class="flex-1 overflow-hidden flex flex-col">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="readme">README</TabsTrigger>
        </TabsList>

        <!-- CSS Tab -->
        <TabsContent value="css" class="flex-1 overflow-hidden flex flex-col mt-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">{{ libraryInfo.cssFilename }}</span>
              <Badge variant="secondary">{{ libraryInfo.badge }}</Badge>
            </div>
            <div class="flex gap-2">
              <Button variant="ghost" size="sm" @click="copyToClipboard(cssOutput, 'css')">
                {{ copied === 'css' ? 'Copied!' : 'Copy' }}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                @click="downloadFile(cssOutput, libraryInfo.cssFilename, 'text/css')"
              >
                Download
              </Button>
            </div>
          </div>
          <div class="flex-1 overflow-auto rounded-md border bg-muted/50">
            <pre class="p-4 text-xs font-mono overflow-x-auto"><code>{{ cssOutput }}</code></pre>
          </div>
        </TabsContent>

        <!-- Config Tab -->
        <TabsContent value="config" class="flex-1 overflow-hidden flex flex-col mt-4">
          <template v-if="configOutput">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ libraryInfo.configFilename }}</span>
                <Badge variant="secondary">{{ libraryInfo.name }}</Badge>
              </div>
              <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="copyToClipboard(configOutput, 'config')">
                  {{ copied === 'config' ? 'Copied!' : 'Copy' }}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="
                    downloadFile(
                      configOutput,
                      libraryInfo.configFilename,
                      libraryInfo.configFilename.endsWith('.json')
                        ? 'application/json'
                        : 'text/plain'
                    )
                  "
                >
                  Download
                </Button>
              </div>
            </div>
            <div class="flex-1 overflow-auto rounded-md border bg-muted/50">
              <pre
                class="p-4 text-xs font-mono overflow-x-auto"
              ><code>{{ configOutput }}</code></pre>
            </div>
          </template>
          <template v-else>
            <div class="flex-1 flex items-center justify-center text-muted-foreground">
              <div class="text-center">
                <p class="text-sm">No configuration file needed for {{ libraryInfo.name }}.</p>
                <p class="text-xs mt-1">Just copy the CSS and you're ready to go!</p>
              </div>
            </div>
          </template>
        </TabsContent>

        <!-- CLI Tab -->
        <TabsContent value="cli" class="flex-1 overflow-hidden flex flex-col mt-4">
          <div class="flex-1 overflow-auto space-y-4">
            <!-- shadcn-vue specific commands -->
            <template v-if="selectedLibrary === 'shadcn-vue'">
              <!-- Init Command -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">Initialize shadcn-vue</span>
                    <Badge variant="secondary">Step 1</Badge>
                  </div>
                  <Button variant="ghost" size="sm" @click="copyToClipboard(initCommand, 'init')">
                    {{ copied === 'init' ? 'Copied!' : 'Copy' }}
                  </Button>
                </div>
                <div class="rounded-md border bg-muted/50 p-3">
                  <code class="text-xs font-mono">{{ initCommand }}</code>
                </div>
              </div>

              <!-- Add Components Command -->
              <div v-if="config.export.includeComponents.length > 0" class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">Add Components</span>
                    <Badge variant="secondary">Step 2</Badge>
                    <Badge variant="outline">
                      {{ config.export.includeComponents.length }} components
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" @click="copyToClipboard(addCommand, 'add')">
                    {{ copied === 'add' ? 'Copied!' : 'Copy' }}
                  </Button>
                </div>
                <div class="rounded-md border bg-muted/50 p-3 overflow-x-auto">
                  <code class="text-xs font-mono whitespace-nowrap">{{ addCommand }}</code>
                </div>
              </div>
            </template>

            <!-- Nuxt UI specific commands -->
            <template v-else-if="selectedLibrary === 'nuxt-ui'">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">Create Nuxt Project</span>
                    <Badge variant="secondary">Step 1</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="copyToClipboard(libraryCommands.init, 'init')"
                  >
                    {{ copied === 'init' ? 'Copied!' : 'Copy' }}
                  </Button>
                </div>
                <div class="rounded-md border bg-muted/50 p-3">
                  <code class="text-xs font-mono">{{ libraryCommands.init }}</code>
                </div>
              </div>

              <div v-if="libraryCommands.install" class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">Add Nuxt UI Module</span>
                    <Badge variant="secondary">Step 2</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="copyToClipboard(libraryCommands.install, 'install')"
                  >
                    {{ copied === 'install' ? 'Copied!' : 'Copy' }}
                  </Button>
                </div>
                <div class="rounded-md border bg-muted/50 p-3">
                  <code class="text-xs font-mono">{{ libraryCommands.install }}</code>
                </div>
              </div>
            </template>

            <!-- Plain Tailwind specific commands -->
            <template v-else-if="selectedLibrary === 'tailwind'">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium"
                      >Create
                      {{ config.export.framework === 'nuxt' ? 'Nuxt' : 'Vue' }} Project</span
                    >
                    <Badge variant="secondary">Step 1</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="copyToClipboard(libraryCommands.init, 'init')"
                  >
                    {{ copied === 'init' ? 'Copied!' : 'Copy' }}
                  </Button>
                </div>
                <div class="rounded-md border bg-muted/50 p-3">
                  <code class="text-xs font-mono">{{ libraryCommands.init }}</code>
                </div>
              </div>

              <div v-if="libraryCommands.install" class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">Install Tailwind CSS v4</span>
                    <Badge variant="secondary">Step 2</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="copyToClipboard(libraryCommands.install, 'install')"
                  >
                    {{ copied === 'install' ? 'Copied!' : 'Copy' }}
                  </Button>
                </div>
                <div class="rounded-md border bg-muted/50 p-3">
                  <code class="text-xs font-mono">{{ libraryCommands.install }}</code>
                </div>
              </div>
            </template>

            <!-- Full Setup Script (all libraries) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">Full Setup Script</span>
                  <Badge variant="secondary">All-in-one</Badge>
                </div>
                <div class="flex gap-2">
                  <Button variant="ghost" size="sm" @click="copyToClipboard(setupScript, 'script')">
                    {{ copied === 'script' ? 'Copied!' : 'Copy' }}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="downloadFile(setupScript, 'setup.sh', 'text/x-shellscript')"
                  >
                    Download
                  </Button>
                </div>
              </div>
              <div class="rounded-md border bg-muted/50 max-h-[200px] overflow-auto">
                <pre class="p-3 text-xs font-mono"><code>{{ setupScript }}</code></pre>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- README Tab -->
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
            <pre
              class="p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap"
            ><code>{{ exportPackage.readme }}</code></pre>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter class="mt-4">
        <Button variant="outline" @click="emit('update:open', false)"> Close </Button>
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
