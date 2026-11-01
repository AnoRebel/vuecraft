<script setup lang="ts">
import { useDesignSystem } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'

const { config, setExport } = useDesignSystem()

const frameworkOptions = [
  { name: 'vue', label: 'Vue', description: 'Vite + Vue 3' },
  { name: 'nuxt', label: 'Nuxt', description: 'Nuxt 3/4' },
]

const formatOptions = [
  { name: 'css', label: 'CSS Only' },
  { name: 'json', label: 'JSON Only' },
  { name: 'both', label: 'Both' },
]
</script>

<template>
  <ConfigSection title="Output" static>
    <div class="space-y-4">
      <!-- Framework Target -->
      <OptionPicker
        id="setting-framework"
        :model-value="config.export.framework"
        :options="frameworkOptions"
        label="Framework"
        @update:model-value="(v) => setExport({ framework: v as any })"
      />

      <!-- Export Format -->
      <OptionPicker
        id="setting-export-format"
        :model-value="config.export.format"
        :options="formatOptions"
        label="Format"
        @update:model-value="(v) => setExport({ format: v as any })"
      />

      <!-- TypeScript -->
      <div id="setting-typescript" class="flex items-center justify-between gap-3">
        <div>
          <Label>TypeScript</Label>
          <p class="text-xs text-muted-foreground">Generate TypeScript compatible exports</p>
        </div>
        <Switch
          :model-value="config.export.typescript"
          @update:model-value="(v) => setExport({ typescript: v })"
        />
      </div>

      <!-- CSS Variables Prefix -->
      <div id="setting-prefix" class="space-y-1.5">
        <Label>CSS variable prefix</Label>
        <Input
          :model-value="config.export.cssVariablesPrefix"
          placeholder="e.g., my-app"
          @update:model-value="(v) => setExport({ cssVariablesPrefix: String(v) })"
        />
        <p class="text-xs text-muted-foreground">
          Optional prefix for CSS variables (e.g., --my-app-primary)
        </p>
      </div>
    </div>
  </ConfigSection>
</template>
