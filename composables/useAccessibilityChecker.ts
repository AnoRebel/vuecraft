/**
 * Accessibility Checker for Vuecraft
 * Checks WCAG contrast compliance for theme color combinations
 */

import { computed } from 'vue'
import { useDesignSystem } from './useDesignSystem'
import {
  parseColor,
  getContrastRatio,
  checkContrast,
  suggestAccessibleColor,
  rgbToHex,
  formatOklch,
  rgbToOklch,
  type RgbColor,
  type ContrastResult,
} from '~/utils/colorUtils'

export interface ColorPair {
  name: string
  foreground: string
  background: string
  usage: string
}

export interface AccessibilityIssue {
  pair: ColorPair
  result: ContrastResult
  suggestion?: string
  suggestedColor?: string
}

export interface AccessibilityReport {
  score: number // 0-100
  passCount: number
  failCount: number
  warningCount: number
  issues: AccessibilityIssue[]
  timestamp: number
}

export function useAccessibilityChecker() {
  const { config, getCurrentCSSVariables } = useDesignSystem()

  /**
   * Get the color pairs to check from the current theme
   */
  const colorPairs = computed<ColorPair[]>(() => {
    // These are the critical color pairs that need contrast checking
    return [
      {
        name: 'Primary Text',
        foreground: 'var(--primary-foreground)',
        background: 'var(--primary)',
        usage: 'Primary buttons, badges',
      },
      {
        name: 'Secondary Text',
        foreground: 'var(--secondary-foreground)',
        background: 'var(--secondary)',
        usage: 'Secondary buttons, tags',
      },
      {
        name: 'Body Text',
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        usage: 'Main content text',
      },
      {
        name: 'Muted Text',
        foreground: 'var(--muted-foreground)',
        background: 'var(--muted)',
        usage: 'Placeholder text, hints',
      },
      {
        name: 'Card Text',
        foreground: 'var(--card-foreground)',
        background: 'var(--card)',
        usage: 'Card content',
      },
      {
        name: 'Destructive Text',
        foreground: 'var(--destructive-foreground)',
        background: 'var(--destructive)',
        usage: 'Error buttons, alerts',
      },
      {
        name: 'Accent Text',
        foreground: 'var(--accent-foreground)',
        background: 'var(--accent)',
        usage: 'Hover states, focus rings',
      },
      {
        name: 'Popover Text',
        foreground: 'var(--popover-foreground)',
        background: 'var(--popover)',
        usage: 'Dropdowns, tooltips',
      },
    ]
  })

  /**
   * Resolve CSS variable to actual color value
   */
  function resolveCSSVariable(variable: string): string | null {
    if (typeof window === 'undefined') return null

    // Extract variable name from var(--name)
    const match = variable.match(/var\((--[\w-]+)\)/)
    if (!match) return variable // Already a color value

    const varName = match[1]
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    return value || null
  }

  /**
   * Check a single color pair
   */
  function checkColorPair(pair: ColorPair): AccessibilityIssue | null {
    const fgValue = resolveCSSVariable(pair.foreground)
    const bgValue = resolveCSSVariable(pair.background)

    if (!fgValue || !bgValue) return null

    const fgRgb = parseColor(fgValue)
    const bgRgb = parseColor(bgValue)

    if (!fgRgb || !bgRgb) return null

    const result = checkContrast(fgRgb, bgRgb)

    // Only report issues (not AAA compliant for normal text)
    if (result.level === 'aaa') return null

    // Generate suggestion if failing
    let suggestion: string | undefined
    let suggestedColor: string | undefined

    if (result.level === 'fail' || result.level === 'aa-large') {
      const suggestedRgb = suggestAccessibleColor(fgRgb, bgRgb, 4.5)
      const suggestedOklch = rgbToOklch(suggestedRgb)
      suggestedColor = formatOklch(suggestedOklch)
      suggestion = `Adjust foreground to ${suggestedColor} for AA compliance`
    }

    return {
      pair,
      result,
      suggestion,
      suggestedColor,
    }
  }

  /**
   * Generate full accessibility report
   */
  function generateReport(): AccessibilityReport {
    const issues: AccessibilityIssue[] = []
    let passCount = 0
    let failCount = 0
    let warningCount = 0

    for (const pair of colorPairs.value) {
      const fgValue = resolveCSSVariable(pair.foreground)
      const bgValue = resolveCSSVariable(pair.background)

      if (!fgValue || !bgValue) continue

      const fgRgb = parseColor(fgValue)
      const bgRgb = parseColor(bgValue)

      if (!fgRgb || !bgRgb) continue

      const result = checkContrast(fgRgb, bgRgb)

      if (result.level === 'aaa') {
        passCount++
      } else if (result.level === 'aa') {
        passCount++
        // Still add as a note, but not critical
      } else if (result.level === 'aa-large') {
        warningCount++
        const suggestedRgb = suggestAccessibleColor(fgRgb, bgRgb, 4.5)
        issues.push({
          pair,
          result,
          suggestion: 'Only passes for large text (18pt+ or 14pt bold)',
          suggestedColor: formatOklch(rgbToOklch(suggestedRgb)),
        })
      } else {
        failCount++
        const suggestedRgb = suggestAccessibleColor(fgRgb, bgRgb, 4.5)
        issues.push({
          pair,
          result,
          suggestion: 'Does not meet WCAG AA requirements',
          suggestedColor: formatOklch(rgbToOklch(suggestedRgb)),
        })
      }
    }

    const total = passCount + failCount + warningCount
    const score = total > 0 ? Math.round((passCount / total) * 100) : 100

    return {
      score,
      passCount,
      failCount,
      warningCount,
      issues,
      timestamp: Date.now(),
    }
  }

  /**
   * Get contrast ratio badge color
   */
  function getContrastBadgeClass(level: ContrastResult['level']): string {
    switch (level) {
      case 'aaa':
        return 'bg-green-500/20 text-green-700 dark:text-green-300'
      case 'aa':
        return 'bg-green-500/20 text-green-700 dark:text-green-300'
      case 'aa-large':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
      case 'fail':
        return 'bg-red-500/20 text-red-700 dark:text-red-300'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
    }
  }

  /**
   * Get score color class
   */
  function getScoreClass(score: number): string {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  /**
   * Format contrast ratio for display
   */
  function formatRatio(ratio: number): string {
    return `${ratio.toFixed(2)}:1`
  }

  /**
   * Get WCAG level label
   */
  function getLevelLabel(level: ContrastResult['level']): string {
    switch (level) {
      case 'aaa':
        return 'AAA'
      case 'aa':
        return 'AA'
      case 'aa-large':
        return 'AA Large'
      case 'fail':
        return 'Fail'
      default:
        return 'Unknown'
    }
  }

  return {
    colorPairs,
    checkColorPair,
    generateReport,
    getContrastBadgeClass,
    getScoreClass,
    formatRatio,
    getLevelLabel,
    resolveCSSVariable,
  }
}
