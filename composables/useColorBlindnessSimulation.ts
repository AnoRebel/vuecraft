/**
 * Color Blindness Simulation for Vuecraft
 * Simulates how themes appear to users with different types of color vision deficiency
 */

import { ref, computed } from 'vue'
import {
  simulateColorBlindness,
  parseColor,
  rgbToHex,
  type ColorBlindnessType,
} from '~/utils/colorUtils'

export interface ColorBlindnessOption {
  value: ColorBlindnessType
  label: string
  description: string
  prevalence: string
}

export function useColorBlindnessSimulation() {
  const activeSimulation = ref<ColorBlindnessType>('normal')
  const isSimulating = computed(() => activeSimulation.value !== 'normal')

  /**
   * Available color blindness types with information
   */
  const simulationOptions: ColorBlindnessOption[] = [
    {
      value: 'normal',
      label: 'Normal Vision',
      description: 'Standard color vision',
      prevalence: '~92% of population',
    },
    {
      value: 'protanopia',
      label: 'Protanopia',
      description: 'Red-blind, difficulty distinguishing red/green',
      prevalence: '~1% of males',
    },
    {
      value: 'deuteranopia',
      label: 'Deuteranopia',
      description: 'Green-blind, most common color blindness',
      prevalence: '~6% of males',
    },
    {
      value: 'tritanopia',
      label: 'Tritanopia',
      description: 'Blue-blind, difficulty with blue/yellow',
      prevalence: '~0.01% of population',
    },
    {
      value: 'achromatopsia',
      label: 'Achromatopsia',
      description: 'Complete color blindness, sees in grayscale',
      prevalence: '~0.003% of population',
    },
  ]

  /**
   * Set the active simulation type
   */
  function setSimulation(type: ColorBlindnessType): void {
    activeSimulation.value = type
  }

  /**
   * Toggle simulation on/off
   */
  function toggleSimulation(): void {
    if (activeSimulation.value === 'normal') {
      activeSimulation.value = 'deuteranopia' // Most common
    } else {
      activeSimulation.value = 'normal'
    }
  }

  /**
   * Simulate a single color
   */
  function simulateColor(color: string): string | null {
    if (activeSimulation.value === 'normal') return color

    const rgb = parseColor(color)
    if (!rgb) return null

    const simulated = simulateColorBlindness(rgb, activeSimulation.value)
    return rgbToHex(simulated)
  }

  /**
   * Get CSS filter for the simulation
   * This can be applied to the preview container
   */
  function getCSSFilter(): string {
    switch (activeSimulation.value) {
      case 'achromatopsia':
        return 'grayscale(100%)'
      case 'protanopia':
      case 'deuteranopia':
      case 'tritanopia':
        // These need SVG filters for accurate simulation
        return `url(#${activeSimulation.value}-filter)`
      default:
        return 'none'
    }
  }

  /**
   * Get SVG filter definitions for accurate color blindness simulation
   * These should be added to the page once
   */
  function getSVGFilters(): string {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <defs>
          <!-- Protanopia (Red-blind) -->
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="
              0.567, 0.433, 0.000, 0, 0
              0.558, 0.442, 0.000, 0, 0
              0.000, 0.242, 0.758, 0, 0
              0,     0,     0,     1, 0
            "/>
          </filter>

          <!-- Deuteranopia (Green-blind) -->
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="
              0.625, 0.375, 0.000, 0, 0
              0.700, 0.300, 0.000, 0, 0
              0.000, 0.300, 0.700, 0, 0
              0,     0,     0,     1, 0
            "/>
          </filter>

          <!-- Tritanopia (Blue-blind) -->
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="
              0.950, 0.050, 0.000, 0, 0
              0.000, 0.433, 0.567, 0, 0
              0.000, 0.475, 0.525, 0, 0
              0,     0,     0,     1, 0
            "/>
          </filter>
        </defs>
      </svg>
    `
  }

  /**
   * Check if colors are distinguishable under the current simulation
   */
  function areColorsDistinguishable(
    color1: string,
    color2: string,
    threshold: number = 30
  ): boolean {
    const rgb1 = parseColor(color1)
    const rgb2 = parseColor(color2)

    if (!rgb1 || !rgb2) return true

    const sim1 = simulateColorBlindness(rgb1, activeSimulation.value)
    const sim2 = simulateColorBlindness(rgb2, activeSimulation.value)

    // Calculate color distance
    const distance = Math.sqrt(
      Math.pow(sim1.r - sim2.r, 2) + Math.pow(sim1.g - sim2.g, 2) + Math.pow(sim1.b - sim2.b, 2)
    )

    return distance > threshold
  }

  /**
   * Get a warning if important color pairs become indistinguishable
   */
  function checkColorPairVisibility(
    pairs: { name: string; color1: string; color2: string }[]
  ): { name: string; warning: string }[] {
    const warnings: { name: string; warning: string }[] = []

    for (const pair of pairs) {
      if (!areColorsDistinguishable(pair.color1, pair.color2)) {
        warnings.push({
          name: pair.name,
          warning: `Colors may be hard to distinguish for users with ${getSimulationLabel(activeSimulation.value)}`,
        })
      }
    }

    return warnings
  }

  /**
   * Get human-readable label for simulation type
   */
  function getSimulationLabel(type: ColorBlindnessType): string {
    const option = simulationOptions.find((o) => o.value === type)
    return option?.label || type
  }

  return {
    // State
    activeSimulation,
    isSimulating,
    simulationOptions,

    // Actions
    setSimulation,
    toggleSimulation,
    simulateColor,

    // CSS/SVG
    getCSSFilter,
    getSVGFilters,

    // Analysis
    areColorsDistinguishable,
    checkColorPairVisibility,
    getSimulationLabel,
  }
}
