import type {
  DesignSystemConfigInput,
  RadiusValue,
  ShadowIntensity,
  FontScale,
  SpacingScale,
  AnimationSpeed,
  BorderWidth,
} from '~/types/config'
import { getThemeColors } from '~/config/themes'
import { RADIUS_OPTIONS, ANIMATION_SPEEDS, BORDER_WIDTHS } from '~/config/defaults'
import {
  generateNuxtUIExportPackage,
  generateNuxtUIAppConfig,
  generateNuxtUICSS,
} from './nuxtUIGenerator'
import { generateTailwindExportPackage, generateTailwindCSS } from './tailwindGenerator'

// Font family mappings
const FONT_FAMILY_MAP: Record<string, string> = {
  inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  'noto-sans': '"Noto Sans", ui-sans-serif, system-ui, sans-serif',
  'nunito-sans': '"Nunito Sans", ui-sans-serif, system-ui, sans-serif',
  figtree: '"Figtree", ui-sans-serif, system-ui, sans-serif',
  roboto: '"Roboto", ui-sans-serif, system-ui, sans-serif',
  raleway: '"Raleway", ui-sans-serif, system-ui, sans-serif',
  'dm-sans': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  'public-sans': '"Public Sans", ui-sans-serif, system-ui, sans-serif',
  outfit: '"Outfit", ui-sans-serif, system-ui, sans-serif',
  geist: '"Geist", ui-sans-serif, system-ui, sans-serif',
}

const MONO_FONT_FAMILY_MAP: Record<string, string> = {
  'jetbrains-mono': '"JetBrains Mono", ui-monospace, monospace',
  'geist-mono': '"Geist Mono", ui-monospace, monospace',
  'fira-code': '"Fira Code", ui-monospace, monospace',
  'source-code-pro': '"Source Code Pro", ui-monospace, monospace',
}

// Get radius value
function getRadiusValue(radius: RadiusValue): string {
  const option = RADIUS_OPTIONS.find((r) => r.name === radius)
  return option?.value ?? '0.5rem'
}

// Get shadow values based on intensity
function getShadowValues(intensity: ShadowIntensity): {
  sm: string
  md: string
  lg: string
  xl: string
} {
  switch (intensity) {
    case 'none':
      return {
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
      }
    case 'subtle':
      return {
        sm: '0 1px 1px 0 rgb(0 0 0 / 0.03)',
        md: '0 2px 3px -1px rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        lg: '0 4px 6px -2px rgb(0 0 0 / 0.05), 0 2px 3px -2px rgb(0 0 0 / 0.05)',
        xl: '0 8px 10px -3px rgb(0 0 0 / 0.05), 0 4px 5px -3px rgb(0 0 0 / 0.05)',
      }
    case 'default':
      return {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }
    case 'strong':
      return {
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 6px 10px -2px rgb(0 0 0 / 0.15), 0 3px 6px -3px rgb(0 0 0 / 0.15)',
        lg: '0 15px 20px -5px rgb(0 0 0 / 0.15), 0 6px 8px -6px rgb(0 0 0 / 0.15)',
        xl: '0 25px 35px -8px rgb(0 0 0 / 0.2), 0 10px 15px -8px rgb(0 0 0 / 0.15)',
      }
  }
}

// Get font scale multiplier (exported for future use)
export function getFontScaleMultiplier(scale: FontScale): number {
  switch (scale) {
    case 'compact':
      return 0.875
    case 'default':
      return 1
    case 'relaxed':
      return 1.125
    case 'spacious':
      return 1.25
  }
}

// Get spacing scale multiplier (exported for future use)
export function getSpacingScaleMultiplier(scale: SpacingScale): number {
  switch (scale) {
    case 'compact':
      return 0.875
    case 'default':
      return 1
    case 'comfortable':
      return 1.125
    case 'spacious':
      return 1.25
  }
}

// Get animation duration
function getAnimationDuration(speed: AnimationSpeed): string {
  const option = ANIMATION_SPEEDS.find((a) => a.name === speed)
  return option?.duration ?? '200ms'
}

