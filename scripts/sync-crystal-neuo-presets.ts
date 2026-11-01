/**
 * Generates config/crystalNeuoPresets.ts from a Crystal Neuo tokens.json.
 *
 * Usage:
 *   bun scripts/sync-crystal-neuo-presets.ts <path-to-crystal-neuo>/packages/tokens/src/tokens.json
 *
 * Each Crystal Neuo material becomes one preset. Material role colours are
 * mapped onto the shadcn semantic token set (background, card, primary, ...)
 * for light and dark, and the material's radius, type, shadows and border
 * width are carried over so the preset looks like the material, not just
 * its palette.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

type Roles = Record<string, string>
interface Tokens {
  meta: { version: string; materials: string[] }
  roles: Record<string, { description: string; light: Roles; dark: Roles }>
  semantic: Record<string, Record<string, { value: string | Record<string, string> }>>
}

const input = process.argv[2]
if (!input) {
  console.error('Usage: bun scripts/sync-crystal-neuo-presets.ts <tokens.json>')
  process.exit(1)
}

const tokens = JSON.parse(readFileSync(resolve(input), 'utf8')) as Tokens
const { semantic } = tokens

function byMaterial(group: string, key: string, material: string): string {
  const value = semantic[group]?.[key]?.value
  if (typeof value === 'string') return value
  const v = value?.[material]
  if (!v) throw new Error(`Missing ${group}.${key} for ${material}`)
  return v
}

/** Resolve `{role.x}` references against a role palette. */
function resolveRoles(value: string, roles: Roles): string {
  return value.replace(/\{role\.([a-z0-9-]+)\}/g, (_, name: string) => {
    const v = roles[name]
    if (!v) throw new Error(`Unknown role ${name}`)
    return v
  })
}

/** Platform radius scale is 1 on the web platform. */
function stripPlatformScale(value: string): string {
  const m = value.match(/calc\(([\d.]+px) \* var\(--platform-radius-scale\)\)/)
  return m?.[1] ?? value
}

function colors(r: Roles, ink: boolean) {
  return {
    background: r.canvas,
    foreground: r.ink,
    card: r.surface,
    'card-foreground': r.ink,
    popover: r.overlay,
    'popover-foreground': r.ink,
    primary: r.accent,
    'primary-foreground': r['on-accent'],
    secondary: r['surface-3'],
    'secondary-foreground': r.ink,
    muted: r['surface-2'],
    'muted-foreground': r['ink-3'],
    accent: r['accent-soft'],
    'accent-foreground': r.ink,
    destructive: r['danger-strong'],
    'destructive-foreground': '#FFFFFF',
    // Ink materials outline everything; the others use hairlines for
    // containers and the stronger line for form controls.
    border: ink ? r.line : r['line-subtle'],
    input: r.line,
    ring: r.focus,
    'chart-1': r.accent,
    'chart-2': r['accent-2'],
    'chart-3': r.success,
    'chart-4': r.warning,
    'chart-5': r.danger,
    sidebar: r['surface-2'],
    'sidebar-foreground': r.ink,
    'sidebar-primary': r.accent,
    'sidebar-primary-foreground': r['on-accent'],
    'sidebar-accent': r['accent-soft'],
    'sidebar-accent-foreground': r.ink,
    'sidebar-border': ink ? r.line : r['line-subtle'],
    'sidebar-ring': r.focus,
  } as Record<string, string>
}

const LABELS: Record<string, string> = {
  refraction: 'Refraction',
  tactile: 'Tactile',
  signal: 'Signal',
  folio: 'Folio',
  bloom: 'Bloom',
  hybrid: 'Hybrid',
}

const TAGS: Record<string, string[]> = {
  refraction: ['glass', 'frosted', 'iris', 'calm'],
  tactile: ['brutal', 'ink', 'offset shadow', 'cobalt'],
  signal: ['neumorphic', 'aluminium', 'orange', 'mono'],
  folio: ['flat', 'editorial', 'teal', 'dense'],
  bloom: ['rounded', 'magenta', 'soft glass', 'tonal'],
  hybrid: ['glass', 'ink', 'brutal', 'iris'],
}

const inkMaterials = new Set(['tactile', 'hybrid'])
const shadowKeys = ['xs', 'sm', 'md', 'lg'] as const

const presets = tokens.meta.materials.map((material) => {
  const role = tokens.roles[material]
  if (!role) throw new Error(`Missing roles for ${material}`)
  const ink = inkMaterials.has(material)

  const shadows = (roles: Roles) =>
    Object.fromEntries(
      shadowKeys.map((k) => [k, resolveRoles(byMaterial('shadow', `shadow-${k}`, material), roles)])
    )

  return {
    id: `crystal-neuo-${material}`,
    label: `Crystal Neuo ${LABELS[material] ?? material}`,
    description: role.description,
    tags: ['crystal neuo', material, ...(TAGS[material] ?? [])],
    tokens: {
      light: colors(role.light, ink),
      dark: colors(role.dark, ink),
      radius: stripPlatformScale(byMaterial('radius', 'radius-md', material)),
      fontSans: byMaterial('font', 'font-family-text', material),
      fontHeading: byMaterial('font', 'font-family-display', material),
      fontMono: byMaterial('font', 'font-family-mono', material),
      borderWidth: byMaterial('border', 'border-width-default', material),
      shadows: { light: shadows(role.light), dark: shadows(role.dark) },
      blur: byMaterial('blur', 'blur-glass', material),
    },
  }
})

const out = `/**
 * Crystal Neuo material presets (tokens v${tokens.meta.version}).
 * Generated by scripts/sync-crystal-neuo-presets.ts - do not edit by hand.
 */
import type { CustomThemePreset } from '~/types/config'

export const CRYSTAL_NEUO_PRESETS: CustomThemePreset[] = ${JSON.stringify(presets, null, 2)}
`

writeFileSync(resolve(import.meta.dirname, '../config/crystalNeuoPresets.ts'), out)
console.log(`Wrote ${presets.length} Crystal Neuo presets`)
