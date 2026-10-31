<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  enabled: boolean
  containerRef: HTMLElement | null
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

// Inspector state
const hoveredElement = ref<HTMLElement | null>(null)
const tooltipPosition = ref({ x: 0, y: 0 })
const highlightBox = ref({ x: 0, y: 0, width: 0, height: 0 })

// Window dimensions for tooltip positioning
const windowSize = ref({ width: 0, height: 0 })

function updateWindowSize() {
  if (typeof window !== 'undefined') {
    windowSize.value = { width: window.innerWidth, height: window.innerHeight }
  }
}

// Computed tooltip position that stays within viewport
const safeTooltipPosition = computed(() => ({
  left: `${Math.min(tooltipPosition.value.x, windowSize.value.width - 280)}px`,
  top: `${Math.min(tooltipPosition.value.y, windowSize.value.height - 200)}px`,
}))

// Element info
const elementInfo = ref({
  tagName: '',
  componentName: '',
  classes: [] as string[],
  cssVariables: [] as { name: string; value: string }[],
  dimensions: { width: 0, height: 0 },
})

// Get component name from element
function getComponentName(el: HTMLElement): string {
  // Check for Vue component name via __vueParentComponent
  const vueInstance = (
    el as HTMLElement & {
      __vueParentComponent?: { type?: { name?: string; __name?: string } }
    }
  ).__vueParentComponent
  if (vueInstance?.type?.name) {
    return vueInstance.type.name
  }
  if (vueInstance?.type?.__name) {
    return vueInstance.type.__name
  }

  // Check data attributes
  if (el.dataset.component) {
    return el.dataset.component
  }

  // Check for common UI component patterns
  const classStr = el.className
  if (typeof classStr === 'string') {
    // Look for common shadcn/reka patterns
    if (classStr.includes('button')) return 'Button'
    if (classStr.includes('card')) return 'Card'
    if (classStr.includes('input')) return 'Input'
    if (classStr.includes('badge')) return 'Badge'
    if (classStr.includes('avatar')) return 'Avatar'
    if (classStr.includes('dialog')) return 'Dialog'
    if (classStr.includes('tabs')) return 'Tabs'
    if (classStr.includes('select')) return 'Select'
    if (classStr.includes('checkbox')) return 'Checkbox'
    if (classStr.includes('switch')) return 'Switch'
    if (classStr.includes('slider')) return 'Slider'
    if (classStr.includes('progress')) return 'Progress'
    if (classStr.includes('separator')) return 'Separator'
    if (classStr.includes('tooltip')) return 'Tooltip'
    if (classStr.includes('popover')) return 'Popover'
    if (classStr.includes('dropdown')) return 'Dropdown'
    if (classStr.includes('accordion')) return 'Accordion'
    if (classStr.includes('alert')) return 'Alert'
    if (classStr.includes('table')) return 'Table'
  }

  return ''
}

// Get relevant CSS variables from element
function getCSSVariables(el: HTMLElement): { name: string; value: string }[] {
  const variables: { name: string; value: string }[] = []
  const style = getComputedStyle(el)

  // Check common CSS variable properties
  const varProps = [
    '--color-primary',
    '--color-background',
    '--color-foreground',
    '--color-muted',
    '--color-accent',
    '--color-border',
    '--radius',
  ]

  for (const prop of varProps) {
    const value = style.getPropertyValue(prop).trim()
    if (value) {
      variables.push({ name: prop, value })
    }
  }

  return variables.slice(0, 5) // Limit to 5 variables
}

