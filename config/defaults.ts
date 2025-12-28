import type {
  DesignSystemConfig,
  ThemeConfig,
  TypographyConfig,
  ComponentsConfig,
  IconsConfig,
  LayoutConfig,
  ExportConfig
} from '~/types/config'

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  baseColor: 'neutral',
  accentTheme: 'neutral',
  radius: 'md',
  shadowIntensity: 'default',
  menuAccent: 'subtle',
  menuColor: 'default'
}

export const DEFAULT_TYPOGRAPHY_CONFIG: TypographyConfig = {
  fontFamily: 'inter',
  monoFontFamily: 'jetbrains-mono',
  fontScale: 'default',
  headingWeight: 'semibold',
  bodyLineHeight: 'normal'
}

export const DEFAULT_COMPONENTS_CONFIG: ComponentsConfig = {
  style: 'default',
  borderWidth: 'default',
  animationSpeed: 'default',
  focusRingWidth: 'default',
  focusRingOffset: 'default'
}

export const DEFAULT_ICONS_CONFIG: IconsConfig = {
  library: 'lucide',
  defaultSize: 'md',
  strokeWidth: 'default'
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  spacingScale: 'default',
  containerWidth: 'xl',
  sidebarWidth: 'default',
  headerHeight: 'default'
}

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  framework: 'vue',
  format: 'both',
  includeComponents: [],
  typescript: true,
  cssVariablesPrefix: ''
}

export const DEFAULT_CONFIG: DesignSystemConfig = {
  theme: DEFAULT_THEME_CONFIG,
  typography: DEFAULT_TYPOGRAPHY_CONFIG,
  components: DEFAULT_COMPONENTS_CONFIG,
  icons: DEFAULT_ICONS_CONFIG,
  layout: DEFAULT_LAYOUT_CONFIG,
  export: DEFAULT_EXPORT_CONFIG
}

// Configuration options for UI
export const BASE_COLORS = [
  { name: 'neutral', label: 'Neutral', hue: 0 },
  { name: 'stone', label: 'Stone', hue: 30 },
  { name: 'zinc', label: 'Zinc', hue: 240 },
  { name: 'gray', label: 'Gray', hue: 220 },
  { name: 'slate', label: 'Slate', hue: 215 }
] as const

export const ACCENT_THEMES = [
  // Neutral variants
  { name: 'neutral', label: 'Neutral', color: 'oklch(0.552 0.016 285.938)' },
  { name: 'stone', label: 'Stone', color: 'oklch(0.553 0.013 58.071)' },
  { name: 'zinc', label: 'Zinc', color: 'oklch(0.552 0.014 247.839)' },
  { name: 'gray', label: 'Gray', color: 'oklch(0.551 0.018 264.436)' },
  { name: 'slate', label: 'Slate', color: 'oklch(0.554 0.022 257.417)' },
  // Vibrant colors
  { name: 'red', label: 'Red', color: 'oklch(0.637 0.237 25.331)' },
  { name: 'rose', label: 'Rose', color: 'oklch(0.645 0.246 16.439)' },
  { name: 'orange', label: 'Orange', color: 'oklch(0.705 0.213 47.604)' },
  { name: 'amber', label: 'Amber', color: 'oklch(0.769 0.188 70.08)' },
  { name: 'yellow', label: 'Yellow', color: 'oklch(0.852 0.199 91.936)' },
  { name: 'lime', label: 'Lime', color: 'oklch(0.768 0.233 130.85)' },
  { name: 'green', label: 'Green', color: 'oklch(0.723 0.219 142.495)' },
  { name: 'emerald', label: 'Emerald', color: 'oklch(0.696 0.17 162.48)' },
  { name: 'teal', label: 'Teal', color: 'oklch(0.704 0.14 180.72)' },
  { name: 'cyan', label: 'Cyan', color: 'oklch(0.715 0.143 199.769)' },
  { name: 'sky', label: 'Sky', color: 'oklch(0.685 0.169 222.689)' },
  { name: 'blue', label: 'Blue', color: 'oklch(0.623 0.214 259.815)' },
  { name: 'indigo', label: 'Indigo', color: 'oklch(0.585 0.233 277.117)' },
  { name: 'violet', label: 'Violet', color: 'oklch(0.606 0.25 292.717)' },
  { name: 'purple', label: 'Purple', color: 'oklch(0.627 0.265 303.9)' },
  { name: 'fuchsia', label: 'Fuchsia', color: 'oklch(0.667 0.295 322.15)' },
  { name: 'pink', label: 'Pink', color: 'oklch(0.656 0.241 354.308)' }
] as const

export const STYLES = [
  { name: 'default', label: 'Default', description: 'The classic shadcn/ui look. Clean and familiar.' },
  { name: 'new-york', label: 'New York', description: 'Smaller, refined components with tighter spacing.' },
  { name: 'miami', label: 'Miami', description: 'Vibrant and expressive with bold accents.' },
  { name: 'brutal', label: 'Brutal', description: 'Sharp edges, high contrast, no-nonsense design.' },
  { name: 'soft', label: 'Soft', description: 'Rounded, gentle, with generous padding.' }
] as const

