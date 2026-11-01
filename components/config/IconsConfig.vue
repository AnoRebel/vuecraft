<script setup lang="ts">
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'

const { config, setIcons } = useDesignSystem()
const { ICON_LIBRARIES } = useConfigOptions()

const iconSizeOptions = [
  { name: 'sm', label: 'Small', description: '16px' },
  { name: 'md', label: 'Medium', description: '20px' },
  { name: 'lg', label: 'Large', description: '24px' },
]

const strokeWidthOptions = [
  { name: 'thin', label: 'Thin', description: '1.5' },
  { name: 'default', label: 'Default', description: '2' },
  { name: 'thick', label: 'Thick', description: '2.5' },
]
</script>

<template>
  <ConfigSection title="Icons">
    <div class="space-y-4">
      <!-- Icon Library -->
      <OptionPicker
        id="setting-icon-library"
        :model-value="config.icons.library"
        :options="
          ICON_LIBRARIES.map((i) => ({
            name: i.name,
            label: i.label,
            description: i.description,
          }))
        "
        label="Library"
        @update:model-value="(v) => setIcons({ library: v as any })"
      />

      <!-- Default Icon Size -->
      <OptionPicker
        id="setting-icon-size"
        :model-value="config.icons.defaultSize"
        :options="iconSizeOptions"
        label="Size"
        @update:model-value="(v) => setIcons({ defaultSize: v as any })"
      />

      <!-- Stroke Width -->
      <OptionPicker
        id="setting-icon-stroke"
        :model-value="config.icons.strokeWidth"
        :options="strokeWidthOptions"
        label="Stroke"
        @update:model-value="(v) => setIcons({ strokeWidth: v as any })"
      />
    </div>
  </ConfigSection>
</template>
