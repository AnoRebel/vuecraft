/**
 * Animation Customizer for Vuecraft
 * Customize transition timing, easing, and animation effects
 */

import { ref, computed, watch } from 'vue'

export interface EasingPreset {
  name: string
  value: string
  cubicBezier?: [number, number, number, number]
  description: string
}

export interface AnimationConfig {
  duration: number // ms
  easing: string
  customBezier?: [number, number, number, number]
  enabledTransitions: {
    fade: boolean
    scale: boolean
    slide: boolean
    blur: boolean
  }
  reducedMotion: boolean
}

export interface AnimationPreview {
  isPlaying: boolean
  currentAnimation: string | null
}

const EASING_PRESETS: EasingPreset[] = [
  { name: 'Linear', value: 'linear', description: 'Constant speed' },
  { name: 'Ease', value: 'ease', description: 'Default browser easing' },
  { name: 'Ease In', value: 'ease-in', cubicBezier: [0.42, 0, 1, 1], description: 'Slow start' },
  { name: 'Ease Out', value: 'ease-out', cubicBezier: [0, 0, 0.58, 1], description: 'Slow end' },
  { name: 'Ease In Out', value: 'ease-in-out', cubicBezier: [0.42, 0, 0.58, 1], description: 'Slow start and end' },
  { name: 'Smooth', value: 'cubic-bezier(0.4, 0, 0.2, 1)', cubicBezier: [0.4, 0, 0.2, 1], description: 'Material Design standard' },
  { name: 'Snappy', value: 'cubic-bezier(0.2, 0, 0, 1)', cubicBezier: [0.2, 0, 0, 1], description: 'Quick and responsive' },
  { name: 'Bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', cubicBezier: [0.68, -0.55, 0.265, 1.55], description: 'Playful bounce effect' },
  { name: 'Spring', value: 'cubic-bezier(0.5, 1.5, 0.5, 1)', cubicBezier: [0.5, 1.5, 0.5, 1], description: 'Spring-like motion' },
  { name: 'Sharp', value: 'cubic-bezier(0.4, 0, 0.6, 1)', cubicBezier: [0.4, 0, 0.6, 1], description: 'Sharp acceleration' },
]

const DURATION_PRESETS = [
  { label: 'Instant', value: 0, description: 'No animation' },
  { label: 'Fast', value: 100, description: 'Quick interactions' },
  { label: 'Normal', value: 200, description: 'Standard transitions' },
  { label: 'Relaxed', value: 300, description: 'Comfortable pace' },
  { label: 'Slow', value: 500, description: 'Deliberate motion' },
  { label: 'Very Slow', value: 800, description: 'Dramatic effect' },
]

