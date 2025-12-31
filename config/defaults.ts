import type {
  DesignSystemConfig,
  ThemeConfig,
  TypographyConfig,
  ComponentsConfig,
  IconsConfig,
  LayoutConfig,
  ExportConfig,
} from '~/types/config'

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  baseColor: 'neutral',
  accentTheme: 'neutral',
  radius: 'md',
  shadowIntensity: 'default',
  menuAccent: 'subtle',
  menuColor: 'default',
}

export const DEFAULT_TYPOGRAPHY_CONFIG: TypographyConfig = {
  fontFamily: 'inter',
  monoFontFamily: 'jetbrains-mono',
  fontScale: 'default',
  headingWeight: 'semibold',
  bodyLineHeight: 'normal',
}

export const DEFAULT_COMPONENTS_CONFIG: ComponentsConfig = {
  style: 'default',
  borderWidth: 'default',
  animationSpeed: 'default',
  focusRingWidth: 'default',
  focusRingOffset: 'default',
}

export const DEFAULT_ICONS_CONFIG: IconsConfig = {
  library: 'lucide',
  defaultSize: 'md',
  strokeWidth: 'default',
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  spacingScale: 'default',
  containerWidth: 'xl',
  sidebarWidth: 'default',
  headerHeight: 'default',
}

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  uiLibrary: 'shadcn-vue',
  framework: 'vue',
  format: 'both',
  includeComponents: [],
  typescript: true,
  cssVariablesPrefix: '',
}

export const DEFAULT_CONFIG: DesignSystemConfig = {
  theme: DEFAULT_THEME_CONFIG,
  typography: DEFAULT_TYPOGRAPHY_CONFIG,
  components: DEFAULT_COMPONENTS_CONFIG,
  icons: DEFAULT_ICONS_CONFIG,
  layout: DEFAULT_LAYOUT_CONFIG,
  export: DEFAULT_EXPORT_CONFIG,
}

// UI Library options
export const UI_LIBRARIES = [
  {
    name: 'shadcn-vue',
    label: 'shadcn-vue',
    description: 'Beautiful components built with Reka UI and Tailwind CSS',
    icon: 'shadcn',
  },
  {
    name: 'nuxt-ui',
    label: 'Nuxt UI',
    description: 'Fully styled and customizable components for Nuxt',
    icon: 'nuxt',
  },
  {
    name: 'tailwind',
    label: 'Plain Tailwind',
    description: 'Just CSS variables for your own components',
    icon: 'tailwind',
  },
] as const

// Configuration options for UI
export const BASE_COLORS = [
  { name: 'neutral', label: 'Neutral', hue: 0 },
  { name: 'stone', label: 'Stone', hue: 30 },
  { name: 'zinc', label: 'Zinc', hue: 240 },
  { name: 'gray', label: 'Gray', hue: 220 },
  { name: 'slate', label: 'Slate', hue: 215 },
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
  { name: 'pink', label: 'Pink', color: 'oklch(0.656 0.241 354.308)' },
] as const

export const STYLES = [
  {
    name: 'default',
    label: 'Default',
    description: 'The classic shadcn/ui look. Clean and familiar.',
  },
  {
    name: 'new-york',
    label: 'New York',
    description: 'Smaller, refined components with tighter spacing.',
  },
  { name: 'miami', label: 'Miami', description: 'Vibrant and expressive with bold accents.' },
  {
    name: 'brutal',
    label: 'Brutal',
    description: 'Sharp edges, high contrast, no-nonsense design.',
  },
  { name: 'soft', label: 'Soft', description: 'Rounded, gentle, with generous padding.' },
] as const

export const RADIUS_OPTIONS = [
  { name: 'none', label: 'None', value: '0' },
  { name: 'sm', label: 'Small', value: '0.25rem' },
  { name: 'md', label: 'Medium', value: '0.5rem' },
  { name: 'lg', label: 'Large', value: '0.75rem' },
  { name: 'xl', label: 'Extra Large', value: '1rem' },
  { name: 'full', label: 'Full', value: '9999px' },
] as const

