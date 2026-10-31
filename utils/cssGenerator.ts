import type { DesignSystemConfigInput } from '~/types/config'
import {
  resolveTheme,
  colorDeclarations,
  COLOR_KEYS,
  SHADOW_KEYS,
  toTokenName,
  type ResolvedTheme,
} from '~/utils/themeTokens'
import {
  generateNuxtUIExportPackage,
  generateNuxtUIAppConfig,
  generateNuxtUICSS,
} from './nuxtUIGenerator'
import { generateTailwindExportPackage, generateTailwindCSS } from './tailwindGenerator'

// Tailwind v4 text scale (rem) - rescaled inside the preview by the font scale
const TEXT_SCALE: Record<string, number> = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  '2xl': 1.5,
  '3xl': 1.875,
  '4xl': 2.25,
  '5xl': 3,
}

// Component styles adjust density on top of the spacing scale
const STYLE_SPACING: Record<string, number> = {
  default: 1,
  'new-york': 0.9,
  miami: 1,
  brutal: 1,
  soft: 1.05,
}

function shadowVars(theme: ResolvedTheme, mode: 'light' | 'dark', prefix: string): string {
  return SHADOW_KEYS.map((k) => `  --${prefix}shadow-${k}: ${theme.shadows[mode][k]};`).join('\n')
}

/**
 * CSS applied at runtime to the builder itself.
 *
 * Colours, radius and fonts are global so floating UI (dialogs, popovers)
 * matches the theme. Everything that changes density or component look is
 * scoped to `.vc-preview`, the live preview root, so the builder chrome stays
 * usable whatever the user picks.
 */
export function generateRuntimeCSS(config: DesignSystemConfigInput): string {
  const t = resolveTheme(config)
  const spacing = 0.25 * t.spacingScale * (STYLE_SPACING[config.components.style] ?? 1)
  const textVars = Object.entries(TEXT_SCALE)
    .map(([k, v]) => `  --text-${k}: ${+(v * t.fontScale).toFixed(4)}rem;`)
    .join('\n')
  const shadowUtilities = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
    .map((k) => `  :where(.vc-preview) .shadow-${k} { --tw-shadow: var(--vc-shadow-${k}); }`)
    .join('\n')

  return `:root {
${colorDeclarations(t.colors.light, 'color-')}
  --radius: ${t.radius};
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --font-sans: ${t.fontSans};
  --font-heading: ${t.fontHeading};
  --font-mono: ${t.fontMono};
${shadowVars(t, 'light', 'vc-')}
}

.dark {
${colorDeclarations(t.colors.dark, 'color-')}
${shadowVars(t, 'dark', 'vc-')}
}

@layer utilities {
${shadowUtilities}
  :where(.vc-preview) .shadow { --tw-shadow: var(--vc-shadow-sm); }
}

.vc-preview {
  --spacing: ${+spacing.toFixed(4)}rem;
${textVars}
  --default-transition-duration: ${t.animationDuration};
  --vc-border-width: ${t.borderWidth};
  --vc-heading-weight: ${t.headingWeight};
  --vc-ring-width: ${t.focusRingWidth};
  --vc-ring-offset: ${t.focusRingOffset};
  --vc-icon-size: ${t.iconSize};
  --vc-icon-stroke: ${t.iconStroke};
  --vc-container: ${t.containerWidth};
  --vc-sidebar-width: ${t.sidebarWidth};
  --vc-header-height: ${t.headerHeight};
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: ${t.bodyLineHeight};
}

.vc-preview :is(h1, h2, h3, h4, h5, h6, [data-slot='card-title']) {
  font-family: var(--font-heading);
  font-weight: var(--vc-heading-weight);
}

.vc-preview p {
  line-height: ${t.bodyLineHeight};
}

.vc-preview .border {
  border-width: var(--vc-border-width);
}

.vc-preview :focus-visible {
  outline: var(--vc-ring-width) solid var(--color-ring);
  outline-offset: var(--vc-ring-offset);
}

.vc-preview .vc-icon {
  width: var(--vc-icon-size);
  height: var(--vc-icon-size);
}

.vc-preview :is(.vc-icon, .iconify) :is(path, line, circle, rect, polyline, polygon) {
  stroke-width: var(--vc-icon-stroke);
}
`
}

/**
 * shadcn-vue (Tailwind v4) theme CSS for export.
 * Follows the shadcn v4 layout: raw tokens on :root/.dark, mapped to Tailwind
 * utilities with `@theme inline`.
 */
export function generateCSSVariables(config: DesignSystemConfigInput): string {
  const t = resolveTheme(config)
  const prefix = config.export.cssVariablesPrefix ? `${config.export.cssVariablesPrefix}-` : ''
  const themeColors = COLOR_KEYS.map(
    (k) => `  --color-${toTokenName(k)}: var(--${prefix}${toTokenName(k)});`
  ).join('\n')
  const themeShadows = SHADOW_KEYS.map((k) => `  --shadow-${k}: var(--${prefix}shadow-${k});`).join(
    '\n'
  )

  return `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --${prefix}radius: ${t.radius};
${colorDeclarations(t.colors.light, prefix)}
  --${prefix}font-sans: ${t.fontSans};
  --${prefix}font-heading: ${t.fontHeading};
  --${prefix}font-mono: ${t.fontMono};
${shadowVars(t, 'light', prefix)}
}

.dark {
${colorDeclarations(t.colors.dark, prefix)}
${shadowVars(t, 'dark', prefix)}
}

@theme inline {
${themeColors}
  --radius-sm: calc(var(--${prefix}radius) - 4px);
  --radius-md: calc(var(--${prefix}radius) - 2px);
  --radius-lg: var(--${prefix}radius);
  --radius-xl: calc(var(--${prefix}radius) + 4px);
  --font-sans: var(--${prefix}font-sans);
  --font-heading: var(--${prefix}font-heading);
  --font-mono: var(--${prefix}font-mono);
${themeShadows}
  --default-transition-duration: ${t.animationDuration};
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans;
    line-height: ${t.bodyLineHeight};
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: ${t.headingWeight};
  }
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
        badge: 'Nuxt UI v4',
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
