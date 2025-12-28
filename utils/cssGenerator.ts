import type {
  DesignSystemConfig,
  RadiusValue,
  ShadowIntensity,
  FontScale,
  SpacingScale,
  AnimationSpeed,
  BorderWidth,
} from '~/types/config'
import { getThemeColors } from '~/config/themes'
import { RADIUS_OPTIONS, ANIMATION_SPEEDS, BORDER_WIDTHS } from '~/config/defaults'

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
export function generateCSSVariables(config: DesignSystemConfig): string {
  const colors = getThemeColors(config.theme.baseColor, config.theme.accentTheme)
  const radius = getRadiusValue(config.theme.radius)
  const shadows = getShadowValues(config.theme.shadowIntensity)
  const fontFamily = FONT_FAMILY_MAP[config.typography.fontFamily] ?? FONT_FAMILY_MAP['inter']
  const monoFontFamily =
    MONO_FONT_FAMILY_MAP[config.typography.monoFontFamily] ?? MONO_FONT_FAMILY_MAP['jetbrains-mono']
  const animationDuration = getAnimationDuration(config.components.animationSpeed)
  const borderWidth = getBorderWidth(config.components.borderWidth)

  const lightVars = `
  /* Light mode colors */
  --background: ${colors.light.background};
  --foreground: ${colors.light.foreground};
  --card: ${colors.light.card};
  --card-foreground: ${colors.light.cardForeground};
  --popover: ${colors.light.popover};
  --popover-foreground: ${colors.light.popoverForeground};
  --primary: ${colors.light.primary};
  --primary-foreground: ${colors.light.primaryForeground};
  --secondary: ${colors.light.secondary};
  --secondary-foreground: ${colors.light.secondaryForeground};
  --muted: ${colors.light.muted};
  --muted-foreground: ${colors.light.mutedForeground};
  --accent: ${colors.light.accent};
  --accent-foreground: ${colors.light.accentForeground};
  --destructive: ${colors.light.destructive};
  --destructive-foreground: ${colors.light.destructiveForeground};
  --border: ${colors.light.border};
  --input: ${colors.light.input};
  --ring: ${colors.light.ring};

  /* Chart colors */
  --chart-1: ${colors.light.chart1};
  --chart-2: ${colors.light.chart2};
  --chart-3: ${colors.light.chart3};
  --chart-4: ${colors.light.chart4};
  --chart-5: ${colors.light.chart5};

  /* Sidebar colors */
  --sidebar: ${colors.light.sidebar};
  --sidebar-foreground: ${colors.light.sidebarForeground};
  --sidebar-primary: ${colors.light.sidebarPrimary};
  --sidebar-primary-foreground: ${colors.light.sidebarPrimaryForeground};
  --sidebar-accent: ${colors.light.sidebarAccent};
  --sidebar-accent-foreground: ${colors.light.sidebarAccentForeground};
  --sidebar-border: ${colors.light.sidebarBorder};
  --sidebar-ring: ${colors.light.sidebarRing};`

  const darkVars = `
  /* Dark mode colors */
  --background: ${colors.dark.background};
  --foreground: ${colors.dark.foreground};
  --card: ${colors.dark.card};
  --card-foreground: ${colors.dark.cardForeground};
  --popover: ${colors.dark.popover};
  --popover-foreground: ${colors.dark.popoverForeground};
  --primary: ${colors.dark.primary};
  --primary-foreground: ${colors.dark.primaryForeground};
  --secondary: ${colors.dark.secondary};
  --secondary-foreground: ${colors.dark.secondaryForeground};
  --muted: ${colors.dark.muted};
  --muted-foreground: ${colors.dark.mutedForeground};
  --accent: ${colors.dark.accent};
  --accent-foreground: ${colors.dark.accentForeground};
  --destructive: ${colors.dark.destructive};
  --destructive-foreground: ${colors.dark.destructiveForeground};
  --border: ${colors.dark.border};
  --input: ${colors.dark.input};
  --ring: ${colors.dark.ring};

  /* Chart colors */
  --chart-1: ${colors.dark.chart1};
  --chart-2: ${colors.dark.chart2};
  --chart-3: ${colors.dark.chart3};
  --chart-4: ${colors.dark.chart4};
  --chart-5: ${colors.dark.chart5};

  /* Sidebar colors */
  --sidebar: ${colors.dark.sidebar};
  --sidebar-foreground: ${colors.dark.sidebarForeground};
  --sidebar-primary: ${colors.dark.sidebarPrimary};
  --sidebar-primary-foreground: ${colors.dark.sidebarPrimaryForeground};
  --sidebar-accent: ${colors.dark.sidebarAccent};
  --sidebar-accent-foreground: ${colors.dark.sidebarAccentForeground};
  --sidebar-border: ${colors.dark.sidebarBorder};
  --sidebar-ring: ${colors.dark.sidebarRing};`

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
  /* Color variables - Light mode defaults */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Chart colors */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Sidebar colors */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

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
  border-color: var(--border);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}
`
}

// Generate Tailwind CSS v4 config-compatible CSS
export function generateTailwindV4CSS(config: DesignSystemConfig): string {
  return generateCSSVariables(config)
}

// Generate components.json for shadcn-vue CLI
export function generateComponentsJson(config: DesignSystemConfig): string {
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

// Generate full export package
export function generateExportPackage(config: DesignSystemConfig): {
  css: string
  componentsJson: string
  readme: string
} {
  const css = generateCSSVariables(config)
  const componentsJson = generateComponentsJson(config)

  const readme = `# shadcn-vue Design System

This design system was generated using [shadcn-vue Create](https://github.com/shadcn-vue/create).

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
