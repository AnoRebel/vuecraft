<script setup lang="ts">
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'
import { Select } from '~/components/ui/select'
import { Label } from '~/components/ui/label'

const { config, setTypography } = useDesignSystem()
const { FONT_FAMILIES, MONO_FONT_FAMILIES, FONT_SCALES } = useConfigOptions()

const fontFamilyOptions = FONT_FAMILIES.map((f) => ({
  value: f.name,
  label: f.label,
}))

const monoFontOptions = MONO_FONT_FAMILIES.map((f) => ({
  value: f.name,
  label: f.label,
}))

const headingWeightOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
]

const lineHeightOptions = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relaxed' },
]
</script>

<template>
  <ConfigSection title="Typography" description="Fonts and text styling" tour-id="typography-config-section">
    <div class="space-y-4">
      <!-- Font Family -->
      <div class="space-y-2">
        <Label>Font Family</Label>
        <Select
          :model-value="config.typography.fontFamily"
          :options="fontFamilyOptions"
          placeholder="Select font"
          @update:model-value="(v) => setTypography({ fontFamily: v as any })"
        />
        <p
          class="text-sm text-muted-foreground mt-2"
          :style="{
            fontFamily: FONT_FAMILIES.find((f) => f.name === config.typography.fontFamily)?.label,
          }"
        >
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      <!-- Mono Font Family -->
      <div class="space-y-2">
        <Label>Monospace Font</Label>
        <Select
          :model-value="config.typography.monoFontFamily"
          :options="monoFontOptions"
          placeholder="Select mono font"
          @update:model-value="(v) => setTypography({ monoFontFamily: v as any })"
        />
        <p class="text-sm text-muted-foreground font-mono mt-2">const code = "example";</p>
      </div>

      <!-- Font Scale -->
      <OptionPicker
        :model-value="config.typography.fontScale"
        :options="
          FONT_SCALES.map((s) => ({
            name: s.name,
            label: s.label,
            description: s.description,
          }))
        "
        label="Font Scale"
        :columns="2"
        @update:model-value="(v) => setTypography({ fontScale: v as any })"
      />

      <!-- Heading Weight -->
      <div class="space-y-2">
        <Label>Heading Weight</Label>
        <Select
          :model-value="config.typography.headingWeight"
          :options="headingWeightOptions"
          @update:model-value="(v) => setTypography({ headingWeight: v as any })"
        />
      </div>

      <!-- Line Height -->
      <OptionPicker
        :model-value="config.typography.bodyLineHeight"
        :options="lineHeightOptions.map((o) => ({ name: o.value, label: o.label }))"
        label="Body Line Height"
        :columns="3"
        @update:model-value="(v) => setTypography({ bodyLineHeight: v as any })"
      />
    </div>
  </ConfigSection>
</template>