export const ICON_LIBRARIES = [
  { name: 'lucide', label: 'Lucide', description: 'Beautiful & consistent icons' },
  { name: 'phosphor', label: 'Phosphor', description: 'Flexible icon family' },
  { name: 'tabler', label: 'Tabler', description: 'Over 4000 pixel-perfect icons' },
  { name: 'heroicons', label: 'Heroicons', description: 'By the makers of Tailwind CSS' },
  { name: 'radix', label: 'Radix Icons', description: 'Crisp 15×15 icons' },
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
  { name: 'geist', label: 'Geist', category: 'sans-serif' },
] as const

export const MONO_FONT_FAMILIES = [
  { name: 'jetbrains-mono', label: 'JetBrains Mono' },
  { name: 'geist-mono', label: 'Geist Mono' },
  { name: 'fira-code', label: 'Fira Code' },
  { name: 'source-code-pro', label: 'Source Code Pro' },
] as const

export const FONT_SCALES = [
  { name: 'compact', label: 'Compact', description: 'Smaller text for dense UIs' },
  { name: 'default', label: 'Default', description: 'Standard sizing' },
  { name: 'relaxed', label: 'Relaxed', description: 'Larger text for readability' },
  { name: 'spacious', label: 'Spacious', description: 'Maximum readability' },
] as const

export const SPACING_SCALES = [
  { name: 'compact', label: 'Compact', multiplier: 0.875 },
  { name: 'default', label: 'Default', multiplier: 1 },
  { name: 'comfortable', label: 'Comfortable', multiplier: 1.125 },
  { name: 'spacious', label: 'Spacious', multiplier: 1.25 },
] as const

export const ANIMATION_SPEEDS = [
  { name: 'none', label: 'None', duration: '0ms' },
  { name: 'fast', label: 'Fast', duration: '100ms' },
  { name: 'default', label: 'Default', duration: '200ms' },
  { name: 'slow', label: 'Slow', duration: '300ms' },
] as const

export const SHADOW_INTENSITIES = [
  { name: 'none', label: 'None' },
  { name: 'subtle', label: 'Subtle' },
  { name: 'default', label: 'Default' },
  { name: 'strong', label: 'Strong' },
] as const

export const BORDER_WIDTHS = [
  { name: 'none', label: 'None', value: '0px' },
  { name: 'thin', label: 'Thin', value: '1px' },
  { name: 'default', label: 'Default', value: '1px' },
  { name: 'thick', label: 'Thick', value: '2px' },
] as const

export const CONTAINER_WIDTHS = [
  { name: 'sm', label: 'Small', value: '640px' },
  { name: 'md', label: 'Medium', value: '768px' },
  { name: 'lg', label: 'Large', value: '1024px' },
  { name: 'xl', label: 'Extra Large', value: '1280px' },
  { name: '2xl', label: '2XL', value: '1536px' },
  { name: 'full', label: 'Full Width', value: '100%' },
] as const

// Component list for selection with categories
export interface ComponentInfo {
  name: string
  label: string
  category: 'layout' | 'forms' | 'data-display' | 'feedback' | 'navigation' | 'overlay'
  description: string
}

