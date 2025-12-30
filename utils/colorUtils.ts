/**
 * Color Utilities for Vuecraft
 * Provides OKLCH, RGB, HEX conversions, contrast calculations,
 * color harmony generation, and color blindness simulation
 */

// ============================================================================
// Types
// ============================================================================

export interface OklchColor {
  l: number // Lightness: 0-1
  c: number // Chroma: 0-0.4+
  h: number // Hue: 0-360
}

export interface RgbColor {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

export interface HslColor {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

export type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic'

export interface ContrastResult {
  ratio: number
  wcagAA: boolean
  wcagAALarge: boolean
  wcagAAA: boolean
  wcagAAALarge: boolean
  level: 'fail' | 'aa-large' | 'aa' | 'aaa'
}

// ============================================================================
// OKLCH Parsing and Conversion
// ============================================================================

/**
 * Parse an OKLCH color string to its components
 */
export function parseOklch(color: string): OklchColor | null {
  // Match oklch(0.5 0.2 180) or oklch(50% 0.2 180deg)
  const match = color.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?))?\s*\)/i)
  if (!match) return null

  let l = parseFloat(match[1])
  if (match[1].includes('%')) l /= 100

  const c = parseFloat(match[2])
  const h = parseFloat(match[3])

  return { l, c, h }
}

/**
 * Convert OKLCH to linear sRGB (intermediate step)
 */
function oklchToOklab(oklch: OklchColor): { L: number; a: number; b: number } {
  const { l, c, h } = oklch
  const hRad = (h * Math.PI) / 180
  return {
    L: l,
    a: c * Math.cos(hRad),
    b: c * Math.sin(hRad),
  }
}

/**
 * Convert Oklab to linear RGB
 */
function oklabToLinearRgb(oklab: { L: number; a: number; b: number }): { r: number; g: number; b: number } {
  const { L, a, b } = oklab

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  }
}

/**
 * Convert linear RGB to sRGB
 */
function linearToSrgb(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value
  }
  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055
}

/**
 * Convert sRGB to linear RGB
 */
function srgbToLinear(value: number): number {
  if (value <= 0.04045) {
    return value / 12.92
  }
  return Math.pow((value + 0.055) / 1.055, 2.4)
}

/**
 * Convert OKLCH to RGB (0-255)
 */
export function oklchToRgb(oklch: OklchColor): RgbColor {
  const oklab = oklchToOklab(oklch)
  const linear = oklabToLinearRgb(oklab)

  return {
    r: Math.round(Math.max(0, Math.min(1, linearToSrgb(linear.r))) * 255),
    g: Math.round(Math.max(0, Math.min(1, linearToSrgb(linear.g))) * 255),
    b: Math.round(Math.max(0, Math.min(1, linearToSrgb(linear.b))) * 255),
  }
}

/**
 * Convert RGB to OKLCH
 */
export function rgbToOklch(rgb: RgbColor): OklchColor {
  const r = srgbToLinear(rgb.r / 255)
  const g = srgbToLinear(rgb.g / 255)
  const b = srgbToLinear(rgb.b / 255)

  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const c = Math.sqrt(a * a + bVal * bVal)
  let h = (Math.atan2(bVal, a) * 180) / Math.PI
  if (h < 0) h += 360

  return { l: L, c, h }
}

// ============================================================================
// HEX Conversion
// ============================================================================

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): RgbColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(rgb: RgbColor): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Convert OKLCH string to HEX
 */
export function oklchToHex(oklchString: string): string | null {
  const oklch = parseOklch(oklchString)
  if (!oklch) return null
  return rgbToHex(oklchToRgb(oklch))
}

/**
 * Convert HEX to OKLCH string
 */
