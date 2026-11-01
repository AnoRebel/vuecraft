<script setup lang="ts">
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'
import type { MenuAccent, MenuColor } from '~/types/config'

const { config, setLayout, setTheme } = useDesignSystem()
const { SPACING_SCALES, CONTAINER_WIDTHS } = useConfigOptions()

const sidebarWidthOptions = [
  { name: 'narrow', label: 'Narrow', description: '240px' },
  { name: 'default', label: 'Default', description: '280px' },
  { name: 'wide', label: 'Wide', description: '320px' },
]

const headerHeightOptions = [
  { name: 'compact', label: 'Compact', description: '48px' },
  { name: 'default', label: 'Default', description: '64px' },
  { name: 'tall', label: 'Tall', description: '80px' },
]
</script>

<template>
  <div>
    <ConfigSection title="Layout" static>
      <div class="space-y-4">
        <!-- Spacing Scale -->
        <OptionPicker
          id="setting-spacing"
          :model-value="config.layout.spacingScale"
          :options="
            SPACING_SCALES.map((s) => ({
              name: s.name,
              label: s.label,
            }))
          "
          label="Spacing"
          @update:model-value="(v) => setLayout({ spacingScale: v as any })"
        />

        <!-- Container Width -->
        <OptionPicker
          id="setting-container"
          :model-value="config.layout.containerWidth"
          :options="
            CONTAINER_WIDTHS.map((c) => ({
              name: c.name,
              label: c.name === 'full' ? 'Full' : c.name.toUpperCase(),
              description: `${c.label} · ${c.value}`,
            }))
          "
          label="Container width"
          @update:model-value="(v) => setLayout({ containerWidth: v as any })"
        />

        <!-- Sidebar Width -->
        <OptionPicker
          id="setting-sidebar-width"
          :model-value="config.layout.sidebarWidth"
          :options="sidebarWidthOptions"
          label="Sidebar width"
          @update:model-value="(v) => setLayout({ sidebarWidth: v as any })"
        />

        <!-- Header Height -->
        <OptionPicker
          id="setting-header-height"
          :model-value="config.layout.headerHeight"
          :options="headerHeightOptions"
          label="Header height"
          @update:model-value="(v) => setLayout({ headerHeight: v as any })"
        />
      </div>
    </ConfigSection>

    <ConfigSection title="Navigation menu">
      <OptionPicker
        id="setting-menu-color"
        :model-value="config.theme.menuColor"
        :options="[
          { name: 'default', label: 'Default', description: 'Sidebar uses the sidebar colours' },
          { name: 'inverted', label: 'Inverted', description: 'Dark sidebar on light pages' },
        ]"
        label="Menu color"
        @update:model-value="(v) => setTheme({ menuColor: v as MenuColor })"
      />
      <OptionPicker
        id="setting-menu-accent"
        :model-value="config.theme.menuAccent"
        :options="[
          { name: 'subtle', label: 'Subtle', description: 'Active item uses the accent surface' },
          { name: 'bold', label: 'Bold', description: 'Active item uses the primary colour' },
        ]"
        label="Active item"
        @update:model-value="(v) => setTheme({ menuAccent: v as MenuAccent })"
      />
    </ConfigSection>
  </div>
</template>
