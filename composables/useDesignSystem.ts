import { defu } from 'defu'
import { useStorage, useClipboard, watchDebounced } from '@vueuse/core'
import type {
  DesignSystemConfig,
  ThemeConfig,
  TypographyConfig,
  ComponentsConfig,
  IconsConfig,
  LayoutConfig,
  ExportConfig,
  SerializedConfig,
} from '~/types/config'
import {
  DEFAULT_CONFIG,
  DEFAULT_THEME_CONFIG,
  DEFAULT_TYPOGRAPHY_CONFIG,
  DEFAULT_COMPONENTS_CONFIG,
  DEFAULT_ICONS_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_EXPORT_CONFIG,
  UI_LIBRARIES as UI_LIBRARIES_OPTIONS,
  BASE_COLORS as BASE_COLORS_OPTIONS,
  ACCENT_THEMES as ACCENT_THEMES_OPTIONS,
  STYLES as STYLES_OPTIONS,
  RADIUS_OPTIONS as RADIUS_OPTIONS_LIST,
  ICON_LIBRARIES as ICON_LIBRARIES_OPTIONS,
  FONT_FAMILIES as FONT_FAMILIES_OPTIONS,
  MONO_FONT_FAMILIES as MONO_FONT_FAMILIES_OPTIONS,
  FONT_SCALES as FONT_SCALES_OPTIONS,
  SPACING_SCALES as SPACING_SCALES_OPTIONS,
  ANIMATION_SPEEDS as ANIMATION_SPEEDS_OPTIONS,
  SHADOW_INTENSITIES as SHADOW_INTENSITIES_OPTIONS,
  BORDER_WIDTHS as BORDER_WIDTHS_OPTIONS,
  CONTAINER_WIDTHS as CONTAINER_WIDTHS_OPTIONS,
  AVAILABLE_COMPONENTS as AVAILABLE_COMPONENTS_LIST,
  COMPONENT_CATEGORIES as COMPONENT_CATEGORIES_LIST,
  PREVIEW_TEMPLATES as PREVIEW_TEMPLATES_OPTIONS,
  PRESET_THEMES as PRESET_THEMES_LIST,
} from '~/config/defaults'

// Current version of the config serialization format
const CONFIG_VERSION = 1

// Storage key for saved configurations
const STORAGE_KEY = 'shadcn-vue-create-config'
const SAVED_CONFIGS_KEY = 'shadcn-vue-create-saved-configs'

// Saved configuration type
export interface SavedConfig {
  id: string
  name: string
  createdAt: number
  config: SerializedConfig
}

// State using VueUse's useStorage for persistence
const config = reactive<DesignSystemConfig>(structuredClone(DEFAULT_CONFIG))
const isInitialized = ref(false)
const isDirty = ref(false)

// Use VueUse's useStorage for saved configurations
const savedConfigs = useStorage<SavedConfig[]>(SAVED_CONFIGS_KEY, [])

// Use VueUse's useClipboard for clipboard operations
const { copy, copied, isSupported: isClipboardSupported } = useClipboard()

// Serialize config for URL/JSON
function serializeConfig(): SerializedConfig {
  return {
    v: CONFIG_VERSION,
    t: toRaw(config.theme),
    ty: toRaw(config.typography),
    c: toRaw(config.components),
    i: toRaw(config.icons),
    l: toRaw(config.layout),
  }
}

// Deserialize config from URL/JSON
function deserializeConfig(serialized: SerializedConfig): Partial<DesignSystemConfig> {
  // Handle version migrations here if needed
  if (serialized.v !== CONFIG_VERSION) {
    console.warn(`Config version mismatch: expected ${CONFIG_VERSION}, got ${serialized.v}`)
  }

  return {
    theme: serialized.t,
    typography: serialized.ty,
    components: serialized.c,
    icons: serialized.i,
    layout: serialized.l,
  }
}

// Encode config to URL-safe base64
function encodeConfig(): string {
  const serialized = serializeConfig()
  const json = JSON.stringify(serialized)
  if (import.meta.client) {
    return btoa(encodeURIComponent(json))
  }
  return ''
}

// Decode config from URL-safe base64
function decodeConfig(encoded: string): Partial<DesignSystemConfig> | null {
  try {
    if (import.meta.client) {
      const json = decodeURIComponent(atob(encoded))
      const serialized = JSON.parse(json) as SerializedConfig
      return deserializeConfig(serialized)
    }
    return null
  } catch {
    console.error('Failed to decode config')
    return null
  }
}

