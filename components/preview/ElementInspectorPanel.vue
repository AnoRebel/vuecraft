<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import {
  useElementInspector,
  snippet,
  type InspectedElement,
} from '~/composables/useElementInspector'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useColorMode } from '~/composables/useColorMode'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

const { pinned, pin, selectParent, inspect } = useElementInspector()
const { config } = useDesignSystem()
const { isDark } = useColorMode()
const { copy } = useClipboard({ legacy: true })

const data = ref<InspectedElement | null>(null)
const showAllClasses = ref(false)

async function refresh() {
  await nextTick()
  data.value = pinned.value ? inspect(pinned.value) : null
}

// Re-inspect when the element, the theme or the colour mode changes
watch(pinned, () => {
  showAllClasses.value = false
  refresh()
})
watch(
  () => [JSON.stringify(config.theme), JSON.stringify(config.components), isDark.value],
  () => setTimeout(refresh, 60)
)

const contrastLevel = computed(() => {
  const r = data.value?.contrast
  if (r == null) return null
  if (r >= 7) return { label: 'AAA', variant: 'success' as const }
  if (r >= 4.5) return { label: 'AA', variant: 'success' as const }
  if (r >= 3) return { label: 'AA Large', variant: 'warning' as const }
  return { label: 'Fail', variant: 'destructive' as const }
})

const visibleClasses = computed(() =>
  showAllClasses.value ? (data.value?.classes ?? []) : (data.value?.classes ?? []).slice(0, 12)
)

const boxRows = computed(() => {
  if (!data.value) return []
  const fmt = (v: number[]) => (v.every((n) => n === v[0]) ? `${v[0]}` : v.join(' '))
  return [
    { label: 'margin', value: fmt(data.value.box.margin) },
    { label: 'border', value: fmt(data.value.box.border) },
    { label: 'padding', value: fmt(data.value.box.padding) },
  ]
})

async function copyText(text: string, what: string) {
  try {
    await copy(text)
    toast.success(`${what} copied`)
  } catch {
    toast.error('Copy failed')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectParent()
  }
}
</script>

