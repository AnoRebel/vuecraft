/**
 * Organisation of the configuration panel: tabs, the sections inside them,
 * and a search index of individual settings.
 */
export type ConfigTabId = 'themes' | 'colors' | 'style' | 'type' | 'motion' | 'layout' | 'export'

export interface ConfigTab {
  id: ConfigTabId
  label: string
  icon: string
  description: string
}

export const CONFIG_TABS: ConfigTab[] = [
  { id: 'themes', label: 'Themes', icon: 'lucide:sparkles', description: 'Start from a preset' },
  { id: 'colors', label: 'Colors', icon: 'lucide:palette', description: 'Palette and contrast' },
  { id: 'style', label: 'Style', icon: 'lucide:shapes', description: 'Components, radius, depth' },
  { id: 'type', label: 'Type', icon: 'lucide:type', description: 'Fonts and icons' },
  { id: 'motion', label: 'Motion', icon: 'lucide:wand-sparkles', description: 'Timing and easing' },
  {
    id: 'layout',
    label: 'Layout',
    icon: 'lucide:layout-template',
    description: 'Spacing and menus',
  },
  { id: 'export', label: 'Export', icon: 'lucide:package', description: 'Output settings' },
]

export interface SectionConfig {
  id: string
  label: string
  visible: boolean
}

/** Default order; each section belongs to one tab */
export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'presets', label: 'Presets', visible: true },
  { id: 'colors', label: 'Colors', visible: true },
  { id: 'palette', label: 'Palette generator', visible: true },
  { id: 'accessibility', label: 'Contrast check', visible: true },
  { id: 'style', label: 'Components & shape', visible: true },
  { id: 'typography', label: 'Typography', visible: true },
  { id: 'icons', label: 'Icons', visible: true },
  { id: 'motion', label: 'Motion', visible: true },
  { id: 'layout', label: 'Layout & menu', visible: true },
  { id: 'effects', label: 'Builder effects', visible: true },
  { id: 'export', label: 'Output', visible: true },
  { id: 'selection', label: 'Included components', visible: true },
]

export const SECTION_TAB: Record<string, ConfigTabId> = {
  presets: 'themes',
  colors: 'colors',
  palette: 'colors',
  accessibility: 'colors',
  style: 'style',
  typography: 'type',
  icons: 'type',
  motion: 'motion',
  layout: 'layout',
  effects: 'layout',
  export: 'export',
  selection: 'export',
}

/** Bring a stored layout up to date: drop retired ids, add new sections */
export function migrateSections(stored: SectionConfig[] | null | undefined): SectionConfig[] {
  const known = new Map(DEFAULT_SECTIONS.map((s) => [s.id, s]))
  const kept = (stored ?? [])
    .filter((s) => known.has(s.id))
    .map((s) => ({ ...known.get(s.id)!, visible: s.visible !== false }))
  const present = new Set(kept.map((s) => s.id))
  for (const [index, section] of DEFAULT_SECTIONS.entries()) {
    if (present.has(section.id)) continue
    const before = DEFAULT_SECTIONS.slice(0, index)
      .map((s) => s.id)
      .reverse()
      .find((id) => present.has(id))
    const at = before ? kept.findIndex((s) => s.id === before) + 1 : 0
    kept.splice(at, 0, { ...section })
    present.add(section.id)
  }
  return kept
}

export interface SettingEntry {
  /** Element id inside the panel */
  id: string
  label: string
  tab: ConfigTabId
  keywords?: string
}

