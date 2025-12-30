/**
 * Color Palette Generator for Vuecraft
 * Generates harmonious color palettes based on color theory
 */

import { ref } from 'vue'
import {
  parseOklch,
  formatOklch,
  oklchToRgb,
  rgbToHex,
  generatePalette,
  generateShades,
  generateTints,
  type OklchColor,
  type HarmonyType,
} from '~/utils/colorUtils'

export interface PaletteColor {
  oklch: OklchColor
  hex: string
  cssValue: string
}

export interface GeneratedPalette {
  name: string
  colors: PaletteColor[]
  harmony: HarmonyType
}

export function useColorPaletteGenerator() {
  const baseColor = ref<OklchColor | null>(null)
  const selectedHarmony = ref<HarmonyType>('complementary')
  const currentPalette = ref<GeneratedPalette | null>(null)

  /**
   * Available harmony types with descriptions
   */
  const harmonyTypes: { value: HarmonyType; label: string; description: string }[] = [
    {
      value: 'complementary',
      label: 'Complementary',
      description: 'Two colors opposite on the color wheel',
    },
    {
      value: 'analogous',
      label: 'Analogous',
      description: 'Three colors next to each other',
    },
    {
      value: 'triadic',
      label: 'Triadic',
      description: 'Three colors evenly spaced (120°)',
    },
    {
      value: 'split-complementary',
      label: 'Split Complementary',
      description: 'Base color plus two adjacent to complement',
    },
    {
      value: 'tetradic',
      label: 'Tetradic',
      description: 'Four colors in a square (90°)',
    },
    {
      value: 'monochromatic',
      label: 'Monochromatic',
      description: 'Variations of a single hue',
    },
  ]

  /**
   * Set the base color from various formats
   */
  function setBaseColor(color: string | OklchColor): void {
    if (typeof color === 'string') {
      const parsed = parseOklch(color)
      if (parsed) {
        baseColor.value = parsed
      }
    } else {
      baseColor.value = color
    }
  }

  /**
   * Generate a palette based on current settings
   */
  function generate(): GeneratedPalette | null {
    if (!baseColor.value) return null

    const oklchColors = generatePalette(baseColor.value, selectedHarmony.value)

    const colors: PaletteColor[] = oklchColors.map((oklch) => ({
      oklch,
      hex: rgbToHex(oklchToRgb(oklch)),
      cssValue: formatOklch(oklch),
    }))

    currentPalette.value = {
      name: `${selectedHarmony.value} palette`,
      colors,
      harmony: selectedHarmony.value,
    }

    return currentPalette.value
  }

  /**
   * Generate shades (darker versions) of a color
   */
  function generateColorShades(color: OklchColor, count: number = 5): PaletteColor[] {
    const shades = generateShades(color, count)
    return shades.map((oklch) => ({
      oklch,
      hex: rgbToHex(oklchToRgb(oklch)),
      cssValue: formatOklch(oklch),
    }))
  }

  /**
   * Generate tints (lighter versions) of a color
   */
  function generateColorTints(color: OklchColor, count: number = 5): PaletteColor[] {
    const tints = generateTints(color, count)
    return tints.map((oklch) => ({
      oklch,
      hex: rgbToHex(oklchToRgb(oklch)),
      cssValue: formatOklch(oklch),
    }))
  }

  /**
   * Generate a full color scale (tints + base + shades)
   */
  function generateColorScale(color: OklchColor, steps: number = 9): PaletteColor[] {
    const scale: PaletteColor[] = []
    const halfSteps = Math.floor(steps / 2)

    // Generate tints (lighter, going up)
    for (let i = halfSteps; i > 0; i--) {
      const ratio = i / halfSteps
      const l = color.l + (1 - color.l) * ratio * 0.8
      const c = color.c * (1 - ratio * 0.3)
      const oklch: OklchColor = { l, c, h: color.h }
      scale.push({
        oklch,
        hex: rgbToHex(oklchToRgb(oklch)),
        cssValue: formatOklch(oklch),
      })
    }

    // Add base color
    scale.push({
      oklch: color,
      hex: rgbToHex(oklchToRgb(color)),
      cssValue: formatOklch(color),
    })

    // Generate shades (darker, going down)
    for (let i = 1; i <= halfSteps; i++) {
      const ratio = i / halfSteps
      const l = color.l * (1 - ratio * 0.8)
      const c = color.c * (1 - ratio * 0.2)
      const oklch: OklchColor = { l, c, h: color.h }
      scale.push({
        oklch,
        hex: rgbToHex(oklchToRgb(oklch)),
        cssValue: formatOklch(oklch),
      })
    }

    return scale
  }

  /**
   * Get CSS custom properties for a palette
   */
  function getPaletteCSS(palette: GeneratedPalette, prefix: string = 'palette'): string {
    return palette.colors
      .map((color, index) => `  --${prefix}-${index + 1}: ${color.cssValue};`)
      .join('\n')
  }

  /**
   * Generate random base color
   */
  function randomize(): void {
    baseColor.value = {
      l: 0.5 + Math.random() * 0.3,
      c: 0.1 + Math.random() * 0.15,
      h: Math.random() * 360,
    }
  }

  /**
   * Adjust lightness while keeping within valid range
   */
  function adjustLightness(color: OklchColor, amount: number): OklchColor {
    return {
      ...color,
      l: Math.max(0, Math.min(1, color.l + amount)),
    }
  }

  /**
   * Adjust chroma while keeping within valid range
   */
  function adjustChroma(color: OklchColor, amount: number): OklchColor {
    return {
      ...color,
      c: Math.max(0, Math.min(0.4, color.c + amount)),
    }
  }

  /**
   * Rotate hue
   */
  function rotateHue(color: OklchColor, degrees: number): OklchColor {
    return {
      ...color,
      h: (color.h + degrees + 360) % 360,
    }
  }

  return {
    // State
    baseColor,
    selectedHarmony,
    currentPalette,
    harmonyTypes,

    // Actions
    setBaseColor,
    generate,
    generateColorShades,
    generateColorTints,
    generateColorScale,
    randomize,

    // Utilities
    getPaletteCSS,
    adjustLightness,
    adjustChroma,
    rotateHue,
  }
}
