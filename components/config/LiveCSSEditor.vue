<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { generateCSSVariables } from '~/utils/cssGenerator'
import { Button } from '~/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { cn } from '~/lib/utils'

const { config, copyToClipboard, copied } = useDesignSystem()

const activeTab = ref<'variables' | 'full'>('variables')
const isEditing = ref(false)
const editedCSS = ref('')
const hasChanges = ref(false)

// Generate CSS from config
const generatedCSS = computed(() => {
  return generateCSSVariables(config)
})

// Extract just the CSS variables part
const cssVariablesOnly = computed(() => {
  const css = generatedCSS.value
  // Find the :root section
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/s)
  const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/s)

  let result = ''
  if (rootMatch) {
    result += `:root {\n${rootMatch[1]}\n}\n\n`
  }
  if (darkMatch) {
    result += `.dark {\n${darkMatch[1]}\n}`
  }
  return result.trim() || generatedCSS.value
})

// Currently displayed CSS
const displayedCSS = computed(() => {
  if (isEditing.value && hasChanges.value) {
    return editedCSS.value
  }
  return activeTab.value === 'variables' ? cssVariablesOnly.value : generatedCSS.value
})

// Start editing
function startEditing() {
  editedCSS.value = displayedCSS.value
  isEditing.value = true
  hasChanges.value = false
}

// Cancel editing
function cancelEditing() {
  isEditing.value = false
  hasChanges.value = false
}

// Apply CSS changes (inject into preview)
function applyChanges() {
  if (!editedCSS.value.trim()) return

  // Inject the edited CSS
  let styleEl = document.getElementById('live-css-editor-styles') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'live-css-editor-styles'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = editedCSS.value

  hasChanges.value = true
}

// Reset to generated
function resetToGenerated() {
  const styleEl = document.getElementById('live-css-editor-styles')
  if (styleEl) {
    styleEl.remove()
  }
  isEditing.value = false
  hasChanges.value = false
}

// Copy CSS
async function copyCSS() {
  await copyToClipboard(displayedCSS.value)
}

// Handle textarea input
function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  editedCSS.value = target.value
}

// Watch for config changes to update the preview
watch(
  () => config,
  () => {
    if (!isEditing.value) {
      // Re-inject generated CSS
      const styleEl = document.getElementById('live-css-editor-styles') as HTMLStyleElement | null
      if (styleEl) {
        styleEl.remove()
      }
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="border rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-medium">Live CSS Editor</h3>
        <Tabs v-model="activeTab" class="h-7">
          <TabsList class="h-7">
            <TabsTrigger value="variables" class="text-xs h-6 px-2">Variables</TabsTrigger>
            <TabsTrigger value="full" class="text-xs h-6 px-2">Full CSS</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div class="flex items-center gap-1">
        <template v-if="isEditing">
          <Button variant="ghost" size="sm" class="h-7 text-xs" @click="applyChanges">
            Apply
          </Button>
          <Button variant="ghost" size="sm" class="h-7 text-xs" @click="resetToGenerated">
            Reset
          </Button>
          <Button variant="ghost" size="sm" class="h-7 text-xs" @click="cancelEditing">
            Cancel
          </Button>
        </template>
        <template v-else>
          <Button variant="ghost" size="sm" class="h-7 text-xs" @click="startEditing">
            Edit
          </Button>
        </template>
        <Button variant="ghost" size="sm" class="h-7 text-xs" @click="copyCSS">
          {{ copied ? 'Copied!' : 'Copy' }}
        </Button>
      </div>
    </div>

    <!-- CSS Content -->
    <div class="relative">
      <textarea
        v-if="isEditing"
        :value="editedCSS"
        class="w-full h-[300px] p-3 font-mono text-xs bg-background resize-none focus:outline-none"
        spellcheck="false"
        @input="handleInput"
      />
      <pre
        v-else
        :class="
          cn(
            'h-[300px] p-3 overflow-auto font-mono text-xs bg-background',
            'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
          )
        "
      ><code>{{ displayedCSS }}</code></pre>

      <!-- Edit Mode Indicator -->
      <div
        v-if="isEditing && hasChanges"
        class="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded text-xs"
      >
        Modified
      </div>
    </div>
  </div>
</template>
