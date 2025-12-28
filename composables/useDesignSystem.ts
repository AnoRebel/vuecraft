import { defu } from 'defu'
import type {
  DesignSystemConfig,
  ThemeConfig,
  TypographyConfig,
  ComponentsConfig,
  IconsConfig,
  LayoutConfig,
  ExportConfig,
  SerializedConfig
} from '~/types/config'
import {
  DEFAULT_CONFIG,
  DEFAULT_THEME_CONFIG,
  DEFAULT_TYPOGRAPHY_CONFIG,
  DEFAULT_COMPONENTS_CONFIG,
  DEFAULT_ICONS_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_EXPORT_CONFIG
} from '~/config/defaults'

// Current version of the config serialization format
const CONFIG_VERSION = 1

// State
const config = reactive<DesignSystemConfig>({ ...DEFAULT_CONFIG })
const isInitialized = ref(false)
const isDirty = ref(false)

// Serialize config for URL/JSON
function serializeConfig(): SerializedConfig {
  return {
    v: CONFIG_VERSION,
    t: config.theme,
    ty: config.typography,
    c: config.components,
    i: config.icons,
    l: config.layout
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
    layout: serialized.l
  }
}

// Encode config to URL-safe base64
function encodeConfig(): string {
  const serialized = serializeConfig()
  const json = JSON.stringify(serialized)
  return btoa(encodeURIComponent(json))
}

// Decode config from URL-safe base64
function decodeConfig(encoded: string): Partial<DesignSystemConfig> | null {
  try {
    const json = decodeURIComponent(atob(encoded))
    const serialized = JSON.parse(json) as SerializedConfig
    return deserializeConfig(serialized)
  } catch {
    console.error('Failed to decode config')
    return null
  }
}

export function useDesignSystem() {
  const route = useRoute()
  const router = useRouter()

  // Initialize from URL params on first load
  function initFromUrl() {
    if (isInitialized.value) return

    const configParam = route.query.c as string | undefined
    if (configParam) {
      const decoded = decodeConfig(configParam)
      if (decoded) {
        Object.assign(config, defu(decoded, DEFAULT_CONFIG))
      }
    }

    isInitialized.value = true
  }

  // Sync config to URL
  function syncToUrl() {
    const encoded = encodeConfig()
    router.replace({
      query: { ...route.query, c: encoded }
    })
  }

  // Watch for changes and mark as dirty
  watch(
    () => config,
    () => {
      isDirty.value = true
    },
    { deep: true }
  )

  // Theme config helpers
  function setTheme(newTheme: Partial<ThemeConfig>) {
    Object.assign(config.theme, newTheme)
  }

  function resetTheme() {
    Object.assign(config.theme, DEFAULT_THEME_CONFIG)
  }

  // Typography config helpers
  function setTypography(newTypography: Partial<TypographyConfig>) {
    Object.assign(config.typography, newTypography)
  }

  function resetTypography() {
    Object.assign(config.typography, DEFAULT_TYPOGRAPHY_CONFIG)
  }

  // Components config helpers
  function setComponents(newComponents: Partial<ComponentsConfig>) {
    Object.assign(config.components, newComponents)
  }

  function resetComponents() {
    Object.assign(config.components, DEFAULT_COMPONENTS_CONFIG)
  }

  // Icons config helpers
  function setIcons(newIcons: Partial<IconsConfig>) {
    Object.assign(config.icons, newIcons)
  }

  function resetIcons() {
    Object.assign(config.icons, DEFAULT_ICONS_CONFIG)
  }

  // Layout config helpers
  function setLayout(newLayout: Partial<LayoutConfig>) {
    Object.assign(config.layout, newLayout)
  }

  function resetLayout() {
    Object.assign(config.layout, DEFAULT_LAYOUT_CONFIG)
  }

  // Export config helpers
  function setExport(newExport: Partial<ExportConfig>) {
    Object.assign(config.export, newExport)
  }

  function resetExport() {
    Object.assign(config.export, DEFAULT_EXPORT_CONFIG)
  }

  // Reset all config to defaults
  function resetAll() {
    Object.assign(config, DEFAULT_CONFIG)
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
      menuColor: randomItem(['default', 'inverted'] as const)
    })

    setTypography({
      fontFamily: randomItem(FONT_FAMILIES).name as TypographyConfig['fontFamily']
    })

    setComponents({
      style: randomItem(STYLES).name as ComponentsConfig['style']
    })
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
    const baseUrl = window.location.origin + window.location.pathname
    return `${baseUrl}?c=${encoded}`
  }

  // Copy shareable URL to clipboard
  async function copyShareableUrl(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(getShareableUrl())
      return true
    } catch {
      return false
    }
  }

  return {
    // State
    config: readonly(config),
    isInitialized: readonly(isInitialized),
    isDirty: readonly(isDirty),

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
    importConfig,
    exportConfigJson,
    getShareableUrl,
    copyShareableUrl,

    // Serialization
    encodeConfig,
    decodeConfig
  }
}

// Helper composable for config options
export function useConfigOptions() {
  return {
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
    PREVIEW_TEMPLATES: PREVIEW_TEMPLATES_OPTIONS
  }
}

// Import from defaults
import {
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
  PREVIEW_TEMPLATES as PREVIEW_TEMPLATES_OPTIONS
} from '~/config/defaults'
