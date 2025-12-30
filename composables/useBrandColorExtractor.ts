/**
 * Brand Color Extractor for Vuecraft
 * Extracts dominant colors from uploaded images (logos, brand assets)
 */

import { ref } from 'vue'
import {
  extractColorsFromImage,
  rgbToOklch,
  rgbToHex,
  formatOklch,
  getContrastRatio,
  isLightColor,
  type RgbColor,
  type OklchColor,
} from '~/utils/colorUtils'

export interface ExtractedColor {
  rgb: RgbColor
  oklch: OklchColor
  hex: string
  cssValue: string
  prominence: number // 0-1, how dominant this color is
}

export interface BrandColorResult {
  colors: ExtractedColor[]
  suggestedPrimary: ExtractedColor | null
  suggestedAccent: ExtractedColor | null
  suggestedBackground: ExtractedColor | null
  fileName: string
  timestamp: number
}

export function useBrandColorExtractor() {
  const isExtracting = ref(false)
  const lastResult = ref<BrandColorResult | null>(null)
  const error = ref<string | null>(null)

  /**
   * Extract colors from an uploaded image file
   */
  async function extractFromFile(file: File, colorCount: number = 6): Promise<BrandColorResult> {
    isExtracting.value = true
    error.value = null

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file (PNG, JPG, SVG, etc.)')
      }

      // Extract colors
      const rgbColors = await extractColorsFromImage(file, colorCount)

      // Convert to our format with metadata
      const colors: ExtractedColor[] = rgbColors.map((rgb, index) => {
        const oklch = rgbToOklch(rgb)
        return {
          rgb,
          oklch,
          hex: rgbToHex(rgb),
          cssValue: formatOklch(oklch),
          prominence: 1 - index / colorCount, // First color is most prominent
        }
      })

      // Analyze and suggest theme colors
      const suggestions = suggestThemeColors(colors)

      const result: BrandColorResult = {
        colors,
        suggestedPrimary: suggestions.primary,
        suggestedAccent: suggestions.accent,
        suggestedBackground: suggestions.background,
        fileName: file.name,
        timestamp: Date.now(),
      }

      lastResult.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to extract colors'
      throw err
    } finally {
      isExtracting.value = false
    }
  }

  /**
   * Analyze extracted colors and suggest theme assignments
   */
  function suggestThemeColors(colors: ExtractedColor[]): {
    primary: ExtractedColor | null
    accent: ExtractedColor | null
    background: ExtractedColor | null
  } {
    if (colors.length === 0) {
      return { primary: null, accent: null, background: null }
    }

    // Sort by saturation (chroma) for finding vibrant colors
    const bySaturation = [...colors].sort((a, b) => b.oklch.c - a.oklch.c)

    // Sort by lightness for finding background candidates
    const byLightness = [...colors].sort((a, b) => b.oklch.l - a.oklch.l)

    // Primary: Most saturated color with good contrast potential
    const primary = bySaturation[0] || null

    // Accent: Second most saturated, different hue from primary
    let accent: ExtractedColor | null = null
    for (const color of bySaturation.slice(1)) {
      if (primary && Math.abs(color.oklch.h - primary.oklch.h) > 30) {
        accent = color
        break
      }
    }
    if (!accent && bySaturation.length > 1) {
      accent = bySaturation[1]
    }

    // Background: Lightest color if it's actually light, or darkest if dark theme
    const lightest = byLightness[0]
    const darkest = byLightness[byLightness.length - 1]

    // Prefer a light background if available
    let background: ExtractedColor | null = null
    if (lightest && lightest.oklch.l > 0.85) {
      background = lightest
    } else if (darkest && darkest.oklch.l < 0.2) {
      background = darkest
    }

    return { primary, accent, background }
  }

  /**
   * Generate a complete theme suggestion from extracted colors
   */
  function generateThemeSuggestion(result: BrandColorResult): {
    accentTheme: string
    baseColor: string
    isDark: boolean
  } | null {
    if (!result.suggestedPrimary) return null

    // Determine if this should be a dark theme based on background
    const isDark = result.suggestedBackground ? result.suggestedBackground.oklch.l < 0.5 : false

    // Map primary color to closest accent theme
    // This is simplified - in practice you'd match to your theme palette
    const hue = result.suggestedPrimary.oklch.h

    let accentTheme = 'neutral'
    if (hue >= 0 && hue < 30) accentTheme = 'red'
    else if (hue >= 30 && hue < 60) accentTheme = 'orange'
    else if (hue >= 60 && hue < 90) accentTheme = 'yellow'
    else if (hue >= 90 && hue < 150) accentTheme = 'green'
    else if (hue >= 150 && hue < 210) accentTheme = 'cyan'
    else if (hue >= 210 && hue < 270) accentTheme = 'blue'
    else if (hue >= 270 && hue < 330) accentTheme = 'violet'
    else accentTheme = 'pink'

    return {
      accentTheme,
      baseColor: isDark ? 'slate' : 'neutral',
      isDark,
    }
  }

  /**
   * Create a color palette preview from extracted colors
   */
  function getPreviewPalette(colors: ExtractedColor[]): string[] {
    return colors.map((c) => c.hex)
  }

  /**
   * Clear the last result
   */
  function clear(): void {
    lastResult.value = null
    error.value = null
  }

  /**
   * Get CSS variables for extracted colors
   */
  function getExtractedColorsCSS(colors: ExtractedColor[], prefix: string = 'brand'): string {
    return colors.map((color, index) => `  --${prefix}-${index + 1}: ${color.cssValue};`).join('\n')
  }

  return {
    // State
    isExtracting,
    lastResult,
    error,

    // Actions
    extractFromFile,
    generateThemeSuggestion,
    clear,

    // Utilities
    getPreviewPalette,
    getExtractedColorsCSS,
    suggestThemeColors,
  }
}
