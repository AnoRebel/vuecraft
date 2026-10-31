<script setup lang="ts">
import { useResponsivePreview } from '~/composables/useResponsivePreview'
import { Button } from '~/components/ui/button'

const {
  isRotated,
  zoom,
  quickPresets,
  currentBreakpoint,
  currentDimensions,
  setQuickPreset,
  toggleRotation,
  zoomIn,
  zoomOut,
  setZoom,
  activeQuick,
} = useResponsivePreview()

const emit = defineEmits<{
  (e: 'change'): void
}>()

function handlePresetChange(presetId: string) {
  setQuickPreset(presetId)
  emit('change')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Device Presets -->
    <div class="flex rounded-md border divide-x">
      <Button
        v-for="preset in quickPresets"
        :key="preset.id"
        variant="ghost"
        size="sm"
        class="rounded-none first:rounded-l-md last:rounded-r-md px-2.5"
        :class="{ 'bg-accent text-accent-foreground': activeQuick === preset.id }"
        :aria-label="preset.name ?? preset.id"
        :title="preset.name ?? preset.id"
        :aria-pressed="activeQuick === preset.id"
        @click="handlePresetChange(preset.id)"
      >
        <Icon :name="`lucide:${preset.icon}`" class="h-4 w-4" />
      </Button>
    </div>

    <!-- Rotation Toggle -->
    <Button
      v-if="activeQuick !== 'full'"
      variant="ghost"
      size="sm"
      :class="{ 'bg-accent': isRotated }"
      aria-label="Rotate device"
      @click="toggleRotation"
    >
      <Icon name="lucide:rotate-cw" class="h-4 w-4" />
    </Button>

    <!-- Zoom Controls -->
    <div class="flex items-center gap-1">
      <Button variant="ghost" size="sm" aria-label="Zoom out" @click="zoomOut()">
        <Icon name="lucide:minus" class="h-4 w-4" />
      </Button>
      <button
        type="button"
        class="w-12 rounded text-center text-xs text-muted-foreground hover:text-foreground"
        title="Reset zoom"
        @click="setZoom(100)"
      >
        {{ zoom }}%
      </button>
      <Button variant="ghost" size="sm" aria-label="Zoom in" @click="zoomIn()">
        <Icon name="lucide:plus" class="h-4 w-4" />
      </Button>
    </div>

    <!-- Current dimensions -->
    <span class="ml-2 hidden min-w-16 text-xs text-muted-foreground tabular-nums xl:inline">
      <template v-if="typeof currentDimensions.width === 'number'">
        {{ currentDimensions.width }} × {{ currentDimensions.height }}
      </template>
      <template v-else>
        {{ currentBreakpoint }}
      </template>
    </span>
  </div>
</template>