export const AVAILABLE_COMPONENTS: ComponentInfo[] = [
  // Layout
  {
    name: 'accordion',
    label: 'Accordion',
    category: 'layout',
    description: 'Collapsible content sections',
  },
  {
    name: 'aspect-ratio',
    label: 'Aspect Ratio',
    category: 'layout',
    description: 'Maintain aspect ratio of content',
  },
  { name: 'card', label: 'Card', category: 'layout', description: 'Container for content' },
  {
    name: 'collapsible',
    label: 'Collapsible',
    category: 'layout',
    description: 'Expandable content area',
  },
  { name: 'resizable', label: 'Resizable', category: 'layout', description: 'Resizable panels' },
  {
    name: 'scroll-area',
    label: 'Scroll Area',
    category: 'layout',
    description: 'Custom scrollable container',
  },
  { name: 'separator', label: 'Separator', category: 'layout', description: 'Visual divider' },
  {
    name: 'sidebar',
    label: 'Sidebar',
    category: 'layout',
    description: 'Side navigation container',
  },

  // Forms
  { name: 'button', label: 'Button', category: 'forms', description: 'Clickable button element' },
  { name: 'checkbox', label: 'Checkbox', category: 'forms', description: 'Toggle selection input' },
  {
    name: 'combobox',
    label: 'Combobox',
    category: 'forms',
    description: 'Searchable select input',
  },
  {
    name: 'date-picker',
    label: 'Date Picker',
    category: 'forms',
    description: 'Date selection input',
  },
  { name: 'form', label: 'Form', category: 'forms', description: 'Form validation and submission' },
  { name: 'input', label: 'Input', category: 'forms', description: 'Text input field' },
  {
    name: 'input-otp',
    label: 'Input OTP',
    category: 'forms',
    description: 'One-time password input',
  },
  { name: 'label', label: 'Label', category: 'forms', description: 'Form field label' },
  {
    name: 'radio-group',
    label: 'Radio Group',
    category: 'forms',
    description: 'Single selection from options',
  },
  { name: 'select', label: 'Select', category: 'forms', description: 'Dropdown selection' },
  { name: 'slider', label: 'Slider', category: 'forms', description: 'Range input control' },
  { name: 'switch', label: 'Switch', category: 'forms', description: 'Toggle switch input' },
  { name: 'textarea', label: 'Textarea', category: 'forms', description: 'Multi-line text input' },
  { name: 'toggle', label: 'Toggle', category: 'forms', description: 'Toggle button' },
  {
    name: 'toggle-group',
    label: 'Toggle Group',
    category: 'forms',
    description: 'Group of toggle buttons',
  },

  // Data Display
  { name: 'avatar', label: 'Avatar', category: 'data-display', description: 'User profile image' },
  { name: 'badge', label: 'Badge', category: 'data-display', description: 'Status indicator' },
  {
    name: 'calendar',
    label: 'Calendar',
    category: 'data-display',
    description: 'Date calendar view',
  },
  {
    name: 'carousel',
    label: 'Carousel',
    category: 'data-display',
    description: 'Sliding content carousel',
  },
  {
    name: 'chart',
    label: 'Chart',
    category: 'data-display',
    description: 'Data visualization charts',
  },
  {
    name: 'data-table',
    label: 'Data Table',
    category: 'data-display',
    description: 'Sortable data table',
  },
  {
    name: 'progress',
    label: 'Progress',
    category: 'data-display',
    description: 'Progress indicator',
  },
  {
    name: 'skeleton',
    label: 'Skeleton',
    category: 'data-display',
    description: 'Loading placeholder',
  },
  { name: 'table', label: 'Table', category: 'data-display', description: 'Data table display' },

  // Feedback
  { name: 'alert', label: 'Alert', category: 'feedback', description: 'Informational message' },
  {
    name: 'alert-dialog',
    label: 'Alert Dialog',
    category: 'feedback',
    description: 'Confirmation dialog',
  },
  { name: 'sonner', label: 'Sonner', category: 'feedback', description: 'Toast notifications' },
  { name: 'toast', label: 'Toast', category: 'feedback', description: 'Notification messages' },
  { name: 'tooltip', label: 'Tooltip', category: 'feedback', description: 'Hover information' },

  // Navigation
  {
    name: 'breadcrumb',
    label: 'Breadcrumb',
    category: 'navigation',
    description: 'Navigation breadcrumbs',
  },
  { name: 'command', label: 'Command', category: 'navigation', description: 'Command palette' },
  {
    name: 'context-menu',
    label: 'Context Menu',
    category: 'navigation',
    description: 'Right-click menu',
  },
  {
    name: 'dropdown-menu',
    label: 'Dropdown Menu',
    category: 'navigation',
    description: 'Dropdown navigation menu',
  },
  { name: 'menubar', label: 'Menubar', category: 'navigation', description: 'Horizontal menu bar' },
  {
    name: 'navigation-menu',
    label: 'Navigation Menu',
    category: 'navigation',
    description: 'Main navigation component',
  },
  {
    name: 'pagination',
    label: 'Pagination',
    category: 'navigation',
    description: 'Page navigation',
  },
  { name: 'tabs', label: 'Tabs', category: 'navigation', description: 'Tabbed content navigation' },

  // Overlay
  { name: 'dialog', label: 'Dialog', category: 'overlay', description: 'Modal dialog window' },
  { name: 'drawer', label: 'Drawer', category: 'overlay', description: 'Sliding panel overlay' },
  {
    name: 'hover-card',
    label: 'Hover Card',
    category: 'overlay',
    description: 'Hover information card',
  },
  {
    name: 'popover',
    label: 'Popover',
    category: 'overlay',
    description: 'Floating content container',
  },
  { name: 'sheet', label: 'Sheet', category: 'overlay', description: 'Side panel overlay' },
]