export const SETTINGS_INDEX: SettingEntry[] = [
  {
    id: 'setting-presets',
    label: 'Theme presets',
    tab: 'themes',
    keywords: 'preset tweakcn crystal neuo vuecraft gallery',
  },
  {
    id: 'setting-base-color',
    label: 'Base color',
    tab: 'colors',
    keywords: 'neutral gray slate stone zinc background',
  },
  { id: 'setting-accent', label: 'Accent color', tab: 'colors', keywords: 'primary brand hue' },
  {
    id: 'setting-custom-color',
    label: 'Custom primary color',
    tab: 'colors',
    keywords: 'hex picker brand',
  },
  {
    id: 'setting-palette',
    label: 'Palette generator',
    tab: 'colors',
    keywords: 'harmony complementary triadic analogous chart',
  },
  {
    id: 'setting-accessibility',
    label: 'Contrast check',
    tab: 'colors',
    keywords: 'accessibility wcag aa aaa fix a11y',
  },
  {
    id: 'setting-style',
    label: 'Component style',
    tab: 'style',
    keywords: 'new york miami brutal soft default',
  },
  {
    id: 'setting-border-width',
    label: 'Border width',
    tab: 'style',
    keywords: 'thin thick outline',
  },
  {
    id: 'setting-radius',
    label: 'Radius',
    tab: 'style',
    keywords: 'corner rounded border radius rem',
  },
  { id: 'setting-shadow', label: 'Shadow', tab: 'style', keywords: 'elevation depth intensity' },
  {
    id: 'setting-focus-width',
    label: 'Focus ring width',
    tab: 'style',
    keywords: 'outline keyboard accessibility',
  },
  {
    id: 'setting-focus-offset',
    label: 'Focus ring offset',
    tab: 'style',
    keywords: 'outline keyboard',
  },
  { id: 'setting-font', label: 'Font', tab: 'type', keywords: 'family sans typeface inter geist' },
  {
    id: 'setting-mono-font',
    label: 'Monospace font',
    tab: 'type',
    keywords: 'code mono jetbrains',
  },
  {
    id: 'setting-font-scale',
    label: 'Text scale',
    tab: 'type',
    keywords: 'font size compact spacious',
  },
  { id: 'setting-heading-weight', label: 'Heading weight', tab: 'type', keywords: 'bold semibold' },
  { id: 'setting-line-height', label: 'Line height', tab: 'type', keywords: 'leading body' },
  {
    id: 'setting-icon-library',
    label: 'Icon library',
    tab: 'type',
    keywords: 'lucide phosphor tabler heroicons radix',
  },
  { id: 'setting-icon-size', label: 'Icon size', tab: 'type' },
  { id: 'setting-icon-stroke', label: 'Icon stroke', tab: 'type', keywords: 'weight' },
  {
    id: 'setting-duration',
    label: 'Animation speed & duration',
    tab: 'motion',
    keywords: 'transition ms fast slow',
  },
  {
    id: 'setting-easing',
    label: 'Easing',
    tab: 'motion',
    keywords: 'timing function spring bounce ease',
  },
  { id: 'setting-curve', label: 'Custom easing curve', tab: 'motion', keywords: 'cubic bezier' },
  {
    id: 'setting-effects',
    label: 'Entrance effects',
    tab: 'motion',
    keywords: 'fade slide scale blur animation',
  },
  {
    id: 'setting-reduced-motion',
    label: 'Reduced motion',
    tab: 'motion',
    keywords: 'accessibility animation off',
  },
  {
    id: 'setting-spacing',
    label: 'Spacing',
    tab: 'layout',
    keywords: 'density padding gap compact',
  },
  { id: 'setting-container', label: 'Container width', tab: 'layout', keywords: 'max width page' },
  { id: 'setting-sidebar-width', label: 'Sidebar width', tab: 'layout' },
  { id: 'setting-header-height', label: 'Header height', tab: 'layout' },
  {
    id: 'setting-menu-color',
    label: 'Menu color',
    tab: 'layout',
    keywords: 'sidebar inverted navigation',
  },
  {
    id: 'setting-menu-accent',
    label: 'Menu active item',
    tab: 'layout',
    keywords: 'sidebar navigation bold subtle',
  },
  {
    id: 'setting-effects-builder',
    label: 'Builder effects',
    tab: 'layout',
    keywords: 'glass blur transparency glassmorphism',
  },
  { id: 'setting-framework', label: 'Framework', tab: 'export', keywords: 'vue nuxt' },
  { id: 'setting-export-format', label: 'Export format', tab: 'export', keywords: 'css json' },
  { id: 'setting-typescript', label: 'TypeScript', tab: 'export', keywords: 'ts' },
  { id: 'setting-prefix', label: 'CSS variable prefix', tab: 'export', keywords: 'namespace' },
  {
    id: 'setting-components-list',
    label: 'Included components',
    tab: 'export',
    keywords: 'cli shadcn add selection',
  },
]

export function searchSettings(query: string): SettingEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tabLabel = (id: ConfigTabId) => CONFIG_TABS.find((t) => t.id === id)?.label ?? ''
  return SETTINGS_INDEX.filter((s) =>
    `${s.label} ${s.keywords ?? ''} ${tabLabel(s.tab)}`.toLowerCase().includes(q)
  )
}
