<script setup lang="ts">
import { useResponsivePreview } from '~/composables/useResponsivePreview'
import { Button } from '~/components/ui/button'

const {
  activePreset,
  isRotated,
  zoom,
  quickPresets,
  currentBreakpoint,
  currentDimensions,
  setQuickPreset,
  toggleRotation,
  zoomIn,
  zoomOut,
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
        class="rounded-none first:rounded-l-md last:rounded-r-md px-3"
        :class="{
          'bg-accent': (preset.id === 'full' && !activePreset) || activePreset === preset.id,
        }"
        @click="handlePresetChange(preset.id)"
      >
        <Icon :name="`lucide:${preset.icon}`" class="h-4 w-4" />
      </Button>
    </div>

    <!-- Rotation Toggle -->
    <Button
      v-if="activePreset && activePreset !== 'full'"
      variant="ghost"
      size="sm"
      :class="{ 'bg-accent': isRotated }"
      @click="toggleRotation"
    >
      <Icon name="lucide:rotate-cw" class="h-4 w-4" />
    </Button>

    <!-- Zoom Controls -->
    <div class="flex items-center gap-1">
      <Button variant="ghost" size="sm" @click="zoomOut()">
        <Icon name="lucide:minus" class="h-4 w-4" />
      </Button>
      <span class="text-xs w-12 text-center text-muted-foreground">{{ zoom }}%</span>
      <Button variant="ghost" size="sm" @click="zoomIn()">
        <Icon name="lucide:plus" class="h-4 w-4" />
      </Button>
    </div>

    <!-- Current dimensions -->
    <span class="text-xs text-muted-foreground ml-2">
      <template v-if="typeof currentDimensions.width === 'number'">
        {{ currentDimensions.width }} × {{ currentDimensions.height }}
      </template>
      <template v-else>
        {{ currentBreakpoint }}
      </template>
    </span>
  </div>
</template>