export const COMPONENT_CATEGORIES = [
  { name: 'layout', label: 'Layout', description: 'Structural components' },
  { name: 'forms', label: 'Forms', description: 'Input and form components' },
  { name: 'data-display', label: 'Data Display', description: 'Content presentation' },
  { name: 'feedback', label: 'Feedback', description: 'User notifications' },
  { name: 'navigation', label: 'Navigation', description: 'Navigation components' },
  { name: 'overlay', label: 'Overlay', description: 'Floating elements' },
] as const

// Preview templates
export const PREVIEW_TEMPLATES = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    description: 'Full dashboard layout with sidebar and charts',
  },
  { name: 'cards', label: 'Cards', description: 'Card components showcase' },
  { name: 'forms', label: 'Forms', description: 'Form inputs and validation' },
  { name: 'authentication', label: 'Authentication', description: 'Login and signup forms' },
  { name: 'settings', label: 'Settings', description: 'Settings page layout' },
  { name: 'components', label: 'Components', description: 'Component gallery view' },
] as const

// Preset themes with full configurations
export interface PresetTheme {
  name: string
  label: string
  description: string
  preview: {
    primary: string
    background: string
  }
  config: {
    theme: Partial<ThemeConfig>
    typography: Partial<TypographyConfig>
    components: Partial<ComponentsConfig>
  }
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    name: 'default',
    label: 'Default',
    description: 'Clean and minimal shadcn/ui default',
    preview: { primary: 'oklch(0.21 0.006 285.885)', background: '#ffffff' },
    config: {
      theme: {
        baseColor: 'neutral',
        accentTheme: 'neutral',
        radius: 'md',
        shadowIntensity: 'default',
      },
      typography: { fontFamily: 'inter', fontScale: 'default' },
      components: { style: 'default', animationSpeed: 'default' },
    },
  },
  {
    name: 'new-york',
    label: 'New York',
    description: 'Refined and compact with subtle details',
    preview: { primary: 'oklch(0.21 0.006 285.885)', background: '#fafafa' },
    config: {
      theme: { baseColor: 'zinc', accentTheme: 'zinc', radius: 'sm', shadowIntensity: 'subtle' },
      typography: { fontFamily: 'geist', fontScale: 'compact' },
      components: { style: 'new-york', animationSpeed: 'fast' },
    },
  },
  {
    name: 'miami',
    label: 'Miami',
    description: 'Vibrant and colorful with bold accents',
    preview: { primary: 'oklch(0.656 0.241 354.308)', background: '#fef7f7' },
    config: {
      theme: { baseColor: 'stone', accentTheme: 'pink', radius: 'lg', shadowIntensity: 'default' },
      typography: { fontFamily: 'dm-sans', fontScale: 'relaxed' },
      components: { style: 'miami', animationSpeed: 'default' },
    },
  },
  {
    name: 'midnight',
    label: 'Midnight',
    description: 'Dark and mysterious with deep blues',
    preview: { primary: 'oklch(0.623 0.214 259.815)', background: '#0a0a0f' },
    config: {
      theme: { baseColor: 'slate', accentTheme: 'blue', radius: 'md', shadowIntensity: 'strong' },
      typography: { fontFamily: 'inter', fontScale: 'default' },
      components: { style: 'default', animationSpeed: 'slow' },
    },
  },
  {
    name: 'forest',
    label: 'Forest',
    description: 'Natural and calming with earthy greens',
    preview: { primary: 'oklch(0.696 0.17 162.48)', background: '#f5f9f5' },
    config: {
      theme: {
        baseColor: 'stone',
        accentTheme: 'emerald',
        radius: 'lg',
        shadowIntensity: 'subtle',
      },
      typography: { fontFamily: 'nunito-sans', fontScale: 'relaxed' },
      components: { style: 'soft', animationSpeed: 'slow' },
    },
  },
  {
    name: 'sunset',
    label: 'Sunset',
    description: 'Warm and inviting with orange tones',
    preview: { primary: 'oklch(0.705 0.213 47.604)', background: '#fffaf5' },
    config: {
      theme: {
        baseColor: 'stone',
        accentTheme: 'orange',
        radius: 'xl',
        shadowIntensity: 'default',
      },
      typography: { fontFamily: 'outfit', fontScale: 'default' },
      components: { style: 'soft', animationSpeed: 'default' },
    },
  },
  {
    name: 'lavender',
    label: 'Lavender',
    description: 'Soft and elegant with purple hues',
    preview: { primary: 'oklch(0.606 0.25 292.717)', background: '#faf8ff' },
    config: {
      theme: { baseColor: 'gray', accentTheme: 'violet', radius: 'lg', shadowIntensity: 'subtle' },
      typography: { fontFamily: 'raleway', fontScale: 'relaxed' },
      components: { style: 'soft', animationSpeed: 'slow' },
    },
  },
  {
    name: 'brutalist',
    label: 'Brutalist',
    description: 'Bold and stark with sharp edges',
    preview: { primary: '#000000', background: '#ffffff' },
    config: {
      theme: {
        baseColor: 'neutral',
        accentTheme: 'neutral',
        radius: 'none',
        shadowIntensity: 'none',
      },
      typography: { fontFamily: 'inter', fontScale: 'default', headingWeight: 'bold' },
      components: { style: 'brutal', animationSpeed: 'fast', borderWidth: 'thick' },
    },
  },
  {
    name: 'ocean',
    label: 'Ocean',
    description: 'Cool and refreshing with cyan accents',
    preview: { primary: 'oklch(0.715 0.143 199.769)', background: '#f0f9ff' },
    config: {
      theme: { baseColor: 'slate', accentTheme: 'cyan', radius: 'md', shadowIntensity: 'default' },
      typography: { fontFamily: 'public-sans', fontScale: 'default' },
      components: { style: 'default', animationSpeed: 'default' },
    },
  },
  {
    name: 'rose-gold',
    label: 'Rose Gold',
    description: 'Luxurious and feminine with rose accents',
    preview: { primary: 'oklch(0.645 0.246 16.439)', background: '#fff8f8' },
    config: {
      theme: { baseColor: 'stone', accentTheme: 'rose', radius: 'full', shadowIntensity: 'subtle' },
      typography: { fontFamily: 'figtree', fontScale: 'relaxed' },
      components: { style: 'soft', animationSpeed: 'slow' },
    },
  },
]