export const RADIUS_OPTIONS = [
  { name: 'none', label: 'None', value: '0' },
  { name: 'sm', label: 'Small', value: '0.25rem' },
  { name: 'md', label: 'Medium', value: '0.5rem' },
  { name: 'lg', label: 'Large', value: '0.75rem' },
  { name: 'xl', label: 'Extra Large', value: '1rem' },
  { name: 'full', label: 'Full', value: '9999px' }
] as const

export const ICON_LIBRARIES = [
  { name: 'lucide', label: 'Lucide', description: 'Beautiful & consistent icons' },
  { name: 'phosphor', label: 'Phosphor', description: 'Flexible icon family' },
  { name: 'tabler', label: 'Tabler', description: 'Over 4000 pixel-perfect icons' },
  { name: 'heroicons', label: 'Heroicons', description: 'By the makers of Tailwind CSS' },
  { name: 'radix', label: 'Radix Icons', description: 'Crisp 15×15 icons' }
] as const

export const FONT_FAMILIES = [
  { name: 'inter', label: 'Inter', category: 'sans-serif' },
  { name: 'noto-sans', label: 'Noto Sans', category: 'sans-serif' },
  { name: 'nunito-sans', label: 'Nunito Sans', category: 'sans-serif' },
  { name: 'figtree', label: 'Figtree', category: 'sans-serif' },
  { name: 'roboto', label: 'Roboto', category: 'sans-serif' },
  { name: 'raleway', label: 'Raleway', category: 'sans-serif' },
  { name: 'dm-sans', label: 'DM Sans', category: 'sans-serif' },
  { name: 'public-sans', label: 'Public Sans', category: 'sans-serif' },
  { name: 'outfit', label: 'Outfit', category: 'sans-serif' },
  { name: 'geist', label: 'Geist', category: 'sans-serif' }
] as const

export const MONO_FONT_FAMILIES = [
  { name: 'jetbrains-mono', label: 'JetBrains Mono' },
  { name: 'geist-mono', label: 'Geist Mono' },
  { name: 'fira-code', label: 'Fira Code' },
  { name: 'source-code-pro', label: 'Source Code Pro' }
] as const

export const FONT_SCALES = [
  { name: 'compact', label: 'Compact', description: 'Smaller text for dense UIs' },
  { name: 'default', label: 'Default', description: 'Standard sizing' },
  { name: 'relaxed', label: 'Relaxed', description: 'Larger text for readability' },
  { name: 'spacious', label: 'Spacious', description: 'Maximum readability' }
] as const

export const SPACING_SCALES = [
  { name: 'compact', label: 'Compact', multiplier: 0.875 },
  { name: 'default', label: 'Default', multiplier: 1 },
  { name: 'comfortable', label: 'Comfortable', multiplier: 1.125 },
  { name: 'spacious', label: 'Spacious', multiplier: 1.25 }
] as const

export const ANIMATION_SPEEDS = [
  { name: 'none', label: 'None', duration: '0ms' },
  { name: 'fast', label: 'Fast', duration: '100ms' },
  { name: 'default', label: 'Default', duration: '200ms' },
  { name: 'slow', label: 'Slow', duration: '300ms' }
] as const

export const SHADOW_INTENSITIES = [
  { name: 'none', label: 'None' },
  { name: 'subtle', label: 'Subtle' },
  { name: 'default', label: 'Default' },
  { name: 'strong', label: 'Strong' }
] as const

export const BORDER_WIDTHS = [
  { name: 'none', label: 'None', value: '0px' },
  { name: 'thin', label: 'Thin', value: '1px' },
  { name: 'default', label: 'Default', value: '1px' },
  { name: 'thick', label: 'Thick', value: '2px' }
] as const

export const CONTAINER_WIDTHS = [
  { name: 'sm', label: 'Small', value: '640px' },
  { name: 'md', label: 'Medium', value: '768px' },
  { name: 'lg', label: 'Large', value: '1024px' },
  { name: 'xl', label: 'Extra Large', value: '1280px' },
  { name: '2xl', label: '2XL', value: '1536px' },
  { name: 'full', label: 'Full Width', value: '100%' }
] as const

// Component list for selection
export const AVAILABLE_COMPONENTS = [
  'accordion',
  'alert',
  'alert-dialog',
  'aspect-ratio',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'calendar',
  'card',
  'carousel',
  'chart',
  'checkbox',
  'collapsible',
  'combobox',
  'command',
  'context-menu',
  'data-table',
  'date-picker',
  'dialog',
  'drawer',
  'dropdown-menu',
  'form',
  'hover-card',
  'input',
  'input-otp',
  'label',
  'menubar',
  'navigation-menu',
  'pagination',
  'popover',
  'progress',
  'radio-group',
  'resizable',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'sidebar',
  'skeleton',
  'slider',
  'sonner',
  'switch',
  'table',
  'tabs',
  'textarea',
  'toast',
  'toggle',
  'toggle-group',
  'tooltip'
] as const

// Preview templates
export const PREVIEW_TEMPLATES = [
  { name: 'dashboard', label: 'Dashboard', description: 'Full dashboard layout with sidebar and charts' },
  { name: 'cards', label: 'Cards', description: 'Card components showcase' },
  { name: 'forms', label: 'Forms', description: 'Form inputs and validation' },
  { name: 'authentication', label: 'Authentication', description: 'Login and signup forms' },
  { name: 'settings', label: 'Settings', description: 'Settings page layout' },
  { name: 'components', label: 'Components', description: 'Component gallery view' }
] as const