<template>
  <aside
    v-if="pinned && data"
    data-inspector-ui
    aria-label="Element inspector"
    tabindex="-1"
    class="vc-pop fixed inset-x-0 bottom-0 z-[95] flex max-h-[60dvh] flex-col rounded-t-xl border bg-popover text-popover-foreground shadow-2xl md:absolute md:inset-x-auto md:bottom-3 md:right-3 md:top-3 md:max-h-none md:w-80 md:rounded-xl"
    @keydown="onKeydown"
  >
    <!-- Header -->
    <header class="flex items-start gap-2 border-b p-3">
      <div class="min-w-0 flex-1">
        <p class="truncate font-mono text-sm">
          <span class="text-sky-600 dark:text-sky-400">&lt;{{ data.tag }}&gt;</span>
          <span v-if="data.id" class="text-muted-foreground">#{{ data.id }}</span>
        </p>
        <div class="mt-1 flex flex-wrap gap-1">
          <Badge v-if="data.component" variant="secondary" class="text-[10px]">
            {{ data.component }}
          </Badge>
          <Badge v-if="data.slot" variant="outline" class="text-[10px]"
            >slot: {{ data.slot }}</Badge
          >
          <span class="text-[11px] text-muted-foreground">
            {{ data.size.width }} × {{ data.size.height }}px
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Select parent element (Arrow Up)"
        title="Parent (↑)"
        @click="selectParent"
      >
        <Icon name="lucide:arrow-up-from-line" />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Close inspector panel" @click="pin(null)">
        <Icon name="lucide:x" />
      </Button>
    </header>

    <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 text-xs">
      <!-- Breadcrumb -->
      <nav aria-label="Element path" class="flex flex-wrap items-center gap-0.5">
        <template v-for="(node, i) in data.path.slice(-5)" :key="i">
          <Icon v-if="i > 0" name="lucide:chevron-right" class="size-3 text-muted-foreground" />
          <button
            type="button"
            class="max-w-28 truncate rounded px-1 py-0.5 font-mono hover:bg-muted"
            :class="{ 'bg-muted font-semibold': node.el === pinned }"
            @click="pin(node.el)"
          >
            {{ node.label }}
          </button>
        </template>
      </nav>

      <!-- Theme tokens -->
      <section>
        <h3 class="mb-1.5 font-medium text-muted-foreground">Theme tokens</h3>
        <ul class="space-y-1.5">
          <li v-for="c in data.colors" :key="c.property" class="flex items-center gap-2">
            <span class="size-4 shrink-0 rounded border" :style="{ backgroundColor: c.value }" />
            <span class="w-16 shrink-0 text-muted-foreground">{{ c.property }}</span>
            <span
              v-if="c.tokens.length"
              class="min-w-0 truncate font-mono"
              :title="
                c.declared
                  ? 'From the element classes; the rendered colour differs (e.g. hover)'
                  : c.tokens.join(', ')
              "
            >
              {{ c.tokens[0] }}<sup v-if="c.declared" class="text-muted-foreground">*</sup>
              <span v-if="c.tokens.length > 1" class="text-muted-foreground">
                +{{ c.tokens.length - 1 }}
              </span>
            </span>
            <span v-else class="truncate font-mono text-muted-foreground" :title="c.value"
              >custom</span
            >
          </li>
          <li v-if="!data.colors.length" class="text-muted-foreground">
            No colour on this element.
          </li>
        </ul>
        <div v-if="data.contrast" class="mt-2 flex items-center gap-2">
          <span class="text-muted-foreground">Text contrast</span>
          <span class="font-mono">{{ data.contrast.toFixed(2) }}:1</span>
          <Badge v-if="contrastLevel" :variant="contrastLevel.variant" class="text-[10px]">
            {{ contrastLevel.label }}
          </Badge>
        </div>
      </section>

      <!-- Box model -->
      <section>
        <h3 class="mb-1.5 font-medium text-muted-foreground">Box</h3>
        <dl class="grid grid-cols-[5rem_1fr] gap-x-2 gap-y-1 font-mono">
          <template v-for="row in boxRows" :key="row.label">
            <dt class="text-muted-foreground">{{ row.label }}</dt>
            <dd>{{ row.value }}px</dd>
          </template>
          <dt class="text-muted-foreground">radius</dt>
          <dd class="truncate">{{ data.radius }}</dd>
          <dt class="text-muted-foreground">shadow</dt>
          <dd class="truncate" :title="data.shadow">{{ data.shadow }}</dd>
        </dl>
      </section>

      <!-- Typography -->
      <section>
        <h3 class="mb-1.5 font-medium text-muted-foreground">Typography</h3>
        <dl class="grid grid-cols-[5rem_1fr] gap-x-2 gap-y-1 font-mono">
          <dt class="text-muted-foreground">family</dt>
          <dd class="truncate">{{ data.typography.family }}</dd>
          <dt class="text-muted-foreground">size</dt>
          <dd>{{ data.typography.size }} / {{ data.typography.lineHeight }}</dd>
          <dt class="text-muted-foreground">weight</dt>
          <dd>{{ data.typography.weight }}</dd>
        </dl>
      </section>

      <!-- Classes -->
      <section v-if="data.classes.length">
        <div class="mb-1.5 flex items-center justify-between">
          <h3 class="font-medium text-muted-foreground">Classes ({{ data.classes.length }})</h3>
          <button
            v-if="data.classes.length > 12"
            type="button"
            class="text-primary hover:underline"
            @click="showAllClasses = !showAllClasses"
          >
            {{ showAllClasses ? 'Less' : 'All' }}
          </button>
        </div>
        <div class="flex flex-wrap gap-1">
          <code
            v-for="cls in visibleClasses"
            :key="cls"
            class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]"
            >{{ cls }}</code
          >
        </div>
      </section>
    </div>

    <footer class="flex gap-2 border-t p-3">
      <Button
        size="sm"
        variant="outline"
        class="flex-1"
        :disabled="!data.classes.length"
        @click="copyText(data.classes.join(' '), 'Classes')"
      >
        <Icon name="lucide:copy" />Copy classes
      </Button>
      <Button
        size="sm"
        variant="outline"
        class="flex-1"
        @click="pinned && copyText(snippet(pinned), 'Snippet')"
      >
        <Icon name="lucide:code-xml" />Copy snippet
      </Button>
    </footer>
  </aside>
</template>
