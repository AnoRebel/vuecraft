<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import { BASE_COLOR_THEMES } from '~/config/themes'
import ConfigSection from './ConfigSection.vue'
import ColorPicker from './ColorPicker.vue'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import type { BaseColorName, ThemeName } from '~/types/config'

const { config, setTheme } = useDesignSystem()
const { BASE_COLORS, ACCENT_THEMES } = useConfigOptions()

// Base colours shown with a mid tone of each neutral family
const baseOptions = BASE_COLORS.map((b) => ({
  name: b.name,
  label: b.label,
  color: BASE_COLOR_THEMES[b.name as BaseColorName].light.mutedForeground,
}))

const NEUTRALS = ['neutral', 'stone', 'zinc', 'gray', 'slate']
const accentGroups = [
  { label: 'Neutral', items: ACCENT_THEMES.filter((t) => NEUTRALS.includes(t.name)) },
  { label: 'Vibrant', items: ACCENT_THEMES.filter((t) => !NEUTRALS.includes(t.name)) },
]

// Custom primary colour (stored in the configuration)
const customColorHex = ref('#6366f1')
const isCustomColorActive = computed(() => !!config.theme.customPrimary)
const presetPalette = computed(() => !!config.theme.custom?.light)

watch(
  () => config.theme.customPrimary,
  (value) => {
    if (value && /^#[0-9a-f]{6}$/i.test(value)) customColorHex.value = value
  },
  { immediate: true }
)

const accentLabel = computed(() =>
  isCustomColorActive.value
    ? `Custom ${config.theme.customPrimary}`
    : (ACCENT_THEMES.find((t) => t.name === config.theme.accentTheme)?.label ?? '')
)

function selectAccentTheme(name: string) {
  setTheme({ accentTheme: name as ThemeName })
}

function selectCustomColor() {
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(customColorHex.value)) {
    setTheme({ customPrimary: customColorHex.value })
  }
}
</script>

<template>
  <ConfigSection title="Colors" static tour-id="theme-config-section">
    <p
      v-if="presetPalette"
      class="flex items-start gap-2 rounded-md bg-muted px-2.5 py-2 text-xs text-muted-foreground"
    >
      <Icon name="lucide:info" class="mt-0.5 size-3.5 shrink-0" />
      The palette comes from the active preset. Choosing a base or accent colour replaces it.
    </p>

    <ColorPicker
      id="setting-base-color"
      :model-value="config.theme.baseColor"
      :options="baseOptions"
      label="Base color"
      :show-format="true"
      @update:model-value="(v) => setTheme({ baseColor: v as BaseColorName })"
    />

    <div id="setting-accent" class="space-y-1.5">
      <div class="flex items-baseline justify-between gap-2">
        <span class="text-sm font-medium">Accent</span>
        <span class="truncate text-xs text-muted-foreground">{{ accentLabel }}</span>
      </div>
      <div v-for="group in accentGroups" :key="group.label" class="space-y-1">
        <p class="text-[11px] text-muted-foreground">{{ group.label }}</p>
        <div
          class="flex flex-wrap gap-1.5"
          role="radiogroup"
          :aria-label="`${group.label} accents`"
        >
          <button
            v-for="theme in group.items"
            :key="theme.name"
            type="button"
            role="radio"
            :aria-checked="config.theme.accentTheme === theme.name && !isCustomColorActive"
            :aria-label="theme.label"
            :title="theme.label"
            class="size-6 rounded-full border shadow-xs transition-transform hover:scale-110"
            :class="{
              'ring-2 ring-ring ring-offset-2 ring-offset-background':
                config.theme.accentTheme === theme.name && !isCustomColorActive,
            }"
            :style="{ backgroundColor: theme.color }"
            @click="selectAccentTheme(theme.name)"
          />
        </div>
      </div>
    </div>

    <div id="setting-custom-color" class="space-y-1.5">
      <span class="text-sm font-medium">Custom primary</span>
      <div class="flex items-center gap-2">
        <input
          v-model="customColorHex"
          type="color"
          class="h-8 w-10 shrink-0 cursor-pointer rounded-md border bg-transparent p-0.5"
          :class="{ 'ring-2 ring-ring ring-offset-2 ring-offset-background': isCustomColorActive }"
          aria-label="Custom primary color"
          @input="selectCustomColor"
        />
        <Input
          v-model="customColorHex"
          type="text"
          class="h-8 flex-1 font-mono text-xs"
          placeholder="#6366f1"
          aria-label="Custom primary color hex value"
          @change="selectCustomColor"
        />
        <Button
          v-if="isCustomColorActive"
          variant="ghost"
          size="sm"
          class="h-8 px-2 text-xs"
          @click="setTheme({ customPrimary: null })"
        >
          Clear
        </Button>
      </div>
    </div>
  </ConfigSection>
</template>