// Handle mouse move
function handleMouseMove(event: MouseEvent) {
  if (!props.enabled || !props.containerRef) return

  const target = event.target as HTMLElement

  // Skip if it's the inspector overlay itself
  if (target.closest('.element-inspector-overlay')) return

  // Skip if same element
  if (target === hoveredElement.value) {
    // Just update tooltip position
    tooltipPosition.value = { x: event.clientX + 15, y: event.clientY + 15 }
    return
  }

  hoveredElement.value = target

  // Get element bounds relative to viewport
  const rect = target.getBoundingClientRect()
  const containerRect = props.containerRef.getBoundingClientRect()

  // The highlight lives inside the (possibly zoomed) preview frame, so convert
  // viewport pixels back into the frame's own coordinate space.
  const container = props.containerRef
  const scale = container.offsetWidth ? containerRect.width / container.offsetWidth : 1
  highlightBox.value = {
    x: (rect.left - containerRect.left) / scale - container.clientLeft,
    y: (rect.top - containerRect.top) / scale - container.clientTop,
    width: rect.width / scale,
    height: rect.height / scale,
  }

  tooltipPosition.value = { x: event.clientX + 15, y: event.clientY + 15 }

  // Gather element info
  const classes =
    typeof target.className === 'string' ? target.className.split(' ').filter((c) => c.trim()) : []

  elementInfo.value = {
    tagName: target.tagName.toLowerCase(),
    componentName: getComponentName(target),
    classes: classes.slice(0, 6), // Limit classes shown
    cssVariables: getCSSVariables(target),
    dimensions: { width: Math.round(rect.width), height: Math.round(rect.height) },
  }
}

// Handle mouse leave
function handleMouseLeave() {
  hoveredElement.value = null
}

// Handle click to "pin" the inspector on an element
function handleClick(event: MouseEvent) {
  if (!props.enabled) return
  event.preventDefault()
  event.stopPropagation()
}

// Setup/cleanup event listeners (the container ref arrives after mount)
function attach(el: HTMLElement) {
  el.addEventListener('mousemove', handleMouseMove)
  el.addEventListener('mouseleave', handleMouseLeave)
  el.addEventListener('click', handleClick, true)
}

function detach(el: HTMLElement) {
  el.removeEventListener('mousemove', handleMouseMove)
  el.removeEventListener('mouseleave', handleMouseLeave)
  el.removeEventListener('click', handleClick, true)
}

watch(
  () => props.containerRef,
  (el, old) => {
    if (old) detach(old)
    if (el) attach(el)
  },
  { immediate: true }
)

watch(
  () => props.enabled,
  (on) => {
    if (!on) hoveredElement.value = null
  }
)

onMounted(() => {
  updateWindowSize()
  window.addEventListener('resize', updateWindowSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize)
  if (props.containerRef) detach(props.containerRef)
})
</script>

<template>
  <div v-if="enabled" class="element-inspector-overlay pointer-events-none absolute inset-0 z-50">
    <!-- Highlight box -->
    <div
      v-if="hoveredElement"
      class="absolute border-2 border-blue-500 bg-blue-500/10 transition-all duration-75"
      :style="{
        left: `${highlightBox.x}px`,
        top: `${highlightBox.y}px`,
        width: `${highlightBox.width}px`,
        height: `${highlightBox.height}px`,
      }"
    />

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="hoveredElement && enabled"
        class="fixed z-[100] max-w-xs bg-popover border border-border rounded-lg shadow-lg p-3 text-xs pointer-events-none"
        :style="safeTooltipPosition"
      >
        <!-- Tag/Component name -->
        <div class="flex items-center gap-2 mb-2">
          <span class="font-mono text-blue-500">&lt;{{ elementInfo.tagName }}&gt;</span>
          <span
            v-if="elementInfo.componentName"
            class="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium"
          >
            {{ elementInfo.componentName }}
          </span>
        </div>

        <!-- Dimensions -->
        <div class="text-muted-foreground mb-2">
          {{ elementInfo.dimensions.width }} × {{ elementInfo.dimensions.height }}px
        </div>

        <!-- Classes -->
        <div v-if="elementInfo.classes.length > 0" class="mb-2">
          <div class="text-muted-foreground mb-1">Classes:</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="cls in elementInfo.classes"
              :key="cls"
              class="px-1 py-0.5 bg-muted rounded text-[10px] font-mono"
            >
              .{{ cls }}
            </span>
          </div>
        </div>

        <!-- CSS Variables -->
        <div v-if="elementInfo.cssVariables.length > 0">
          <div class="text-muted-foreground mb-1">CSS Variables:</div>
          <div class="space-y-0.5">
            <div
              v-for="cssVar in elementInfo.cssVariables"
              :key="cssVar.name"
              class="flex items-center gap-1 font-mono text-[10px]"
            >
              <span class="text-purple-500">{{ cssVar.name }}</span>
              <span class="text-muted-foreground">:</span>
              <span class="truncate">{{ cssVar.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