// Get border width
function getBorderWidth(width: BorderWidth): string {
  const option = BORDER_WIDTHS.find((b) => b.name === width)
  return option?.value ?? '1px'
}

// Generate CSS variables from config
export function generateCSSVariables(config: DesignSystemConfigInput): string {
  const colors = getThemeColors(config.theme.baseColor, config.theme.accentTheme)
  const radius = getRadiusValue(config.theme.radius)
  const shadows = getShadowValues(config.theme.shadowIntensity)
  const fontFamily = FONT_FAMILY_MAP[config.typography.fontFamily] ?? FONT_FAMILY_MAP['inter']
  const monoFontFamily =
    MONO_FONT_FAMILY_MAP[config.typography.monoFontFamily] ?? MONO_FONT_FAMILY_MAP['jetbrains-mono']
  const animationDuration = getAnimationDuration(config.components.animationSpeed)
  const borderWidth = getBorderWidth(config.components.borderWidth)

  // Generate CSS that directly sets --color-* variables for runtime application
  // This bypasses Tailwind's @theme which is compile-time only
  const lightVars = `
  /* Light mode colors - using --color-* directly for Tailwind CSS v4 */
  --color-background: ${colors.light.background};
  --color-foreground: ${colors.light.foreground};
  --color-card: ${colors.light.card};
  --color-card-foreground: ${colors.light.cardForeground};
  --color-popover: ${colors.light.popover};
  --color-popover-foreground: ${colors.light.popoverForeground};
  --color-primary: ${colors.light.primary};
  --color-primary-foreground: ${colors.light.primaryForeground};
  --color-secondary: ${colors.light.secondary};
  --color-secondary-foreground: ${colors.light.secondaryForeground};
  --color-muted: ${colors.light.muted};
  --color-muted-foreground: ${colors.light.mutedForeground};
  --color-accent: ${colors.light.accent};
  --color-accent-foreground: ${colors.light.accentForeground};
  --color-destructive: ${colors.light.destructive};
  --color-destructive-foreground: ${colors.light.destructiveForeground};
  --color-border: ${colors.light.border};
  --color-input: ${colors.light.input};
  --color-ring: ${colors.light.ring};

  /* Chart colors */
  --color-chart-1: ${colors.light.chart1};
  --color-chart-2: ${colors.light.chart2};
  --color-chart-3: ${colors.light.chart3};
  --color-chart-4: ${colors.light.chart4};
  --color-chart-5: ${colors.light.chart5};

  /* Sidebar colors */
  --color-sidebar: ${colors.light.sidebar};
  --color-sidebar-foreground: ${colors.light.sidebarForeground};
  --color-sidebar-primary: ${colors.light.sidebarPrimary};
  --color-sidebar-primary-foreground: ${colors.light.sidebarPrimaryForeground};
  --color-sidebar-accent: ${colors.light.sidebarAccent};
  --color-sidebar-accent-foreground: ${colors.light.sidebarAccentForeground};
  --color-sidebar-border: ${colors.light.sidebarBorder};
  --color-sidebar-ring: ${colors.light.sidebarRing};`

  const darkVars = `
  /* Dark mode colors */
  --color-background: ${colors.dark.background};
  --color-foreground: ${colors.dark.foreground};
  --color-card: ${colors.dark.card};
  --color-card-foreground: ${colors.dark.cardForeground};
  --color-popover: ${colors.dark.popover};
  --color-popover-foreground: ${colors.dark.popoverForeground};
  --color-primary: ${colors.dark.primary};
  --color-primary-foreground: ${colors.dark.primaryForeground};
  --color-secondary: ${colors.dark.secondary};
  --color-secondary-foreground: ${colors.dark.secondaryForeground};
  --color-muted: ${colors.dark.muted};
  --color-muted-foreground: ${colors.dark.mutedForeground};
  --color-accent: ${colors.dark.accent};
  --color-accent-foreground: ${colors.dark.accentForeground};
  --color-destructive: ${colors.dark.destructive};
  --color-destructive-foreground: ${colors.dark.destructiveForeground};
  --color-border: ${colors.dark.border};
  --color-input: ${colors.dark.input};
  --color-ring: ${colors.dark.ring};

  /* Chart colors */
  --color-chart-1: ${colors.dark.chart1};
  --color-chart-2: ${colors.dark.chart2};
  --color-chart-3: ${colors.dark.chart3};
  --color-chart-4: ${colors.dark.chart4};
  --color-chart-5: ${colors.dark.chart5};

  /* Sidebar colors */
  --color-sidebar: ${colors.dark.sidebar};
  --color-sidebar-foreground: ${colors.dark.sidebarForeground};
  --color-sidebar-primary: ${colors.dark.sidebarPrimary};
  --color-sidebar-primary-foreground: ${colors.dark.sidebarPrimaryForeground};
  --color-sidebar-accent: ${colors.dark.sidebarAccent};
  --color-sidebar-accent-foreground: ${colors.dark.sidebarAccentForeground};
  --color-sidebar-border: ${colors.dark.sidebarBorder};
  --color-sidebar-ring: ${colors.dark.sidebarRing};`

  const sharedVars = `
  /* Shared variables */
  --radius: ${radius};
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Typography */
  --font-sans: ${fontFamily};
  --font-mono: ${monoFontFamily};

  /* Shadows */
  --shadow-sm: ${shadows.sm};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
  --shadow-xl: ${shadows.xl};

  /* Animation */
  --animation-duration: ${animationDuration};

  /* Borders */
  --border-width: ${borderWidth};`

  return `@import "tailwindcss";

@theme {
  /* Theme configuration for Tailwind CSS v4 */
  --color-background: var(--color-background);
  --color-foreground: var(--color-foreground);
  --color-card: var(--color-card);
  --color-card-foreground: var(--color-card-foreground);
  --color-popover: var(--color-popover);
  --color-popover-foreground: var(--color-popover-foreground);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-foreground);
  --color-secondary: var(--color-secondary);
  --color-secondary-foreground: var(--color-secondary-foreground);
  --color-muted: var(--color-muted);
  --color-muted-foreground: var(--color-muted-foreground);
  --color-accent: var(--color-accent);
  --color-accent-foreground: var(--color-accent-foreground);
  --color-destructive: var(--color-destructive);
  --color-destructive-foreground: var(--color-destructive-foreground);
  --color-border: var(--color-border);
  --color-input: var(--color-input);
  --color-ring: var(--color-ring);

  /* Chart colors */
  --color-chart-1: var(--color-chart-1);
  --color-chart-2: var(--color-chart-2);
  --color-chart-3: var(--color-chart-3);
  --color-chart-4: var(--color-chart-4);
  --color-chart-5: var(--color-chart-5);

  /* Sidebar colors */
  --color-sidebar: var(--color-sidebar);
  --color-sidebar-foreground: var(--color-sidebar-foreground);
  --color-sidebar-primary: var(--color-sidebar-primary);
  --color-sidebar-primary-foreground: var(--color-sidebar-primary-foreground);
  --color-sidebar-accent: var(--color-sidebar-accent);
  --color-sidebar-accent-foreground: var(--color-sidebar-accent-foreground);
  --color-sidebar-border: var(--color-sidebar-border);
  --color-sidebar-ring: var(--color-sidebar-ring);

  /* Radius */
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);

  /* Fonts */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

:root {
${sharedVars}
${lightVars}
}

.dark {
${darkVars}
}

/* Base styles */
* {
  border-color: var(--color-border);
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
}
`
}

