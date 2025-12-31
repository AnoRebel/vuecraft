<script setup lang="ts">
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'

const { config, setComponents } = useDesignSystem()
const { STYLES, BORDER_WIDTHS, ANIMATION_SPEEDS } = useConfigOptions()

const focusRingWidthOptions = [
  { name: 'thin', label: 'Thin' },
  { name: 'default', label: 'Default' },
  { name: 'thick', label: 'Thick' },
]

const focusRingOffsetOptions = [
  { name: 'none', label: 'None' },
  { name: 'sm', label: 'Small' },
  { name: 'default', label: 'Default' },
]
</script>

<template>
  <ConfigSection
    title="Components"
    description="Style, borders, and animations"
    tour-id="components-config-section"
  >
    <div class="space-y-4">
      <!-- Component Style -->
      <OptionPicker
        :model-value="config.components.style"
        :options="
          STYLES.map((s) => ({
            name: s.name,
            label: s.label,
            description: s.description,
          }))
        "
        label="Component Style"
        :columns="2"
        @update:model-value="(v) => setComponents({ style: v as any })"
      />

      <!-- Border Width -->
      <OptionPicker
        :model-value="config.components.borderWidth"
        :options="BORDER_WIDTHS.map((b) => ({ name: b.name, label: b.label }))"
        label="Border Width"
        :columns="4"
        @update:model-value="(v) => setComponents({ borderWidth: v as any })"
      />

      <!-- Animation Speed -->
      <OptionPicker
        :model-value="config.components.animationSpeed"
        :options="ANIMATION_SPEEDS.map((a) => ({ name: a.name, label: a.label }))"
        label="Animation Speed"
        :columns="4"
        @update:model-value="(v) => setComponents({ animationSpeed: v as any })"
      />

      <!-- Focus Ring Width -->
      <OptionPicker
        :model-value="config.components.focusRingWidth"
        :options="focusRingWidthOptions"
        label="Focus Ring Width"
        :columns="3"
        @update:model-value="(v) => setComponents({ focusRingWidth: v as any })"
      />

      <!-- Focus Ring Offset -->
      <OptionPicker
        :model-value="config.components.focusRingOffset"
        :options="focusRingOffsetOptions"
        label="Focus Ring Offset"
        :columns="3"
        @update:model-value="(v) => setComponents({ focusRingOffset: v as any })"
      />
    </div>
  </ConfigSection>
</template>
