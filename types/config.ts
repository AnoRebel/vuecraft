// Design System Configuration Types

export type BaseColorName = 'neutral' | 'stone' | 'zinc' | 'gray' | 'slate'

export type ThemeName =
  | 'neutral'
  | 'stone'
  | 'zinc'
  | 'gray'
  | 'slate'
  | 'red'
  | 'rose'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'

export type StyleName = 'default' | 'new-york' | 'miami' | 'brutal' | 'soft'

export type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type IconLibrary = 'lucide' | 'phosphor' | 'tabler' | 'heroicons' | 'radix'

export type FontFamily =
  | 'inter'
  | 'noto-sans'
  | 'nunito-sans'
  | 'figtree'
  | 'roboto'
  | 'raleway'
  | 'dm-sans'
  | 'public-sans'
  | 'outfit'
  | 'geist'

export type MonoFontFamily = 'jetbrains-mono' | 'geist-mono' | 'fira-code' | 'source-code-pro'

export type FontScale = 'compact' | 'default' | 'relaxed' | 'spacious'

export type SpacingScale = 'compact' | 'default' | 'comfortable' | 'spacious'

export type AnimationSpeed = 'none' | 'fast' | 'default' | 'slow'

export type ShadowIntensity = 'none' | 'subtle' | 'default' | 'strong'

export type BorderWidth = 'none' | 'thin' | 'default' | 'thick'

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export type MenuAccent = 'subtle' | 'bold'

export type MenuColor = 'default' | 'inverted'

export type FrameworkTarget = 'vue' | 'nuxt'

export type ExportFormat = 'css' | 'json' | 'both'

// Configuration Groups
export interface ThemeConfig {
  baseColor: BaseColorName
  accentTheme: ThemeName
  radius: RadiusValue
  shadowIntensity: ShadowIntensity
  menuAccent: MenuAccent
  menuColor: MenuColor
}

export interface TypographyConfig {
  fontFamily: FontFamily
  monoFontFamily: MonoFontFamily
  fontScale: FontScale
  headingWeight: 'normal' | 'medium' | 'semibold' | 'bold'
  bodyLineHeight: 'tight' | 'normal' | 'relaxed'
}

export interface ComponentsConfig {
  style: StyleName
  borderWidth: BorderWidth
  animationSpeed: AnimationSpeed
  focusRingWidth: 'thin' | 'default' | 'thick'
  focusRingOffset: 'none' | 'sm' | 'default'
}

export interface IconsConfig {
  library: IconLibrary
  defaultSize: 'sm' | 'md' | 'lg'
  strokeWidth: 'thin' | 'default' | 'thick'
}

export interface LayoutConfig {
  spacingScale: SpacingScale
  containerWidth: ContainerWidth
  sidebarWidth: 'narrow' | 'default' | 'wide'
  headerHeight: 'compact' | 'default' | 'tall'
}

export interface ExportConfig {
  framework: FrameworkTarget
  format: ExportFormat
  includeComponents: string[]
  typescript: boolean
  cssVariablesPrefix: string
}

// Full Design System Configuration
export interface DesignSystemConfig {
  theme: ThemeConfig
  typography: TypographyConfig
  components: ComponentsConfig
  icons: IconsConfig
  layout: LayoutConfig
  export: ExportConfig
}

// CSS Variables structure
export interface CSSVariables {
  light: Record<string, string>
  dark: Record<string, string>
  shared: Record<string, string>
}

// Preview template types
export type PreviewTemplate = 'dashboard' | 'cards' | 'forms' | 'authentication' | 'settings' | 'components'

// Serializable config for URL/JSON
export interface SerializedConfig {
  v: number // version
  t: ThemeConfig
  ty: TypographyConfig
  c: ComponentsConfig
  i: IconsConfig
  l: LayoutConfig
}
