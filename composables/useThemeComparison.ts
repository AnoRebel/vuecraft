/**
 * Theme Comparison for Vuecraft
 * Compare two themes side-by-side and view differences
 */

import { ref, computed } from 'vue'
import type { SerializedConfig, ThemeConfig, TypographyConfig, ComponentsConfig } from '~/types/config'
import { PRESET_THEMES } from '~/config/defaults'

export interface ThemeDiff {
  path: string
  property: string
  leftValue: unknown
  rightValue: unknown
  changed: boolean
  category: 'theme' | 'typography' | 'components' | 'icons' | 'layout'
}

export interface ComparisonTheme {
  id: string
  name: string
  source: 'current' | 'saved' | 'preset' | 'imported'
  config: SerializedConfig
}

export function useThemeComparison() {
  const leftTheme = ref<ComparisonTheme | null>(null)
  const rightTheme = ref<ComparisonTheme | null>(null)
  const isComparing = ref(false)

  /**
   * Set the left theme for comparison
   */
  function setLeftTheme(theme: ComparisonTheme): void {
    leftTheme.value = theme
  }

  /**
   * Set the right theme for comparison
   */
  function setRightTheme(theme: ComparisonTheme): void {
    rightTheme.value = theme
  }

  /**
   * Load current config into a side
   */
  function loadCurrentTheme(side: 'left' | 'right', config: SerializedConfig): void {
    const theme: ComparisonTheme = {
      id: 'current',
      name: 'Current Theme',
      source: 'current',
      config: structuredClone(config),
    }

    if (side === 'left') {
      leftTheme.value = theme
    } else {
      rightTheme.value = theme
    }
  }

  /**
   * Load a preset theme into a side
   */
  function loadPresetTheme(side: 'left' | 'right', presetName: string): void {
    const preset = PRESET_THEMES.find((p) => p.name === presetName)
    if (!preset) return

    const config: SerializedConfig = {
      v: 1,
      t: preset.config.theme as ThemeConfig,
      ty: preset.config.typography as TypographyConfig,
      c: preset.config.components as ComponentsConfig,
      i: { library: 'lucide', defaultSize: 'md', strokeWidth: 'default' },
      l: { containerWidth: 'xl', spacingScale: 'default', sidebarWidth: 'default', headerHeight: 'default' },
    }

    const theme: ComparisonTheme = {
      id: `preset-${presetName}`,
      name: preset.label,
      source: 'preset',
      config,
    }

    if (side === 'left') {
      leftTheme.value = theme
    } else {
      rightTheme.value = theme
    }
  }

  /**
   * Load a saved config into a side
   */
  function loadSavedTheme(side: 'left' | 'right', id: string, name: string, config: SerializedConfig): void {
    const theme: ComparisonTheme = {
      id: `saved-${id}`,
      name,
      source: 'saved',
      config: structuredClone(config),
    }

    if (side === 'left') {
      leftTheme.value = theme
    } else {
      rightTheme.value = theme
    }
  }

  /**
   * Import a theme from JSON
   */
  function loadImportedTheme(side: 'left' | 'right', config: SerializedConfig, name: string = 'Imported'): void {
    const theme: ComparisonTheme = {
      id: `imported-${Date.now()}`,
      name,
      source: 'imported',
      config: structuredClone(config),
    }

    if (side === 'left') {
      leftTheme.value = theme
    } else {
      rightTheme.value = theme
    }
  }

  /**
   * Compare the two themes and return differences
   */
  function compareThemes(): ThemeDiff[] {
    if (!leftTheme.value || !rightTheme.value) return []

    const diffs: ThemeDiff[] = []
    const left = leftTheme.value.config
    const right = rightTheme.value.config

    // Compare theme settings
    compareObjects(left.t, right.t, 'theme', 'theme', diffs)

    // Compare typography settings
    compareObjects(left.ty, right.ty, 'typography', 'typography', diffs)

    // Compare component settings
    compareObjects(left.c, right.c, 'components', 'components', diffs)

    // Compare icon settings
    compareObjects(left.i, right.i, 'icons', 'icons', diffs)

    // Compare layout settings
    compareObjects(left.l, right.l, 'layout', 'layout', diffs)

    return diffs
  }

  /**
   * Recursively compare two objects
   */
  function compareObjects(
    left: Record<string, unknown> | undefined,
    right: Record<string, unknown> | undefined,
    path: string,
    category: ThemeDiff['category'],
    diffs: ThemeDiff[]
  ): void {
    const allKeys = new Set([...Object.keys(left || {}), ...Object.keys(right || {})])

    for (const key of allKeys) {
      const leftValue = left?.[key]
      const rightValue = right?.[key]
      const fullPath = `${path}.${key}`

      if (typeof leftValue === 'object' && typeof rightValue === 'object' && leftValue && rightValue) {
        // Recursively compare nested objects
        compareObjects(
          leftValue as Record<string, unknown>,
          rightValue as Record<string, unknown>,
          fullPath,
          category,
          diffs
        )
      } else {
        // Compare primitive values
        const changed = JSON.stringify(leftValue) !== JSON.stringify(rightValue)
        diffs.push({
          path: fullPath,
          property: key,
          leftValue,
          rightValue,
          changed,
          category,
        })
      }
    }
  }

  /**
   * Get only the changed properties
   */
  const changedProperties = computed(() => {
    return compareThemes().filter((diff) => diff.changed)
  })

  /**
   * Get differences grouped by category
   */
  const diffsByCategory = computed(() => {
    const diffs = compareThemes()
    return {
      theme: diffs.filter((d) => d.category === 'theme'),
      typography: diffs.filter((d) => d.category === 'typography'),
      components: diffs.filter((d) => d.category === 'components'),
      icons: diffs.filter((d) => d.category === 'icons'),
      layout: diffs.filter((d) => d.category === 'layout'),
    }
  })

  /**
   * Get a summary of differences
   */
  const diffSummary = computed(() => {
    const changed = changedProperties.value
    return {
      totalChanges: changed.length,
      byCategory: {
        theme: changed.filter((d) => d.category === 'theme').length,
        typography: changed.filter((d) => d.category === 'typography').length,
        components: changed.filter((d) => d.category === 'components').length,
        icons: changed.filter((d) => d.category === 'icons').length,
        layout: changed.filter((d) => d.category === 'layout').length,
      },
    }
  })

  /**
   * Swap left and right themes
   */
  function swapThemes(): void {
    const temp = leftTheme.value
    leftTheme.value = rightTheme.value
    rightTheme.value = temp
  }

  /**
   * Clear comparison
   */
  function clear(): void {
    leftTheme.value = null
    rightTheme.value = null
    isComparing.value = false
  }

  /**
   * Start comparison mode
   */
  function startComparing(): void {
    isComparing.value = true
  }

  /**
   * Stop comparison mode
   */
  function stopComparing(): void {
    isComparing.value = false
  }

  /**
   * Format a value for display
   */
  function formatValue(value: unknown): string {
    if (value === undefined) return '—'
    if (value === null) return 'null'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (Array.isArray(value)) return value.join(', ')
    return String(value)
  }

  /**
   * Get available presets for comparison
   */
  const availablePresets = computed(() => {
    return PRESET_THEMES.map((p) => ({
      name: p.name,
      label: p.label,
      description: p.description,
    }))
  })

  return {
    // State
    leftTheme,
    rightTheme,
    isComparing,
    changedProperties,
    diffsByCategory,
    diffSummary,
    availablePresets,

    // Actions
    setLeftTheme,
    setRightTheme,
    loadCurrentTheme,
    loadPresetTheme,
    loadSavedTheme,
    loadImportedTheme,
    compareThemes,
    swapThemes,
    clear,
    startComparing,
    stopComparing,

    // Utilities
    formatValue,
  }
}
