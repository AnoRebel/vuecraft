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
  CustomThemePreset,
  CustomThemeTokens,
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
import { useThemeHistory } from '~/composables/useThemeHistory'

// Current version of the config serialization format
// v2 adds export settings (`e`) and imported preset tokens (`t.custom`)
const CONFIG_VERSION = 2

// Storage keys
const STORAGE_KEY = 'vuecraft-config'
const SAVED_CONFIGS_KEY = 'vuecraft-saved-configs'

export interface SavedConfig {
  id: string
  name: string
  createdAt: number
  config: SerializedConfig
}

type GroupKey = keyof DesignSystemConfig

const GROUP_DEFAULTS: { [K in GroupKey]: DesignSystemConfig[K] } = {
  theme: DEFAULT_THEME_CONFIG,
  typography: DEFAULT_TYPOGRAPHY_CONFIG,
  components: DEFAULT_COMPONENTS_CONFIG,
  icons: DEFAULT_ICONS_CONFIG,
  layout: DEFAULT_LAYOUT_CONFIG,
  export: DEFAULT_EXPORT_CONFIG,
}

/** Plain deep copy (works for reactive proxies, unlike structuredClone) */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

// Shared state (module level so every component sees the same config)
const config = reactive<DesignSystemConfig>(clone(DEFAULT_CONFIG))
const isInitialized = ref(false)
const isDirty = ref(false)

const savedConfigs = useStorage<SavedConfig[]>(SAVED_CONFIGS_KEY, [])
const { copy, copied, isSupported: isClipboardSupported } = useClipboard({ legacy: true })

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

function serializeConfig(): SerializedConfig {
  // Deep copies: reading every nested field also makes callers inside a
  // computed() track the whole config, so share links never go stale.
  return {
    v: CONFIG_VERSION,
    t: clone(config.theme),
    ty: clone(config.typography),
    c: clone(config.components),
    i: clone(config.icons),
    l: clone(config.layout),
    e: clone(config.export),
  }
}

function deserializeConfig(serialized: SerializedConfig): Partial<DesignSystemConfig> {
  return {
    theme: serialized.t,
    typography: serialized.ty,
    components: serialized.c,
    icons: serialized.i,
    layout: serialized.l,
    ...(serialized.e ? { export: serialized.e } : {}),
  }
}

function isSerializedConfig(value: unknown): value is SerializedConfig {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.v === 'number' && !!v.t && !!v.ty && !!v.c && !!v.i && !!v.l
}

/** Replace the whole config, filling every missing field from fresh defaults */
function replaceConfig(next: Partial<DesignSystemConfig>, keep: GroupKey[] = []) {
  for (const key of Object.keys(GROUP_DEFAULTS) as GroupKey[]) {
    if (keep.includes(key) && !next[key]) continue
    const merged = { ...clone(GROUP_DEFAULTS[key]), ...(next[key] ? clone(next[key]) : {}) }
    Object.assign(config[key], merged)
  }
}

// URL-safe base64 of UTF-8 JSON
function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(code: string): string {
  let b64 = code.replace(/-/g, '+').replace(/_/g, '/').replace(/ /g, '+')
  while (b64.length % 4) b64 += '='
  const binary = atob(b64)
  // Legacy links: btoa(encodeURIComponent(json))
  if (binary.startsWith('%7B')) return decodeURIComponent(binary)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function encodeConfig(): string {
  if (!import.meta.client) return ''
  return toBase64Url(JSON.stringify(serializeConfig()))
}

function decodeConfig(encoded: string): Partial<DesignSystemConfig> | null {
  if (!import.meta.client) return null
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(encoded))
    return isSerializedConfig(parsed) ? deserializeConfig(parsed) : null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Persistence and history (registered once, client only)
// ---------------------------------------------------------------------------

let watchersRegistered = false
const history = useThemeHistory()

function registerWatchers() {
  if (watchersRegistered || !import.meta.client) return
  watchersRegistered = true

  watchDebounced(
    () => serializeConfig(),
    (serialized) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
      } catch {
        // storage full or unavailable - keep working in memory
      }
      if (!history.isApplying()) history.push(serialized)
      isDirty.value = true
    },
    { deep: true, debounce: 300 }
  )
}

