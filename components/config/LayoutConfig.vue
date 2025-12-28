<script setup lang="ts">
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'

const { config, setLayout } = useDesignSystem()
const { SPACING_SCALES, CONTAINER_WIDTHS } = useConfigOptions()

const sidebarWidthOptions = [
  { name: 'narrow', label: 'Narrow', description: '240px' },
  { name: 'default', label: 'Default', description: '280px' },
  { name: 'wide', label: 'Wide', description: '320px' }
]

const headerHeightOptions = [
  { name: 'compact', label: 'Compact', description: '48px' },
  { name: 'default', label: 'Default', description: '64px' },
  { name: 'tall', label: 'Tall', description: '80px' }
]
</script>

<template>
  <ConfigSection title="Layout" description="Spacing and container settings">
    <div class="space-y-4">
      <!-- Spacing Scale -->
      <OptionPicker
        :model-value="config.layout.spacingScale"
        :options="SPACING_SCALES.map(s => ({
          name: s.name,
          label: s.label
        }))"
        label="Spacing Scale"
        :columns="4"
        @update:model-value="(v) => setLayout({ spacingScale: v as any })"
      />

      <!-- Container Width -->
      <OptionPicker
        :model-value="config.layout.containerWidth"
        :options="CONTAINER_WIDTHS.map(c => ({
          name: c.name,
          label: c.label,
          description: c.value
        }))"
        label="Container Width"
        :columns="3"
        @update:model-value="(v) => setLayout({ containerWidth: v as any })"
      />

      <!-- Sidebar Width -->
      <OptionPicker
        :model-value="config.layout.sidebarWidth"
        :options="sidebarWidthOptions"
        label="Sidebar Width"
        :columns="3"
        @update:model-value="(v) => setLayout({ sidebarWidth: v as any })"
      />

      <!-- Header Height -->
      <OptionPicker
        :model-value="config.layout.headerHeight"
        :options="headerHeightOptions"
        label="Header Height"
        :columns="3"
        @update:model-value="(v) => setLayout({ headerHeight: v as any })"
      />
    </div>
  </ConfigSection>
</template>
