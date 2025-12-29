<script setup lang="ts">
import { useDesignSystem } from '~/composables/useDesignSystem'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import PresetThemes from './PresetThemes.vue'
import ThemeConfig from './ThemeConfig.vue'
import TypographyConfig from './TypographyConfig.vue'
import ComponentsConfig from './ComponentsConfig.vue'
import IconsConfig from './IconsConfig.vue'
import LayoutConfig from './LayoutConfig.vue'
import ComponentSelection from './ComponentSelection.vue'
import ExportConfig from './ExportConfig.vue'

const { resetAll, randomize } = useDesignSystem()
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-4 py-3">
      <h2 class="font-semibold">Configuration</h2>
      <div class="flex gap-2" data-tour-guide="shuffle-reset-buttons">
        <Button variant="ghost" size="sm" @click="randomize">
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
          >
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
          </svg>
          <span class="ml-1">Shuffle</span>
        </Button>
        <Button variant="ghost" size="sm" @click="resetAll">
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
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span class="ml-1">Reset</span>
        </Button>
      </div>
    </div>

    <!-- Config Sections -->
    <ScrollArea class="flex-1 px-4">
      <div class="py-2">
        <PresetThemes />
        <ThemeConfig />
        <TypographyConfig />
        <ComponentsConfig />
        <IconsConfig />
        <LayoutConfig />
        <ComponentSelection />
        <ExportConfig />
      </div>
    </ScrollArea>
  </div>
</template>
