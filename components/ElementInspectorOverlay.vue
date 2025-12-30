<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useElementInspector } from '~/composables/useElementInspector'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  container?: HTMLElement | null
}>()

const {
  isInspecting,
  isPinned,
  inspectedData,
  styleProperties,
  highlightStyles,
  currentElement,
  startInspecting,
  stopInspecting,
  toggleInspecting,
  handleElementHover,
  handleElementClick,
  unpinSelection,
  copyTailwindClasses,
  generateCodeSnippet,
  setPreviewContainer,
} = useElementInspector()

const showPanel = ref(false)
const copied = ref(false)

onMounted(() => {
  if (props.container) {
    setPreviewContainer(props.container)
  }
})

function handleMouseMove(event: MouseEvent) {
  if (!isInspecting.value || isPinned.value) return
  const target = event.target as HTMLElement
  if (target && props.container?.contains(target)) {
    handleElementHover(target)
  }
}

function handleClick(event: MouseEvent) {
  if (!isInspecting.value) return
  event.preventDefault()
  event.stopPropagation()
  const target = event.target as HTMLElement
  if (target && props.container?.contains(target)) {
    handleElementClick(target)
    showPanel.value = true
  }
}

async function copyClasses() {
  const success = await copyTailwindClasses()
  if (success) {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

function toggleInspector() {
  if (isInspecting.value) {
    stopInspecting()
    showPanel.value = false
  } else {
    startInspecting()
  }
}
</script>

<template>
  <div>
    <!-- Toggle Button -->
    <Button
      :variant="isInspecting ? 'default' : 'outline'"
      size="sm"
      @click="toggleInspector"
    >
      <Icon name="lucide:mouse-pointer" class="h-4 w-4 mr-2" />
      {{ isInspecting ? 'Stop Inspecting' : 'Inspect Element' }}
    </Button>

    <!-- Highlight Overlay -->
    <div
      v-if="isInspecting && currentElement && highlightStyles"
      class="border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-50"
      :style="highlightStyles"
    >
      <div class="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
        {{ inspectedData?.tagName }}
        <template v-if="inspectedData?.className">
          .{{ inspectedData.className.split(' ')[0] }}
        </template>
      </div>
    </div>

    <!-- Inspector Panel -->
    <div
      v-if="showPanel && isPinned && inspectedData"
      class="fixed bottom-4 right-4 w-80 max-h-96 overflow-auto bg-popover border rounded-lg shadow-lg z-50"
    >
      <div class="sticky top-0 bg-popover border-b p-3 flex items-center justify-between">
        <div>
          <span class="font-mono text-sm">{{ inspectedData.tagName }}</span>
          <span v-if="inspectedData.id" class="text-muted-foreground text-xs ml-1">
            #{{ inspectedData.id }}
          </span>
        </div>
        <Button variant="ghost" size="sm" @click="unpinSelection(); showPanel = false">
          <Icon name="lucide:x" class="h-4 w-4" />
        </Button>
      </div>

      <div class="p-3 space-y-3">
        <!-- Tailwind Classes -->
        <div v-if="inspectedData.tailwindClasses.length > 0">
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs font-medium text-muted-foreground">Tailwind Classes</label>
            <Button variant="ghost" size="sm" class="h-6 text-xs" @click="copyClasses">
              <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="h-3 w-3 mr-1" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="cls in inspectedData.tailwindClasses.slice(0, 10)"
              :key="cls"
              class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono"
            >
              {{ cls }}
            </span>
            <span
              v-if="inspectedData.tailwindClasses.length > 10"
              class="text-xs text-muted-foreground"
            >
              +{{ inspectedData.tailwindClasses.length - 10 }} more
            </span>
          </div>
        </div>

        <!-- Computed Styles -->
        <div>
          <label class="text-xs font-medium text-muted-foreground mb-1 block">
            Computed Styles
          </label>
          <div class="space-y-1 max-h-32 overflow-auto">
            <div
              v-for="(value, key) in inspectedData.computedStyles"
              :key="key"
              class="flex justify-between text-xs"
            >
              <span class="font-mono text-muted-foreground">{{ key }}:</span>
              <span class="font-mono truncate ml-2" :title="value">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- CSS Variables -->
        <div v-if="Object.keys(inspectedData.cssVariables).length > 0">
          <label class="text-xs font-medium text-muted-foreground mb-1 block">
            Theme Variables
          </label>
          <div class="space-y-1 max-h-32 overflow-auto">
            <div
              v-for="(value, key) in inspectedData.cssVariables"
              :key="key"
              class="flex justify-between text-xs"
            >
              <span class="font-mono text-muted-foreground">{{ key }}:</span>
              <span class="font-mono truncate ml-2" :title="value">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