export function useAnimationCustomizer() {
  const config = ref<AnimationConfig>({
    duration: 200,
    easing: 'ease',
    customBezier: undefined,
    enabledTransitions: {
      fade: true,
      scale: true,
      slide: true,
      blur: false,
    },
    reducedMotion: false,
  })

  const preview = ref<AnimationPreview>({
    isPlaying: false,
    currentAnimation: null,
  })

  const easingPresets = computed(() => EASING_PRESETS)
  const durationPresets = computed(() => DURATION_PRESETS)

  /**
   * Current easing preset (if matching)
   */
  const currentEasingPreset = computed(() => {
    return EASING_PRESETS.find((p) => p.value === config.value.easing) || null
  })

  /**
   * Is using custom bezier curve
   */
  const isCustomEasing = computed(() => {
    return config.value.customBezier !== undefined
  })

  /**
   * Set duration
   */
  function setDuration(ms: number): void {
    config.value.duration = Math.max(0, Math.min(2000, ms))
  }

  /**
   * Set easing from preset
   */
  function setEasingPreset(presetName: string): void {
    const preset = EASING_PRESETS.find((p) => p.name === presetName)
    if (preset) {
      config.value.easing = preset.value
      config.value.customBezier = preset.cubicBezier
    }
  }

  /**
   * Set custom bezier curve
   */
  function setCustomBezier(p1x: number, p1y: number, p2x: number, p2y: number): void {
    config.value.customBezier = [p1x, p1y, p2x, p2y]
    config.value.easing = `cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y})`
  }

  /**
   * Toggle a transition type
   */
  function toggleTransition(type: keyof AnimationConfig['enabledTransitions']): void {
    config.value.enabledTransitions[type] = !config.value.enabledTransitions[type]
  }

  /**
   * Toggle reduced motion mode
   */
  function toggleReducedMotion(): void {
    config.value.reducedMotion = !config.value.reducedMotion
  }

  /**
   * Play preview animation
   */
  function playPreview(animationType: string): void {
    preview.value = {
      isPlaying: true,
      currentAnimation: animationType,
    }

    // Auto-stop after animation completes
    setTimeout(() => {
      preview.value.isPlaying = false
      preview.value.currentAnimation = null
    }, config.value.duration + 100)
  }

  /**
   * Stop preview animation
   */
  function stopPreview(): void {
    preview.value = {
      isPlaying: false,
      currentAnimation: null,
    }
  }

  /**
   * Get CSS transition property value
   */
  const transitionCSS = computed(() => {
    if (config.value.reducedMotion || config.value.duration === 0) {
      return 'none'
    }

    const properties: string[] = []

    if (config.value.enabledTransitions.fade) {
      properties.push('opacity')
    }
    if (config.value.enabledTransitions.scale) {
      properties.push('transform')
    }
    if (config.value.enabledTransitions.slide) {
      properties.push('transform')
    }
    if (config.value.enabledTransitions.blur) {
      properties.push('filter')
    }

    // Deduplicate and join
    const uniqueProps = [...new Set(properties)]
    if (uniqueProps.length === 0) return 'none'

    return uniqueProps.map((prop) => `${prop} ${config.value.duration}ms ${config.value.easing}`).join(', ')
  })

  /**
   * Get CSS custom properties for the animation config
   */
  const cssVariables = computed(() => {
    return {
      '--animation-duration': `${config.value.duration}ms`,
      '--animation-easing': config.value.easing,
      '--animation-timing': config.value.easing,
    }
  })

  /**
   * Generate CSS for animations
   */
  function generateAnimationCSS(): string {
    const duration = config.value.duration
    const easing = config.value.easing

    return `/* Animation Configuration - Generated by Vuecraft */
:root {
  --animation-duration: ${duration}ms;
  --animation-easing: ${easing};
}

/* Base transition */
.transition-theme {
  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter;
  transition-timing-function: var(--animation-easing);
  transition-duration: var(--animation-duration);
}

/* Fade animation */
.animate-fade-in {
  animation: fadeIn var(--animation-duration) var(--animation-easing);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale animation */
.animate-scale-in {
  animation: scaleIn var(--animation-duration) var(--animation-easing);
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Slide animation */
.animate-slide-in {
  animation: slideIn var(--animation-duration) var(--animation-easing);
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Blur animation */
.animate-blur-in {
  animation: blurIn var(--animation-duration) var(--animation-easing);
}

@keyframes blurIn {
  from { filter: blur(4px); opacity: 0; }
  to { filter: blur(0); opacity: 1; }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --animation-duration: 0ms;
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`
  }

  /**
   * Reset to defaults
   */
  function reset(): void {
    config.value = {
      duration: 200,
      easing: 'ease',
      customBezier: undefined,
      enabledTransitions: {
        fade: true,
        scale: true,
        slide: true,
        blur: false,
      },
      reducedMotion: false,
    }
  }

  /**
   * Get bezier curve path for SVG visualization
   */
  function getBezierPath(width: number = 100, height: number = 100): string {
    const bezier = config.value.customBezier || [0.42, 0, 0.58, 1] // default ease-in-out

    const [p1x, p1y, p2x, p2y] = bezier

    // Convert to SVG coordinates (flip Y axis)
    const x1 = p1x * width
    const y1 = height - p1y * height
    const x2 = p2x * width
    const y2 = height - p2y * height

    return `M 0 ${height} C ${x1} ${y1}, ${x2} ${y2}, ${width} 0`
  }

  return {
    // State
    config,
    preview,
    easingPresets,
    durationPresets,
    currentEasingPreset,
    isCustomEasing,
    transitionCSS,
    cssVariables,

    // Actions
    setDuration,
    setEasingPreset,
    setCustomBezier,
    toggleTransition,
    toggleReducedMotion,
    playPreview,
    stopPreview,
    reset,

    // Generation
    generateAnimationCSS,
    getBezierPath,
  }
}