// Generate Tailwind CSS v4 config-compatible CSS
export function generateTailwindV4CSS(config: DesignSystemConfigInput): string {
  return generateCSSVariables(config)
}

// Generate components.json for shadcn-vue CLI
export function generateComponentsJson(config: DesignSystemConfigInput): string {
  const json = {
    $schema: 'https://shadcn-vue.com/schema.json',
    style: config.components.style,
    tailwind: {
      config: '',
      css: 'src/assets/css/main.css',
      baseColor: config.theme.baseColor,
    },
    framework: config.export.framework,
    typescript: config.export.typescript,
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/composables',
    },
    iconLibrary: config.icons.library,
  }

  return JSON.stringify(json, null, 2)
}

// Generate full export package for shadcn-vue
export function generateExportPackage(config: DesignSystemConfigInput): {
  css: string
  componentsJson: string
  readme: string
} {
  const css = generateCSSVariables(config)
  const componentsJson = generateComponentsJson(config)

  const readme = `# shadcn-vue Design System

This design system was generated using Vuecraft.

## Configuration

- **Base Color**: ${config.theme.baseColor}
- **Accent Theme**: ${config.theme.accentTheme}
- **Style**: ${config.components.style}
- **Border Radius**: ${config.theme.radius}
- **Font Family**: ${config.typography.fontFamily}
- **Icon Library**: ${config.icons.library}
- **Framework**: ${config.export.framework}

## Installation

### For ${config.export.framework === 'nuxt' ? 'Nuxt' : 'Vue (Vite)'}

1. Copy the CSS file to your project's assets folder
2. Import it in your main entry file
3. Copy \`components.json\` to your project root
4. Run \`npx shadcn-vue@latest add <component>\` to add components

## Files Included

- \`main.css\` - Theme CSS with Tailwind CSS v4 configuration
- \`components.json\` - shadcn-vue CLI configuration
`

  return { css, componentsJson, readme }
}

