/**
 * Animation customizer: timing, easing and entrance effects of the theme.
 *
 * All values live in the design system configuration (components group), so
 * they persist, are shared and undoable, drive the preview and are exported.
 */
import { computed, ref } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { resolveTheme } from '~/utils/themeTokens'
import type { AnimationEffects } from '~/types/config'

export type Bezier = [number, number, number, number]

export interface EasingPreset {
  name: string
  value: string
  bezier: Bezier
  description: string
}

export const EASING_PRESETS: EasingPreset[] = [
  { name: 'Linear', value: 'linear', bezier: [0, 0, 1, 1], description: 'Constant speed' },
  { name: 'Ease', value: 'ease', bezier: [0.25, 0.1, 0.25, 1], description: 'Browser default' },
  { name: 'Ease In', value: 'ease-in', bezier: [0.42, 0, 1, 1], description: 'Slow start' },
  { name: 'Ease Out', value: 'ease-out', bezier: [0, 0, 0.58, 1], description: 'Slow end' },
  {
    name: 'Ease In Out',
    value: 'ease-in-out',
    bezier: [0.42, 0, 0.58, 1],
    description: 'Slow start and end',
  },
  {
    name: 'Smooth',
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bezier: [0.4, 0, 0.2, 1],
    description: 'Material standard',
  },
  {
    name: 'Snappy',
    value: 'cubic-bezier(0.2, 0, 0, 1)',
    bezier: [0.2, 0, 0, 1],
    description: 'Quick and responsive',
  },
  {
    name: 'Bounce',
    value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bezier: [0.68, -0.55, 0.265, 1.55],
    description: 'Playful overshoot',
  },
  {
    name: 'Spring',
    value: 'cubic-bezier(0.5, 1.5, 0.5, 1)',
    bezier: [0.5, 1.5, 0.5, 1],
    description: 'Spring-like settle',
  },
  {
    name: 'Sharp',
    value: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bezier: [0.4, 0, 0.6, 1],
    description: 'Sharp acceleration',
  },
]

export const DURATION_PRESETS = [
  { label: 'Instant', value: 0 },
  { label: 'Fast', value: 100 },
  { label: 'Normal', value: 200 },
  { label: 'Relaxed', value: 300 },
  { label: 'Slow', value: 500 },
  { label: 'Dramatic', value: 800 },
]

const round = (n: number) => Math.round(n * 1000) / 1000

/** Parse a CSS timing function into its bézier control points */
export function parseBezier(easing: string): Bezier | null {
  const preset = EASING_PRESETS.find((p) => p.value === easing)
  if (preset) return preset.bezier
  const m = easing.match(
    /cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/
  )
  return m ? [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])] : null
}

export function bezierToCss([a, b, c, d]: Bezier): string {
  return `cubic-bezier(${round(a)}, ${round(b)}, ${round(c)}, ${round(d)})`
}

/** SVG path of the curve inside a box, with room for overshoot */
export function bezierPath(b: Bezier, size = 100, pad = 30): string {
  const x = (v: number) => round(v * size)
  const y = (v: number) => round(pad + size - v * size)
  return `M 0 ${y(0)} C ${x(b[0])} ${y(b[1])}, ${x(b[2])} ${y(b[3])}, ${size} ${y(1)}`
}

// Bumped to replay the demo animation
const replayKey = ref(0)

export function useAnimationCustomizer() {
  const { config, setComponents } = useDesignSystem()

  const resolved = computed(() => resolveTheme(config))
  const durationMs = computed(() => Number.parseInt(resolved.value.animationDuration, 10) || 0)
  const easing = computed(() => resolved.value.animationEasing)
  const bezier = computed<Bezier>(() => parseBezier(easing.value) ?? [0.25, 0.1, 0.25, 1])
  const currentPreset = computed(() => EASING_PRESETS.find((p) => p.value === easing.value) ?? null)
  const effects = computed<AnimationEffects>(() => ({
    fade: true,
    scale: true,
    slide: true,
    blur: false,
    ...(config.components.animationEffects ?? {}),
  }))
  const reducedMotion = computed(() => !!config.components.reducedMotion)

  function setDuration(ms: number) {
    setComponents({ animationDuration: Math.max(0, Math.min(1000, Math.round(ms))) })
  }

  function setEasingPreset(name: string) {
    const preset = EASING_PRESETS.find((p) => p.name === name)
    if (preset) setComponents({ animationEasing: preset.value })
  }

  function setBezierPoint(index: 0 | 1 | 2 | 3, value: number) {
    const next = [...bezier.value] as Bezier
    // x values must stay within 0..1 for a valid timing function
    next[index] = index % 2 === 0 ? Math.max(0, Math.min(1, value)) : value
    setComponents({ animationEasing: bezierToCss(next) })
  }

  function toggleEffect(effect: keyof AnimationEffects) {
    setComponents({ animationEffects: { ...effects.value, [effect]: !effects.value[effect] } })
  }

  function setReducedMotion(value: boolean) {
    setComponents({ reducedMotion: value })
  }

  function reset() {
    setComponents({
      animationSpeed: 'default',
      animationDuration: null,
      animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      animationEffects: { fade: true, scale: true, slide: true, blur: false },
      reducedMotion: false,
    })
  }

  function replay() {
    replayKey.value++
  }

  /** CSS variables for elements outside the preview (e.g. the demo) */
  const demoStyle = computed(() => {
    const e = resolved.value.enter
    return {
      '--vc-motion-duration': reducedMotion.value ? '0ms' : resolved.value.animationDuration,
      '--vc-motion-easing': easing.value,
      '--vc-enter-opacity': String(e.opacity),
      '--vc-enter-y': e.y,
      '--vc-enter-scale': String(e.scale),
      '--vc-enter-blur': e.blur,
    }
  })

  return {
    durationMs,
    easing,
    bezier,
    currentPreset,
    effects,
    reducedMotion,
    replayKey,
    demoStyle,
    easingPresets: EASING_PRESETS,
    durationPresets: DURATION_PRESETS,
    setDuration,
    setEasingPreset,
    setBezierPoint,
    toggleEffect,
    setReducedMotion,
    replay,
    reset,
  }
}