function applyHistoryEntry(entry: SerializedConfig | null) {
  if (!entry) return
  history.setApplyingHistory(true)
  replaceConfig(deserializeConfig(entry))
  // Release after the debounced watcher has seen the change
  setTimeout(() => history.setApplyingHistory(false), 400)
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function useDesignSystem() {
  registerWatchers()

  /** Load config from ?c= (then drop it from the URL) or from localStorage */
  function initFromUrl() {
    if (isInitialized.value) return

    const route = useRoute()
    const router = useRouter()
    const configParam = route.query.c
    const code = Array.isArray(configParam) ? configParam[0] : configParam

    let loaded = false
    if (code) {
      const decoded = decodeConfig(code)
      if (decoded) {
        replaceConfig(decoded, ['export'])
        loaded = true
      }
      // Remove the code so later edits are not overridden on reload
      const { c: _c, ...rest } = route.query
      router.replace({ query: rest })
    }

    if (!loaded && import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed: unknown = JSON.parse(stored)
          if (isSerializedConfig(parsed)) replaceConfig(deserializeConfig(parsed))
        }
      } catch {
        // ignore corrupt storage
      }
    }

    history.initialize(serializeConfig())
    isInitialized.value = true
  }

  /** Write the current config into the address bar (opt-in) */
  function syncToUrl() {
    const encoded = encodeConfig()
    if (encoded) {
      const route = useRoute()
      useRouter().replace({ query: { ...route.query, c: encoded } })
    }
  }

  // --- Setters -------------------------------------------------------------
  // Editing a control overrides the matching token imported from a preset.

  function dropCustom(keys: (keyof CustomThemeTokens)[]) {
    const custom = config.theme.custom
    if (!custom) return
    const next = Object.fromEntries(
      Object.entries(custom).filter(([k]) => !keys.includes(k as keyof CustomThemeTokens))
    ) as CustomThemeTokens
    const remaining = Object.keys(next).filter((k) => k !== 'source')
    config.theme.custom = remaining.length ? next : null
  }

  function setTheme(newTheme: Partial<ThemeConfig>) {
    if ('baseColor' in newTheme || 'accentTheme' in newTheme) {
      dropCustom(['light', 'dark'])
      if (!('customPrimary' in newTheme)) config.theme.customPrimary = null
    }
    if ('radius' in newTheme) {
      dropCustom(['radius'])
      if (!('radiusValue' in newTheme)) config.theme.radiusValue = null
    }
    if ('radiusValue' in newTheme) dropCustom(['radius'])
    if ('shadowIntensity' in newTheme) dropCustom(['shadows'])
    Object.assign(config.theme, newTheme)
  }

  function resetTheme() {
    Object.assign(config.theme, clone(DEFAULT_THEME_CONFIG))
  }

  function setTypography(newTypography: Partial<TypographyConfig>) {
    if ('fontFamily' in newTypography) dropCustom(['fontSans', 'fontHeading'])
    if ('monoFontFamily' in newTypography) dropCustom(['fontMono'])
    Object.assign(config.typography, newTypography)
  }

  function resetTypography() {
    dropCustom(['fontSans', 'fontHeading', 'fontMono'])
    Object.assign(config.typography, clone(DEFAULT_TYPOGRAPHY_CONFIG))
  }

  function setComponents(newComponents: Partial<ComponentsConfig>) {
    if ('borderWidth' in newComponents) dropCustom(['borderWidth'])
    // A speed preset replaces an exact duration
    if ('animationSpeed' in newComponents && !('animationDuration' in newComponents)) {
      config.components.animationDuration = null
    }
    Object.assign(config.components, newComponents)
  }

  function resetComponents() {
    dropCustom(['borderWidth'])
    Object.assign(config.components, clone(DEFAULT_COMPONENTS_CONFIG))
  }

  function setIcons(newIcons: Partial<IconsConfig>) {
    Object.assign(config.icons, newIcons)
  }

  function resetIcons() {
    Object.assign(config.icons, clone(DEFAULT_ICONS_CONFIG))
  }

  function setLayout(newLayout: Partial<LayoutConfig>) {
    Object.assign(config.layout, newLayout)
  }

  function resetLayout() {
    Object.assign(config.layout, clone(DEFAULT_LAYOUT_CONFIG))
  }

  function setExport(newExport: Partial<ExportConfig>) {
    Object.assign(config.export, newExport)
  }

  function resetExport() {
    Object.assign(config.export, clone(DEFAULT_EXPORT_CONFIG))
  }

  /** Store explicit colour overrides (palette generator, accessibility fixes) */
  function setCustomColors(mode: 'light' | 'dark' | 'both', colors: Record<string, string>) {
    const custom: CustomThemeTokens = clone(config.theme.custom ?? {})
    for (const m of mode === 'both' ? (['light', 'dark'] as const) : [mode]) {
      custom[m] = { ...(custom[m] ?? {}), ...colors }
    }
    config.theme.custom = custom
  }

  function resetAll() {
    replaceConfig({}, [])
    isDirty.value = false
  }

  function randomize() {
    const { BASE_COLORS, ACCENT_THEMES, STYLES, RADIUS_OPTIONS, FONT_FAMILIES } = useConfigOptions()
    const randomItem = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!

    config.theme.custom = null
    setTheme({
      baseColor: randomItem(BASE_COLORS).name as ThemeConfig['baseColor'],
      accentTheme: randomItem(ACCENT_THEMES).name as ThemeConfig['accentTheme'],
      radius: randomItem(RADIUS_OPTIONS).name as ThemeConfig['radius'],
      shadowIntensity: randomItem(['none', 'subtle', 'default', 'strong'] as const),
      menuAccent: randomItem(['subtle', 'bold'] as const),
      menuColor: randomItem(['default', 'inverted'] as const),
      customPrimary: null,
      radiusValue: null,
    })
    setTypography({ fontFamily: randomItem(FONT_FAMILIES).name as TypographyConfig['fontFamily'] })
    setComponents({ style: randomItem(STYLES).name as ComponentsConfig['style'] })
  }

  /** Built-in presets reset theme, typography and components to defaults first */
  function applyPreset(presetName: string): boolean {
    const preset = PRESET_THEMES_LIST.find((p) => p.name === presetName)
    if (!preset) return false
    replaceConfig(
      {
        theme: { ...clone(DEFAULT_THEME_CONFIG), ...preset.config.theme },
        typography: { ...clone(DEFAULT_TYPOGRAPHY_CONFIG), ...preset.config.typography },
        components: { ...clone(DEFAULT_COMPONENTS_CONFIG), ...preset.config.components },
      },
      ['icons', 'layout', 'export']
    )
    return true
  }

  /** Imported presets (tweakcn, Crystal Neuo) become the theme's custom tokens */
  function applyCustomPreset(preset: CustomThemePreset) {
    replaceConfig(
      {
        theme: {
          ...clone(DEFAULT_THEME_CONFIG),
          custom: { ...clone(preset.tokens), source: preset.id },
        },
        typography: clone(config.typography),
        components: { ...clone(config.components), style: 'default' },
      },
      ['icons', 'layout', 'export']
    )
  }

  function applySerialized(serialized: SerializedConfig) {
    replaceConfig(deserializeConfig(serialized), ['export'])
  }

  function importConfig(jsonString: string): boolean {
    try {
      const parsed: unknown = JSON.parse(jsonString)
      if (!isSerializedConfig(parsed)) return false
      applySerialized(parsed)
      isDirty.value = true
      return true
    } catch {
      return false
    }
  }

  function exportConfigJson(): string {
    return JSON.stringify(serializeConfig(), null, 2)
  }

  function getShareableUrl(): string {
    if (!import.meta.client) return ''
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = ''
    url.searchParams.set('c', encodeConfig())
    return url.toString()
  }

  async function copyShareableUrl(): Promise<boolean> {
    return copyToClipboard(getShareableUrl())
  }

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await copy(text)
      return true
    } catch {
      return false
    }
  }

  // --- Saved configurations -----------------------------------------------

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

  function loadConfiguration(id: string): boolean {
    const saved = savedConfigs.value.find((c) => c.id === id)
    if (!saved) return false
    applySerialized(saved.config)
    isDirty.value = true
    return true
  }

  function deleteConfiguration(id: string): boolean {
    const exists = savedConfigs.value.some((c) => c.id === id)
    if (exists) savedConfigs.value = savedConfigs.value.filter((c) => c.id !== id)
    return exists
  }

  function renameConfiguration(id: string, newName: string): boolean {
    const exists = savedConfigs.value.some((c) => c.id === id)
    if (exists) {
      savedConfigs.value = savedConfigs.value.map((c) =>
        c.id === id ? { ...c, name: newName } : c
      )
    }
    return exists
  }

  function getSavedConfigurations(): SavedConfig[] {
    return savedConfigs.value
  }

  // --- History --------------------------------------------------------------

  function undo() {
    applyHistoryEntry(history.undo())
  }

  function redo() {
    applyHistoryEntry(history.redo())
  }

  return {
    // State
    config: readonly(config),
    isInitialized: readonly(isInitialized),
    isDirty: readonly(isDirty),
    savedConfigs: readonly(savedConfigs),
    isClipboardSupported,
    copied,
    canUndo: history.canUndo,
    canRedo: history.canRedo,

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
    setCustomColors,

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
    applyCustomPreset,
    applySerialized,
    importConfig,
    exportConfigJson,
    getShareableUrl,
    copyShareableUrl,
    copyToClipboard,

    // History
    undo,
    redo,

    // Save/Load functions
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    renameConfiguration,
    getSavedConfigurations,

    // Serialization
    encodeConfig,
    decodeConfig,
    serializeConfig,
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
