/**
 * Single source of truth for the resolved design tokens of a configuration.
 *
 * The runtime theme (applied to the app and the live preview) and every
 * exporter read from `resolveTheme`, so what users see is exactly what they
 * export - including colours imported from presets and custom overrides.
 */
import type { DesignSystemConfigInput, FontScale, SpacingScale } from '~/types/config'
import { getThemeColors, type ThemeColors } from '~/config/themes'
import {
  RADIUS_OPTIONS,
  ANIMATION_SPEEDS,
  BORDER_WIDTHS,
  CONTAINER_WIDTHS,
  FONT_FAMILIES,
  MONO_FONT_FAMILIES,
} from '~/config/defaults'
import { parseColor, getContrastRatio } from '~/utils/colorUtils'

export type ColorMode = 'light' | 'dark'
export type ColorSet = ThemeColors['light']
export type ShadowScale = Record<'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>

export interface ResolvedTheme {
  colors: ThemeColors
  radius: string
  fontSans: string
  fontHeading: string
  fontMono: string
  shadows: Record<ColorMode, ShadowScale>
  borderWidth: string
  animationDuration: string
  fontScale: number
  spacingScale: number
  headingWeight: number
  bodyLineHeight: number
  focusRingWidth: string
  focusRingOffset: string
  iconSize: string
  iconStroke: string
  containerWidth: string
  sidebarWidth: string
  headerHeight: string
}

/** camelCase colour key -> kebab-case CSS token name */
export function toTokenName(key: string): string {
  return key.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()
}