export function useDesignSystem() {
  const route = useRoute()
  const router = useRouter()

  // Initialize from URL params or localStorage on first load
  function initFromUrl() {
    if (isInitialized.value) return

    // First check URL params
    const configParam = route.query.c as string | undefined
    if (configParam) {
      const decoded = decodeConfig(configParam)
      if (decoded) {
        Object.assign(config, defu(decoded, DEFAULT_CONFIG))
        isInitialized.value = true
        return
      }
    }

    // Then check localStorage
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SerializedConfig
          const decoded = deserializeConfig(parsed)
          Object.assign(config, defu(decoded, DEFAULT_CONFIG))
        } catch {
          console.error('Failed to load config from localStorage')
        }
      }
    }

    isInitialized.value = true
  }

  // Sync config to URL
  function syncToUrl() {
    const encoded = encodeConfig()
    if (encoded) {
      router.replace({
        query: { ...route.query, c: encoded },
      })
    }
  }

  // Auto-save to localStorage with debounce using VueUse
  if (import.meta.client) {
    watchDebounced(
      () => config,
      () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeConfig()))
        isDirty.value = true
      },
      { deep: true, debounce: 500 }
    )
  }

  // Theme config helpers
  function setTheme(newTheme: Partial<ThemeConfig>) {
    Object.assign(config.theme, newTheme)
  }

  function resetTheme() {
    Object.assign(config.theme, structuredClone(DEFAULT_THEME_CONFIG))
  }

  // Typography config helpers
  function setTypography(newTypography: Partial<TypographyConfig>) {
    Object.assign(config.typography, newTypography)
  }

  function resetTypography() {
    Object.assign(config.typography, structuredClone(DEFAULT_TYPOGRAPHY_CONFIG))
  }

  // Components config helpers
  function setComponents(newComponents: Partial<ComponentsConfig>) {
    Object.assign(config.components, newComponents)
  }

  function resetComponents() {
    Object.assign(config.components, structuredClone(DEFAULT_COMPONENTS_CONFIG))
  }

  // Icons config helpers
  function setIcons(newIcons: Partial<IconsConfig>) {
    Object.assign(config.icons, newIcons)
  }

  function resetIcons() {
    Object.assign(config.icons, structuredClone(DEFAULT_ICONS_CONFIG))
  }

  // Layout config helpers
  function setLayout(newLayout: Partial<LayoutConfig>) {
    Object.assign(config.layout, newLayout)
  }

  function resetLayout() {
    Object.assign(config.layout, structuredClone(DEFAULT_LAYOUT_CONFIG))
  }

  // Export config helpers
  function setExport(newExport: Partial<ExportConfig>) {
    Object.assign(config.export, newExport)
  }

  function resetExport() {
    Object.assign(config.export, structuredClone(DEFAULT_EXPORT_CONFIG))
  }

  // Reset all config to defaults
  function resetAll() {
    Object.assign(config, structuredClone(DEFAULT_CONFIG))
    isDirty.value = false
  }

  // Randomize config
  function randomize() {
    const { BASE_COLORS, ACCENT_THEMES, STYLES, RADIUS_OPTIONS, FONT_FAMILIES } = useConfigOptions()

    const randomItem = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!

    setTheme({
      baseColor: randomItem(BASE_COLORS).name as ThemeConfig['baseColor'],
      accentTheme: randomItem(ACCENT_THEMES).name as ThemeConfig['accentTheme'],
      radius: randomItem(RADIUS_OPTIONS).name as ThemeConfig['radius'],
      shadowIntensity: randomItem(['none', 'subtle', 'default', 'strong'] as const),
      menuAccent: randomItem(['subtle', 'bold'] as const),
      menuColor: randomItem(['default', 'inverted'] as const),
    })

    setTypography({
      fontFamily: randomItem(FONT_FAMILIES).name as TypographyConfig['fontFamily'],
    })

    setComponents({
      style: randomItem(STYLES).name as ComponentsConfig['style'],
    })
  }

  // Apply a preset theme
  function applyPreset(presetName: string) {
    const preset = PRESET_THEMES_LIST.find((p) => p.name === presetName)
    if (preset) {
      setTheme(preset.config.theme as Partial<ThemeConfig>)
      setTypography(preset.config.typography as Partial<TypographyConfig>)
      setComponents(preset.config.components as Partial<ComponentsConfig>)
      isDirty.value = true
    }
  }

  // Import config from JSON
  function importConfig(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString)
      if (parsed.v && parsed.t && parsed.ty && parsed.c && parsed.i && parsed.l) {
        const decoded = deserializeConfig(parsed as SerializedConfig)
        Object.assign(config, defu(decoded, DEFAULT_CONFIG))
        isDirty.value = true
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Export config to JSON
  function exportConfigJson(): string {
    return JSON.stringify(serializeConfig(), null, 2)
  }

  // Get shareable URL
  function getShareableUrl(): string {
    const encoded = encodeConfig()
    if (import.meta.client) {
      const baseUrl = window.location.origin + window.location.pathname
      return `${baseUrl}?c=${encoded}`
    }
    return ''
  }

  // Copy shareable URL to clipboard using VueUse
  async function copyShareableUrl(): Promise<boolean> {
    if (!isClipboardSupported.value) return false
    await copy(getShareableUrl())
    return copied.value
  }

  // Copy text to clipboard using VueUse
  async function copyToClipboard(text: string): Promise<boolean> {
    if (!isClipboardSupported.value) return false
    await copy(text)
    return copied.value
  }

  // Save current configuration with a name
  function saveConfiguration(name: string): SavedConfig {
    const newConfig: SavedConfig = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      config: serializeConfig(),
    }
    savedConfigs.value = [...savedConfigs.value, newConfig]
    return newConfig
  }

  // Load a saved configuration
  function loadConfiguration(id: string): boolean {
    const saved = savedConfigs.value.find((c) => c.id === id)
    if (saved) {
      const decoded = deserializeConfig(saved.config)
      Object.assign(config, defu(decoded, DEFAULT_CONFIG))
      isDirty.value = true
      return true
    }
    return false
  }

  // Delete a saved configuration
  function deleteConfiguration(id: string): boolean {
    const index = savedConfigs.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      savedConfigs.value = savedConfigs.value.filter((c) => c.id !== id)
      return true
    }
    return false
  }

  // Rename a saved configuration
  function renameConfiguration(id: string, newName: string): boolean {
    const savedConfig = savedConfigs.value.find((c) => c.id === id)
    if (savedConfig) {
      savedConfig.name = newName
      savedConfigs.value = [...savedConfigs.value]
      return true
    }
    return false
  }

  // Get all saved configurations
  function getSavedConfigurations(): SavedConfig[] {
    return savedConfigs.value
  }

  return {
    // State
    config: readonly(config),
    isInitialized: readonly(isInitialized),
    isDirty: readonly(isDirty),
    savedConfigs: readonly(savedConfigs),
    isClipboardSupported,
    copied,

    // Initialization
    initFromUrl,
    syncToUrl,

    // Config setters
    setTheme,
    setTypography,
    setComponents,
    setIcons,
    setLayout,
    setExport,

    // Reset functions
    resetTheme,
    resetTypography,
    resetComponents,
    resetIcons,
    resetLayout,
    resetExport,
    resetAll,

    // Utility functions
    randomize,
    applyPreset,
    importConfig,
    exportConfigJson,
    getShareableUrl,
    copyShareableUrl,
    copyToClipboard,

    // Save/Load functions
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    renameConfiguration,
    getSavedConfigurations,

    // Serialization
    encodeConfig,
    decodeConfig,
  }
}

