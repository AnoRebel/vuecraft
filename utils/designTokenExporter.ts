/**
 * Design Token Exporter for Vuecraft
 * Export themes to various design token formats
 */

import type { DesignSystemConfig } from '~/types/config'
import { parseOklch, oklchToRgb, rgbToHex } from './colorUtils'

export type ExportFormat = 'figma' | 'style-dictionary' | 'css-in-js' | 'json-tokens' | 'tailwind-config'

/**
 * Get all CSS variables from the current theme
 */
function getThemeVariables(config: DesignSystemConfig): Record<string, string> {
  // This would ideally read from the generated CSS, but we'll construct them
  const vars: Record<string, string> = {}

  // Add some base variables (these would come from the theme generation)
  vars['--background'] = 'oklch(1 0 0)'
  vars['--foreground'] = 'oklch(0.141 0.005 285.823)'
  vars['--primary'] = `oklch(0.21 0.006 285.885)`
  vars['--primary-foreground'] = 'oklch(0.985 0 0)'
  vars['--secondary'] = 'oklch(0.967 0.001 286.375)'
  vars['--secondary-foreground'] = 'oklch(0.21 0.006 285.885)'
  vars['--muted'] = 'oklch(0.967 0.001 286.375)'
  vars['--muted-foreground'] = 'oklch(0.552 0.016 285.938)'
  vars['--accent'] = 'oklch(0.967 0.001 286.375)'
  vars['--accent-foreground'] = 'oklch(0.21 0.006 285.885)'
  vars['--destructive'] = 'oklch(0.577 0.245 27.325)'
  vars['--destructive-foreground'] = 'oklch(0.577 0.245 27.325)'
  vars['--border'] = 'oklch(0.92 0.004 286.32)'
  vars['--input'] = 'oklch(0.92 0.004 286.32)'
  vars['--ring'] = 'oklch(0.708 0.022 261.325)'
  vars['--radius'] = config.theme.radius === 'none' ? '0' : config.theme.radius === 'sm' ? '0.25rem' : config.theme.radius === 'md' ? '0.375rem' : config.theme.radius === 'lg' ? '0.5rem' : '0.75rem'

  return vars
}

/**
 * Convert OKLCH to HEX for formats that need it
 */
function convertToHex(value: string): string {
  const oklch = parseOklch(value)
  if (oklch) {
    return rgbToHex(oklchToRgb(oklch))
  }
  return value
}

/**
 * Generate Figma Tokens plugin format
 */
export function generateFigmaTokens(config: DesignSystemConfig): string {
  const vars = getThemeVariables(config)

  const tokens: Record<string, Record<string, { value: string; type: string }>> = {
    colors: {},
    spacing: {},
    borderRadius: {},
    typography: {},
  }

  // Color tokens
  for (const [key, value] of Object.entries(vars)) {
    if (key.startsWith('--') && !key.includes('radius')) {
      const name = key.replace('--', '').replace(/-/g, '.')
      tokens.colors[name] = {
        value: convertToHex(value),
        type: 'color',
      }
    }
  }

  // Border radius
  tokens.borderRadius = {
    none: { value: '0', type: 'borderRadius' },
    sm: { value: '0.25rem', type: 'borderRadius' },
    md: { value: '0.375rem', type: 'borderRadius' },
    lg: { value: '0.5rem', type: 'borderRadius' },
    xl: { value: '0.75rem', type: 'borderRadius' },
    full: { value: '9999px', type: 'borderRadius' },
  }

  // Typography
  tokens.typography = {
    fontFamily: {
      sans: { value: config.typography.fontFamily, type: 'fontFamilies' },
      mono: { value: config.typography.monoFontFamily, type: 'fontFamilies' },
    },
  }

  return JSON.stringify(tokens, null, 2)
}

/**
 * Generate Style Dictionary format
 */
export function generateStyleDictionary(config: DesignSystemConfig): string {
  const vars = getThemeVariables(config)

  const tokens: Record<string, unknown> = {
    color: {},
    size: {
      radius: {},
    },
    font: {},
  }

  // Color tokens
  for (const [key, value] of Object.entries(vars)) {
    if (key.startsWith('--') && !key.includes('radius')) {
      const name = key.replace('--', '')
      ;(tokens.color as Record<string, unknown>)[name] = {
        value: convertToHex(value),
      }
    }
  }

  // Radius tokens
  ;(tokens.size as Record<string, unknown>).radius = {
    none: { value: '0' },
    sm: { value: '4px' },
    md: { value: '6px' },
    lg: { value: '8px' },
    xl: { value: '12px' },
  }

  // Font tokens
  ;(tokens.font as Record<string, unknown>) = {
    family: {
      sans: { value: config.typography.fontFamily },
      mono: { value: config.typography.monoFontFamily },
    },
  }

  return JSON.stringify(tokens, null, 2)
}