/** kebab-case CSS token name -> camelCase colour key */
export function toColorKey(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

export const COLOR_KEYS = Object.keys(getThemeColors('neutral', 'neutral').light) as Array<
  keyof ColorSet
>

const SANS_FALLBACK = 'ui-sans-serif, system-ui, sans-serif'
const MONO_FALLBACK = 'ui-monospace, SFMono-Regular, Menlo, monospace'

export function fontStack(name: string, mono = false): string {
  const list: readonly { name: string; label: string }[] = mono ? MONO_FONT_FAMILIES : FONT_FAMILIES
  const label = list.find((f) => f.name === name)?.label ?? (mono ? 'JetBrains Mono' : 'Inter')
  return `"${label}", ${mono ? MONO_FALLBACK : SANS_FALLBACK}`
}

/** First family name of a font stack, e.g. `"Geist", sans-serif` -> `Geist` */
export function primaryFontFamily(stack: string): string | null {
  const first = stack
    .split(',')[0]
    ?.trim()
    .replace(/^["']|["']$/g, '')
  if (
    !first ||
    /^(ui-|system-ui|-apple-system|BlinkMacSystemFont|sans-serif|serif|monospace)/.test(first)
  ) {
    return null
  }
  return first
}

const SHADOWS: Record<string, ShadowScale> = {
  none: {
    '2xs': '0 0 #0000',
    xs: '0 0 #0000',
    sm: '0 0 #0000',
    md: '0 0 #0000',
    lg: '0 0 #0000',
    xl: '0 0 #0000',
    '2xl': '0 0 #0000',
  },
  subtle: {
    '2xs': '0 1px rgb(0 0 0 / 0.02)',
    xs: '0 1px 1px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 1px -1px rgb(0 0 0 / 0.04)',
    md: '0 2px 3px -1px rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
    lg: '0 4px 6px -2px rgb(0 0 0 / 0.05), 0 2px 3px -2px rgb(0 0 0 / 0.05)',
    xl: '0 8px 10px -3px rgb(0 0 0 / 0.05), 0 4px 5px -3px rgb(0 0 0 / 0.05)',
    '2xl': '0 16px 30px -10px rgb(0 0 0 / 0.1)',
  },
  default: {
    '2xs': '0 1px rgb(0 0 0 / 0.05)',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  strong: {
    '2xs': '0 1px 1px rgb(0 0 0 / 0.1)',
    xs: '0 1px 3px 0 rgb(0 0 0 / 0.12)',
    sm: '0 2px 4px 0 rgb(0 0 0 / 0.14), 0 1px 2px -1px rgb(0 0 0 / 0.12)',
    md: '0 6px 10px -2px rgb(0 0 0 / 0.18), 0 3px 6px -3px rgb(0 0 0 / 0.16)',
    lg: '0 15px 20px -5px rgb(0 0 0 / 0.2), 0 6px 8px -6px rgb(0 0 0 / 0.18)',
    xl: '0 25px 35px -8px rgb(0 0 0 / 0.25), 0 10px 15px -8px rgb(0 0 0 / 0.2)',
    '2xl': '0 35px 60px -15px rgb(0 0 0 / 0.35)',
  },
}

const FONT_SCALE: Record<FontScale, number> = {
  compact: 0.875,
  default: 1,
  relaxed: 1.125,
  spacious: 1.25,
}

const SPACING_SCALE: Record<SpacingScale, number> = {
  compact: 0.875,
  default: 1,
  comfortable: 1.125,
  spacious: 1.25,
}

const HEADING_WEIGHT = { normal: 400, medium: 500, semibold: 600, bold: 700 } as const
const LINE_HEIGHT = { tight: 1.375, normal: 1.5, relaxed: 1.75 } as const
const RING_WIDTH = { thin: '1px', default: '2px', thick: '3px' } as const
const RING_OFFSET = { none: '0px', sm: '1px', default: '2px' } as const
const ICON_SIZE = { sm: '0.875rem', md: '1rem', lg: '1.25rem' } as const
const ICON_STROKE = { thin: '1.5', default: '2', thick: '2.5' } as const
const SIDEBAR_WIDTH = { narrow: '12rem', default: '15rem', wide: '18rem' } as const
const HEADER_HEIGHT = { compact: '3rem', default: '3.5rem', tall: '4.5rem' } as const

/** Pick black or white text for a background, whichever contrasts more */
export function readableOn(background: string): string {
  const bg = parseColor(background)
  if (!bg) return 'oklch(0.985 0 0)'
  const white = getContrastRatio(bg, { r: 255, g: 255, b: 255 })
  const black = getContrastRatio(bg, { r: 10, g: 10, b: 10 })
  return white >= black ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)'
}

function applyOverrides(base: ColorSet, overrides: Record<string, string> | undefined): ColorSet {
  if (!overrides) return { ...base }
  const out = { ...base } as Record<string, string>
  for (const [name, value] of Object.entries(overrides)) {
    const key = toColorKey(name)
    if (key in out && value) out[key] = value
  }
  return out as ColorSet
}

function ensureReadable(set: ColorSet): ColorSet {
  // Some palettes ship destructive-foreground equal to destructive (shadcn v4
  // dropped the token); keep text on destructive fills legible.
  if (!set.destructiveForeground || set.destructiveForeground === set.destructive) {
    set.destructiveForeground = readableOn(set.destructive)
  }
  return set
}

function resolveColors(config: DesignSystemConfigInput): ThemeColors {
  const { theme } = config
  const generated = getThemeColors(theme.baseColor, theme.accentTheme)
  const light = applyOverrides(generated.light, theme.custom?.light as Record<string, string>)
  const dark = applyOverrides(generated.dark, theme.custom?.dark as Record<string, string>)

  if (theme.customPrimary) {
    const fg = readableOn(theme.customPrimary)
    for (const set of [light, dark]) {
      set.primary = theme.customPrimary
      set.primaryForeground = fg
      set.ring = theme.customPrimary
      set.sidebarPrimary = theme.customPrimary
      set.sidebarPrimaryForeground = fg
      set.sidebarRing = theme.customPrimary
      set.chart1 = theme.customPrimary
    }
  }

  return { light: ensureReadable(light), dark: ensureReadable(dark) }
}

function resolveRadius(config: DesignSystemConfigInput): string {
  const { theme } = config
  if (typeof theme.radiusValue === 'number') return `${theme.radiusValue}rem`
  if (theme.custom?.radius) return theme.custom.radius
  return RADIUS_OPTIONS.find((r) => r.name === theme.radius)?.value ?? '0.5rem'
}

function fullShadowScale(partial: Record<string, string>, fallback: ShadowScale): ShadowScale {
  const xs = partial.xs ?? fallback.xs
  const sm = partial.sm ?? fallback.sm
  const md = partial.md ?? fallback.md
  const lg = partial.lg ?? fallback.lg
  return {
    '2xs': partial['2xs'] ?? xs,
    xs,
    sm,
    md,
    lg,
    xl: partial.xl ?? lg,
    '2xl': partial['2xl'] ?? partial.xl ?? lg,
  }
}

export function resolveTheme(config: DesignSystemConfigInput): ResolvedTheme {
  const { theme, typography, components, icons, layout } = config
  const custom = theme.custom ?? null
  const baseShadows = SHADOWS[theme.shadowIntensity] ?? SHADOWS.default!

  const fontSans = custom?.fontSans ?? fontStack(typography.fontFamily)

  return {
    colors: resolveColors(config),
    radius: resolveRadius(config),
    fontSans,
    fontHeading: custom?.fontHeading ?? fontSans,
    fontMono: custom?.fontMono ?? fontStack(typography.monoFontFamily, true),
    shadows: {
      light: custom?.shadows
        ? fullShadowScale(custom.shadows.light as Record<string, string>, baseShadows)
        : baseShadows,
      dark: custom?.shadows
        ? fullShadowScale(custom.shadows.dark as Record<string, string>, baseShadows)
        : baseShadows,
    },
    borderWidth:
      custom?.borderWidth ??
      BORDER_WIDTHS.find((b) => b.name === components.borderWidth)?.value ??
      '1px',
    animationDuration:
      ANIMATION_SPEEDS.find((a) => a.name === components.animationSpeed)?.duration ?? '200ms',
    fontScale: FONT_SCALE[typography.fontScale] ?? 1,
    spacingScale: SPACING_SCALE[layout.spacingScale] ?? 1,
    headingWeight: HEADING_WEIGHT[typography.headingWeight] ?? 600,
    bodyLineHeight: LINE_HEIGHT[typography.bodyLineHeight] ?? 1.5,
    focusRingWidth: RING_WIDTH[components.focusRingWidth] ?? '2px',
    focusRingOffset: RING_OFFSET[components.focusRingOffset] ?? '2px',
    iconSize: ICON_SIZE[icons.defaultSize] ?? '1rem',
    iconStroke: ICON_STROKE[icons.strokeWidth] ?? '2',
    containerWidth: CONTAINER_WIDTHS.find((c) => c.name === layout.containerWidth)?.value ?? '100%',
    sidebarWidth: SIDEBAR_WIDTH[layout.sidebarWidth] ?? '15rem',
    headerHeight: HEADER_HEIGHT[layout.headerHeight] ?? '3.5rem',
  }
}

/** All colour tokens of one mode as `--<prefix><name>: value;` lines */
export function colorDeclarations(set: ColorSet, prefix = '', indent = '  '): string {
  return COLOR_KEYS.map((key) => `${indent}--${prefix}${toTokenName(key)}: ${set[key]};`).join('\n')
}

export const SHADOW_KEYS = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