// ============================================
// Universal Export Package Generator
// ============================================

// Generate CSS based on the selected UI library
export function generateUniversalCSS(config: DesignSystemConfigInput): string {
  const uiLibrary = config.export.uiLibrary

  switch (uiLibrary) {
    case 'nuxt-ui':
      return generateNuxtUICSS(config)
    case 'tailwind':
      return generateTailwindCSS(config)
    case 'shadcn-vue':
    default:
      return generateCSSVariables(config)
  }
}

// Generate the appropriate config file based on UI library
export function generateUniversalConfig(config: DesignSystemConfigInput): string {
  const uiLibrary = config.export.uiLibrary

  switch (uiLibrary) {
    case 'nuxt-ui':
      return generateNuxtUIAppConfig(config)
    case 'tailwind':
      return '' // Plain Tailwind doesn't need a config file
    case 'shadcn-vue':
    default:
      return generateComponentsJson(config)
  }
}

// Generate universal export package
export function generateUniversalExportPackage(config: DesignSystemConfigInput): {
  css: string
  config: string
  configFilename: string
  readme: string
  additionalFiles?: { filename: string; content: string }[]
} {
  const uiLibrary = config.export.uiLibrary

  switch (uiLibrary) {
    case 'nuxt-ui': {
      const pkg = generateNuxtUIExportPackage(config)
      return {
        css: pkg.css,
        config: pkg.appConfig,
        configFilename: 'app.config.ts',
        readme: pkg.readme,
        additionalFiles: [{ filename: 'nuxt.config.ts.example', content: pkg.nuxtConfig }],
      }
    }
    case 'tailwind': {
      const pkg = generateTailwindExportPackage(config)
      return {
        css: pkg.css,
        config: pkg.setupScript,
        configFilename: 'setup.sh',
        readme: pkg.readme,
      }
    }
    case 'shadcn-vue':
    default: {
      const pkg = generateExportPackage(config)
      return {
        css: pkg.css,
        config: pkg.componentsJson,
        configFilename: 'components.json',
        readme: pkg.readme,
      }
    }
  }
}

// Get UI library display info
export function getUILibraryInfo(uiLibrary: string): {
  name: string
  badge: string
  cssFilename: string
  configFilename: string
} {
  switch (uiLibrary) {
    case 'nuxt-ui':
      return {
        name: 'Nuxt UI',
        badge: 'Nuxt UI v3',
        cssFilename: 'main.css',
        configFilename: 'app.config.ts',
      }
    case 'tailwind':
      return {
        name: 'Plain Tailwind',
        badge: 'Tailwind CSS v4',
        cssFilename: 'main.css',
        configFilename: 'setup.sh',
      }
    case 'shadcn-vue':
    default:
      return {
        name: 'shadcn-vue',
        badge: 'shadcn-vue',
        cssFilename: 'main.css',
        configFilename: 'components.json',
      }
  }
}
