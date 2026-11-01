<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { generateCSSVariables } from '~/utils/cssGenerator'
import { COLOR_KEYS, toTokenName } from '~/utils/themeTokens'
import type { CustomThemeTokens } from '~/types/config'
import { Button } from '~/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { cn } from '~/lib/utils'

const { config, copyToClipboard, setTheme } = useDesignSystem()

const activeTab = ref<'variables' | 'full'>('variables')
const isEditing = ref(false)
const editedCSS = ref('')
const copied = ref(false)

const generatedCSS = computed(() => generateCSSVariables(config))

// Just the :root and .dark blocks
const cssVariablesOnly = computed(() => {
  const css = generatedCSS.value
  const root = css.match(/:root\s*\{([^}]+)\}/)
  const dark = css.match(/\.dark\s*\{([^}]+)\}/)
  const parts = []
  if (root) parts.push(`:root {${root[1]}}`)
  if (dark) parts.push(`.dark {${dark[1]}}`)
  return parts.join('\n\n') || css
})

const displayedCSS = computed(() =>
  activeTab.value === 'variables' ? cssVariablesOnly.value : generatedCSS.value
)

const COLOR_TOKENS = new Set(COLOR_KEYS.map((k) => toTokenName(k)))

function declarations(css: string, selector: RegExp): Record<string, string> {
  const block = css.match(selector)?.[1] ?? ''
  const out: Record<string, string> = {}
  for (const m of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]!] = m[2]!.trim()
  }
  return out
}

function stripPrefix(name: string): string {
  const prefix = config.export.cssVariablesPrefix ? `${config.export.cssVariablesPrefix}-` : ''
  return prefix && name.startsWith(prefix) ? name.slice(prefix.length) : name
}

function startEditing() {
  editedCSS.value = cssVariablesOnly.value
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}

/** Parse edited :root / .dark variables into the theme configuration */
function applyChanges() {
  const light = declarations(editedCSS.value, /:root\s*\{([^}]+)\}/)
  const dark = declarations(editedCSS.value, /\.dark\s*\{([^}]+)\}/)

  const custom: CustomThemeTokens = JSON.parse(JSON.stringify(config.theme.custom ?? {}))
  const shadowsLight: Record<string, string> = {}
  const shadowsDark: Record<string, string> = {}
  let applied = 0

  for (const [mode, vars] of [
    ['light', light],
    ['dark', dark],
  ] as const) {
    for (const [rawName, value] of Object.entries(vars)) {
      const name = stripPrefix(rawName)
      if (COLOR_TOKENS.has(name)) {
        custom[mode] = { ...(custom[mode] ?? {}), [name]: value }
        applied++
      } else if (name.startsWith('shadow-')) {
        ;(mode === 'light' ? shadowsLight : shadowsDark)[name.slice(7)] = value
        applied++
      } else if (mode === 'light') {
        if (name === 'radius') custom.radius = value
        else if (name === 'font-sans') custom.fontSans = value
        else if (name === 'font-heading') custom.fontHeading = value
        else if (name === 'font-mono') custom.fontMono = value
        else continue
        applied++
      }
    }
  }
  if (Object.keys(shadowsLight).length) {
    custom.shadows = { light: shadowsLight, dark: { ...shadowsLight, ...shadowsDark } }
  }

  if (!applied) {
    toast.error('No theme variables found', {
      description: 'Edit the values inside the :root and .dark blocks.',
    })
    return
  }
  setTheme({ custom })
  isEditing.value = false
  toast.success(`Applied ${applied} variable${applied === 1 ? '' : 's'} to the theme`)
}

function resetToGenerated() {
  editedCSS.value = cssVariablesOnly.value
}

async function copyCSS() {
  copied.value = await copyToClipboard(isEditing.value ? editedCSS.value : displayedCSS.value)
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="border rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 bg-muted/50 px-3 py-2 border-b">
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
        v-model="editedCSS"
        aria-label="Theme CSS variables"
        class="w-full h-[300px] p-3 font-mono text-xs bg-background resize-none focus:outline-none"
        spellcheck="false"
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
    </div>
  </div>
</template>
