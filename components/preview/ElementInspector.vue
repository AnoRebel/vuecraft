<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useElementInspector, describe } from '~/composables/useElementInspector'

const { enabled, hovered, pinned, container } = useElementInspector()

interface Box {
  x: number
  y: number
  width: number
  height: number
}

const hoverBox = ref<Box | null>(null)
const pinBox = ref<Box | null>(null)
const tooltip = ref({ x: 0, y: 0 })

/** Box of an element in the (possibly zoomed) frame's own coordinates */
function boxOf(el: HTMLElement | null): Box | null {
  const root = container.value
  if (!el || !root) return null
  const rect = el.getBoundingClientRect()
  const rootRect = root.getBoundingClientRect()
  const scale = root.offsetWidth ? rootRect.width / root.offsetWidth : 1
  return {
    x: (rect.left - rootRect.left) / scale - root.clientLeft,
    y: (rect.top - rootRect.top) / scale - root.clientTop,
    width: rect.width / scale,
    height: rect.height / scale,
  }
}

function targetFrom(event: Event): HTMLElement | null {
  const t = event.target as HTMLElement | null
  if (!t || !container.value || t === container.value) return null
  if (t.closest('[data-inspector-ui]')) return null
  // Prefer the element itself; SVG children resolve to their <svg>
  const el = t instanceof SVGElement ? (t.closest('svg') as unknown as HTMLElement) : t
  return container.value.contains(el) ? el : null
}

function onMove(event: MouseEvent) {
  if (!enabled.value) return
  const el = targetFrom(event)
  hovered.value = el
  hoverBox.value = boxOf(el)
  tooltip.value = {
    x: Math.min(event.clientX + 14, window.innerWidth - 130),
    y: Math.min(event.clientY + 14, window.innerHeight - 40),
  }
}

function onLeave() {
  hovered.value = null
  hoverBox.value = null
}

function onClick(event: MouseEvent) {
  if (!enabled.value) return
  const el = targetFrom(event)
  if (!el) return
  // Inspecting must not trigger the preview's own handlers
  event.preventDefault()
  event.stopPropagation()
  pinned.value = el
}

function refreshPinned() {
  pinBox.value = boxOf(pinned.value)
}

watch(pinned, refreshPinned)

let observer: ResizeObserver | null = null

watch(
  container,
  (el, old) => {
    old?.removeEventListener('mousemove', onMove)
    old?.removeEventListener('mouseleave', onLeave)
    old?.removeEventListener('click', onClick, true)
    observer?.disconnect()
    if (!el) return
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('click', onClick, true)
    observer = new ResizeObserver(refreshPinned)
    observer.observe(el)
  },
  { immediate: true }
)

watch(enabled, (on) => {
  if (!on) {
    hoverBox.value = null
    pinBox.value = null
  }
})

onUnmounted(() => {
  const el = container.value
  el?.removeEventListener('mousemove', onMove)
  el?.removeEventListener('mouseleave', onLeave)
  el?.removeEventListener('click', onClick, true)
  observer?.disconnect()
})
</script>

<template>
  <div v-if="enabled" data-inspector-ui class="pointer-events-none absolute inset-0 z-50">
    <!-- Pinned element -->
    <div
      v-if="pinBox"
      class="absolute rounded-[2px] outline-2 outline-offset-0 outline-orange-500"
      style="outline-style: solid; background: rgb(249 115 22 / 0.08)"
      :style="{
        left: `${pinBox.x}px`,
        top: `${pinBox.y}px`,
        width: `${pinBox.width}px`,
        height: `${pinBox.height}px`,
      }"
    />

    <!-- Hovered element -->
    <div
      v-if="hoverBox && hovered !== pinned"
      class="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 transition-[left,top,width,height] duration-75"
      :style="{
        left: `${hoverBox.x}px`,
        top: `${hoverBox.y}px`,
        width: `${hoverBox.width}px`,
        height: `${hoverBox.height}px`,
      }"
    >
      <span
        class="absolute -top-5 left-0 whitespace-nowrap rounded bg-sky-500 px-1.5 py-px font-mono text-[10px] text-white"
      >
        {{ hovered ? describe(hovered) : '' }} · {{ Math.round(hoverBox.width) }}×{{
          Math.round(hoverBox.height)
        }}
      </span>
    </div>

    <Teleport to="body">
      <div
        v-if="hovered && !pinned"
        class="pointer-events-none fixed z-[100] rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
      >
        Click to inspect
      </div>
    </Teleport>
  </div>
</template>