// Helper composable for config options
export function useConfigOptions() {
  return {
    UI_LIBRARIES: UI_LIBRARIES_OPTIONS,
    BASE_COLORS: BASE_COLORS_OPTIONS,
    ACCENT_THEMES: ACCENT_THEMES_OPTIONS,
    STYLES: STYLES_OPTIONS,
    RADIUS_OPTIONS: RADIUS_OPTIONS_LIST,
    ICON_LIBRARIES: ICON_LIBRARIES_OPTIONS,
    FONT_FAMILIES: FONT_FAMILIES_OPTIONS,
    MONO_FONT_FAMILIES: MONO_FONT_FAMILIES_OPTIONS,
    FONT_SCALES: FONT_SCALES_OPTIONS,
    SPACING_SCALES: SPACING_SCALES_OPTIONS,
    ANIMATION_SPEEDS: ANIMATION_SPEEDS_OPTIONS,
    SHADOW_INTENSITIES: SHADOW_INTENSITIES_OPTIONS,
    BORDER_WIDTHS: BORDER_WIDTHS_OPTIONS,
    CONTAINER_WIDTHS: CONTAINER_WIDTHS_OPTIONS,
    AVAILABLE_COMPONENTS: AVAILABLE_COMPONENTS_LIST,
    COMPONENT_CATEGORIES: COMPONENT_CATEGORIES_LIST,
    PREVIEW_TEMPLATES: PREVIEW_TEMPLATES_OPTIONS,
    PRESET_THEMES: PRESET_THEMES_LIST,
  }
}