export function hexToOklch(hex: string): string | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const oklch = rgbToOklch(rgb)
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`
}

// ============================================================================
// Contrast & Accessibility
// ============================================================================

/**
 * Calculate relative luminance of an RGB color
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(rgb: RgbColor): number {
  const rsRGB = rgb.r / 255
  const gsRGB = rgb.g / 255
  const bsRGB = rgb.b / 255

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(color1: RgbColor, color2: RgbColor): number {
  const l1 = getRelativeLuminance(color1)
  const l2 = getRelativeLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check WCAG contrast compliance
 */
export function checkContrast(foreground: RgbColor, background: RgbColor): ContrastResult {
  const ratio = getContrastRatio(foreground, background)

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAALarge: ratio >= 3,
    wcagAAA: ratio >= 7,
    wcagAAALarge: ratio >= 4.5,
    level: ratio >= 7 ? 'aaa' : ratio >= 4.5 ? 'aa' : ratio >= 3 ? 'aa-large' : 'fail',
  }
}

/**
 * Parse any color format and return RGB
 */
export function parseColor(color: string): RgbColor | null {
  // Try OKLCH
  const oklch = parseOklch(color)
  if (oklch) return oklchToRgb(oklch)

  // Try HEX
  const hex = hexToRgb(color)
  if (hex) return hex

  // Try rgb()
  const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)\s*\)/i)
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    }
  }

  return null
}

/**
 * Suggest a more accessible color alternative
 */
export function suggestAccessibleColor(
  foreground: RgbColor,
  background: RgbColor,
  targetRatio: number = 4.5
): RgbColor {
  const oklch = rgbToOklch(foreground)
  const bgLuminance = getRelativeLuminance(background)

  // Determine if we need to go lighter or darker
  const shouldDarken = bgLuminance > 0.5

  // Binary search for accessible lightness
  let minL = shouldDarken ? 0 : oklch.l
  let maxL = shouldDarken ? oklch.l : 1
  let bestColor = foreground

  for (let i = 0; i < 20; i++) {
    const midL = (minL + maxL) / 2
    const testOklch = { ...oklch, l: midL }
    const testRgb = oklchToRgb(testOklch)
    const ratio = getContrastRatio(testRgb, background)

    if (ratio >= targetRatio) {
      bestColor = testRgb
      if (shouldDarken) {
        minL = midL
      } else {
        maxL = midL
      }
    } else {
      if (shouldDarken) {
        maxL = midL
      } else {
        minL = midL
      }
    }
  }

  return bestColor
}

// ============================================================================
// Color Harmony Generation
// ============================================================================

/**
 * Generate complementary color (opposite on color wheel)
 */
export function generateComplementary(hue: number): number {
  return (hue + 180) % 360
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function generateAnalogous(hue: number, spread: number = 30): number[] {
  return [(hue - spread + 360) % 360, hue, (hue + spread) % 360]
}

/**
 * Generate triadic colors (evenly spaced, 120° apart)
 */
export function generateTriadic(hue: number): number[] {
  return [hue, (hue + 120) % 360, (hue + 240) % 360]
}

/**
 * Generate split-complementary colors
 */
export function generateSplitComplementary(hue: number, spread: number = 30): number[] {
  const complement = (hue + 180) % 360
  return [hue, (complement - spread + 360) % 360, (complement + spread) % 360]
}

/**
 * Generate tetradic/square colors (90° apart)
 */
export function generateTetradic(hue: number): number[] {
  return [hue, (hue + 90) % 360, (hue + 180) % 360, (hue + 270) % 360]
}

/**
 * Generate monochromatic variations
 */
export function generateMonochromatic(oklch: OklchColor, count: number = 5): OklchColor[] {
  const colors: OklchColor[] = []
  const step = 0.8 / (count - 1)

  for (let i = 0; i < count; i++) {
    colors.push({
      l: 0.1 + step * i,
      c: oklch.c,
      h: oklch.h,
    })
  }

  return colors
}

/**
 * Generate a full color palette based on harmony type
 */
export function generatePalette(baseOklch: OklchColor, harmony: HarmonyType): OklchColor[] {
  switch (harmony) {
    case 'complementary':
      return [baseOklch, { ...baseOklch, h: generateComplementary(baseOklch.h) }]

    case 'analogous':
      return generateAnalogous(baseOklch.h).map((h) => ({ ...baseOklch, h }))

    case 'triadic':
      return generateTriadic(baseOklch.h).map((h) => ({ ...baseOklch, h }))

    case 'split-complementary':
      return generateSplitComplementary(baseOklch.h).map((h) => ({ ...baseOklch, h }))

    case 'tetradic':
      return generateTetradic(baseOklch.h).map((h) => ({ ...baseOklch, h }))

    case 'monochromatic':
      return generateMonochromatic(baseOklch)

    default:
      return [baseOklch]
  }
}

/**
 * Generate shade variations (darker versions)
 */
export function generateShades(oklch: OklchColor, count: number = 5): OklchColor[] {
  const colors: OklchColor[] = []
  const step = oklch.l / count

  for (let i = 0; i < count; i++) {
    colors.push({
      l: oklch.l - step * i,
      c: oklch.c * (1 - i * 0.1), // Slightly reduce chroma for darker shades
      h: oklch.h,
    })
  }

  return colors
}

/**
 * Generate tint variations (lighter versions)
 */
export function generateTints(oklch: OklchColor, count: number = 5): OklchColor[] {
  const colors: OklchColor[] = []
  const step = (1 - oklch.l) / count

  for (let i = 0; i < count; i++) {
    colors.push({
      l: oklch.l + step * i,
      c: oklch.c * (1 - i * 0.15), // Reduce chroma for lighter tints
      h: oklch.h,
    })
  }

  return colors
}

// ============================================================================
// Color Blindness Simulation
// ============================================================================

// Transformation matrices for color blindness simulation
// Based on Brettel, Viénot, and Mollon (1997)
const COLORBLIND_MATRICES: Record<ColorBlindnessType, number[][] | null> = {
  normal: null,
  protanopia: [
    [0.567, 0.433, 0.0],
    [0.558, 0.442, 0.0],
    [0.0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.433, 0.567],
    [0.0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
}

/**
 * Simulate how a color appears to someone with color blindness
 */
export function simulateColorBlindness(rgb: RgbColor, type: ColorBlindnessType): RgbColor {
  if (type === 'normal') return rgb

  const matrix = COLORBLIND_MATRICES[type]
  if (!matrix) return rgb

  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  return {
    r: Math.round(Math.min(255, Math.max(0, (matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b) * 255))),
    g: Math.round(Math.min(255, Math.max(0, (matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b) * 255))),
    b: Math.round(Math.min(255, Math.max(0, (matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b) * 255))),
  }
}

/**
 * Get CSS filter for color blindness simulation
 * This can be applied to preview containers
 */
export function getColorBlindnessFilter(type: ColorBlindnessType): string {
  switch (type) {
    case 'protanopia':
      return 'url(#protanopia-filter)'
    case 'deuteranopia':
      return 'url(#deuteranopia-filter)'
    case 'tritanopia':
      return 'url(#tritanopia-filter)'
    case 'achromatopsia':
      return 'grayscale(100%)'
    default:
      return 'none'
  }
}

// ============================================================================
// Image Color Extraction
// ============================================================================

/**
 * Extract dominant colors from an image using k-means clustering
 */
export async function extractColorsFromImage(file: File, colorCount: number = 5): Promise<RgbColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      // Downsample for performance
      const maxSize = 100
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      // Collect all pixels as RGB
      const colors: RgbColor[] = []
      for (let i = 0; i < pixels.length; i += 4) {
        // Skip transparent pixels
        if (pixels[i + 3] < 128) continue
        colors.push({
          r: pixels[i],
          g: pixels[i + 1],
          b: pixels[i + 2],
        })
      }

      // Simple k-means clustering
      const dominantColors = kMeansClustering(colors, colorCount)
      resolve(dominantColors)
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Simple k-means clustering for color extraction
 */
function kMeansClustering(colors: RgbColor[], k: number, iterations: number = 10): RgbColor[] {
  if (colors.length === 0) return []
  if (colors.length <= k) return colors

  // Initialize centroids randomly
  let centroids: RgbColor[] = []
  const step = Math.floor(colors.length / k)
  for (let i = 0; i < k; i++) {
    centroids.push({ ...colors[i * step] })
  }

  for (let iter = 0; iter < iterations; iter++) {
    // Assign colors to nearest centroid
    const clusters: RgbColor[][] = Array.from({ length: k }, () => [])

    for (const color of colors) {
      let minDist = Infinity
      let closest = 0

      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(color, centroids[i])
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      }

      clusters[closest].push(color)
    }

    // Update centroids
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return { r: 128, g: 128, b: 128 }
      return {
        r: Math.round(cluster.reduce((sum, c) => sum + c.r, 0) / cluster.length),
        g: Math.round(cluster.reduce((sum, c) => sum + c.g, 0) / cluster.length),
        b: Math.round(cluster.reduce((sum, c) => sum + c.b, 0) / cluster.length),
      }
    })
  }

  // Sort by brightness (most vibrant/saturated first)
  return centroids.sort((a, b) => {
    const satA = Math.max(a.r, a.g, a.b) - Math.min(a.r, a.g, a.b)
    const satB = Math.max(b.r, b.g, b.b) - Math.min(b.r, b.g, b.b)
    return satB - satA
  })
}

/**
 * Calculate distance between two colors in RGB space
 */
function colorDistance(c1: RgbColor, c2: RgbColor): number {
  return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2))
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format OKLCH values to a CSS string
 */
export function formatOklch(oklch: OklchColor): string {
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`
}

/**
 * Format RGB values to a CSS string
 */
export function formatRgb(rgb: RgbColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

/**
 * Check if a color is light or dark
 */
export function isLightColor(rgb: RgbColor): boolean {
  return getRelativeLuminance(rgb) > 0.5
}

/**
 * Get a contrasting text color (black or white)
 */
export function getContrastingTextColor(background: RgbColor): RgbColor {
  return isLightColor(background) ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 }
}

/**
 * Mix two colors
 */
export function mixColors(color1: RgbColor, color2: RgbColor, ratio: number = 0.5): RgbColor {
  return {
    r: Math.round(color1.r * (1 - ratio) + color2.r * ratio),
    g: Math.round(color1.g * (1 - ratio) + color2.g * ratio),
    b: Math.round(color1.b * (1 - ratio) + color2.b * ratio),
  }
}