/**
 * Generate CSS-in-JS theme object (styled-components, emotion, etc.)
 */
export function generateCSSInJS(config: DesignSystemConfig): string {
  const vars = getThemeVariables(config)

  const theme: Record<string, unknown> = {
    colors: {},
    radii: {},
    fonts: {},
    shadows: {},
  }

  // Colors
  for (const [key, value] of Object.entries(vars)) {
    if (key.startsWith('--') && !key.includes('radius')) {
      const name = key
        .replace('--', '')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      ;(theme.colors as Record<string, string>)[name] = convertToHex(value)
    }
  }

  // Radii
  ;(theme.radii as Record<string, string>) = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  }

  // Fonts
  ;(theme.fonts as Record<string, string>) = {
    sans: config.typography.fontFamily,
    mono: config.typography.monoFontFamily,
  }

  // Shadows
  ;(theme.shadows as Record<string, string>) = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  }

  return `export const theme = ${JSON.stringify(theme, null, 2)} as const;

export type Theme = typeof theme;`
}

/**
 * Generate W3C Design Tokens format
 * https://design-tokens.github.io/community-group/format/
 */
export function generateW3CDesignTokens(config: DesignSystemConfig): string {
  const vars = getThemeVariables(config)

  const tokens: Record<string, unknown> = {
    $name: 'Vuecraft Theme',
    $description: `Generated by Vuecraft - ${config.theme.accentTheme} theme`,
    color: {},
    dimension: {},
    fontFamily: {},
  }

  // Color tokens
  for (const [key, value] of Object.entries(vars)) {
    if (key.startsWith('--') && !key.includes('radius')) {
      const name = key.replace('--', '')
      ;(tokens.color as Record<string, unknown>)[name] = {
        $type: 'color',
        $value: convertToHex(value),
      }
    }
  }

  // Dimension tokens (radius)
  ;(tokens.dimension as Record<string, unknown>) = {
    'radius-none': { $type: 'dimension', $value: '0px' },
    'radius-sm': { $type: 'dimension', $value: '4px' },
    'radius-md': { $type: 'dimension', $value: '6px' },
    'radius-lg': { $type: 'dimension', $value: '8px' },
    'radius-xl': { $type: 'dimension', $value: '12px' },
  }

  // Font family tokens
  ;(tokens.fontFamily as Record<string, unknown>) = {
    sans: {
      $type: 'fontFamily',
      $value: config.typography.fontFamily,
    },
    mono: {
      $type: 'fontFamily',
      $value: config.typography.monoFontFamily,
    },
  }

  return JSON.stringify(tokens, null, 2)
}

/**
 * Generate Tailwind CSS config
 */
export function generateTailwindConfig(config: DesignSystemConfig): string {
  const vars = getThemeVariables(config)

  const colors: Record<string, string> = {}
  for (const [key, value] of Object.entries(vars)) {
    if (key.startsWith('--') && !key.includes('radius')) {
      const name = key.replace('--', '')
      colors[name] = `var(${key})`
    }
  }

  return `/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/"/g, "'")},
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      fontFamily: {
        sans: ['${config.typography.fontFamily}', 'system-ui', 'sans-serif'],
        mono: ['${config.typography.monoFontFamily}', 'monospace'],
      },
    },
  },
}`
}

/**
 * Main export function
 */
export function generateDesignTokens(config: DesignSystemConfig, format: ExportFormat): string {
  switch (format) {
    case 'figma':
      return generateFigmaTokens(config)
    case 'style-dictionary':
      return generateStyleDictionary(config)
    case 'css-in-js':
      return generateCSSInJS(config)
    case 'json-tokens':
      return generateW3CDesignTokens(config)
    case 'tailwind-config':
      return generateTailwindConfig(config)
    default:
      return ''
  }
}

/**
 * Get file extension for format
 */
export function getFormatExtension(format: ExportFormat): string {
  switch (format) {
    case 'figma':
    case 'style-dictionary':
    case 'json-tokens':
      return '.tokens.json'
    case 'css-in-js':
      return '.theme.ts'
    case 'tailwind-config':
      return '.tailwind.config.js'
    default:
      return '.json'
  }
}

/**
 * Get format description
 */
export function getFormatDescription(format: ExportFormat): string {
  switch (format) {
    case 'figma':
      return 'Figma Tokens plugin format'
    case 'style-dictionary':
      return 'Amazon Style Dictionary format'
    case 'css-in-js':
      return 'CSS-in-JS theme (styled-components, emotion)'
    case 'json-tokens':
      return 'W3C Design Tokens Community Group format'
    case 'tailwind-config':
      return 'Tailwind CSS configuration'
    default:
      return ''
  }
}
