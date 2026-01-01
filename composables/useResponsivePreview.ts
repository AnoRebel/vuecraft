/**
 * Responsive Preview for Vuecraft
 * Preview themes at different device breakpoints
 */

import { ref, computed } from 'vue'

export interface DevicePreset {
  id: string
  name: string
  width: number
  height: number
  icon: string
  category: 'mobile' | 'tablet' | 'desktop'
}

export interface CustomDimensions {
  width: number
  height: number
}

// Shared state (singleton pattern)
const activePreset = ref<string | null>(null)
const customDimensions = ref<CustomDimensions | null>(null)
const isRotated = ref(false)
const zoom = ref(100) // Percentage

const DEVICE_PRESETS: DevicePreset[] = [
  // Mobile
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    width: 375,
    height: 667,
    icon: 'smartphone',
    category: 'mobile',
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    width: 390,
    height: 844,
    icon: 'smartphone',
    category: 'mobile',
  },
  {
    id: 'iphone-14-pro-max',
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    icon: 'smartphone',
    category: 'mobile',
  },
  {
    id: 'pixel-7',
    name: 'Pixel 7',
    width: 412,
    height: 915,
    icon: 'smartphone',
    category: 'mobile',
  },
  {
    id: 'samsung-s23',
    name: 'Samsung S23',
    width: 360,
    height: 780,
    icon: 'smartphone',
    category: 'mobile',
  },

  // Tablet
  {
    id: 'ipad-mini',
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    icon: 'tablet',
    category: 'tablet',
  },
  {
    id: 'ipad-air',
    name: 'iPad Air',
    width: 820,
    height: 1180,
    icon: 'tablet',
    category: 'tablet',
  },
  {
    id: 'ipad-pro-11',
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    icon: 'tablet',
    category: 'tablet',
  },
  {
    id: 'ipad-pro-12',
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    icon: 'tablet',
    category: 'tablet',
  },
  {
    id: 'surface-pro',
    name: 'Surface Pro',
    width: 912,
    height: 1368,
    icon: 'tablet',
    category: 'tablet',
  },

  // Desktop
  { id: 'laptop', name: 'Laptop', width: 1280, height: 800, icon: 'laptop', category: 'desktop' },
  {
    id: 'laptop-lg',
    name: 'Laptop Large',
    width: 1440,
    height: 900,
    icon: 'laptop',
    category: 'desktop',
  },
  {
    id: 'desktop',
    name: 'Desktop',
    width: 1920,
    height: 1080,
    icon: 'monitor',
    category: 'desktop',
  },
  {
    id: 'desktop-lg',
    name: 'Desktop Large',
    width: 2560,
    height: 1440,
    icon: 'monitor',
    category: 'desktop',
  },
]

export function useResponsivePreview() {
  /**
   * Get all available device presets
   */
  const devicePresets = computed(() => DEVICE_PRESETS)

  /**
   * Get presets grouped by category
   */
  const presetsByCategory = computed(() => {
    return {
      mobile: DEVICE_PRESETS.filter((d) => d.category === 'mobile'),
      tablet: DEVICE_PRESETS.filter((d) => d.category === 'tablet'),
      desktop: DEVICE_PRESETS.filter((d) => d.category === 'desktop'),
    }
  })

  /**
   * Currently active device or null for responsive
   */
  const activeDevice = computed(() => {
    if (!activePreset.value) return null
    return DEVICE_PRESETS.find((d) => d.id === activePreset.value) || null
  })

  /**
   * Get current dimensions (respecting rotation)
   */
  const currentDimensions = computed<{ width: number | string; height: number | string }>(() => {
    if (customDimensions.value) {
      return isRotated.value
        ? { width: customDimensions.value.height, height: customDimensions.value.width }
        : customDimensions.value
    }

    if (activeDevice.value) {
      return isRotated.value
        ? { width: activeDevice.value.height, height: activeDevice.value.width }
        : { width: activeDevice.value.width, height: activeDevice.value.height }
    }

    return { width: '100%', height: '100%' }
  })

  /**
   * CSS styles for the preview container
   */
  const previewStyles = computed(() => {
    const dims = currentDimensions.value
    const scale = zoom.value / 100

    return {
      width: typeof dims.width === 'number' ? `${dims.width}px` : dims.width,
      height: typeof dims.height === 'number' ? `${dims.height}px` : dims.height,
      transform: scale !== 1 ? `scale(${scale})` : undefined,
      transformOrigin: 'top center',
    }
  })

  /**
   * Whether preview is in responsive (full) mode
   */
  const isResponsive = computed(() => !activePreset.value && !customDimensions.value)

  /**
   * Set active device preset
   */
  function setPreset(presetId: string | null): void {
    activePreset.value = presetId
    customDimensions.value = null
    isRotated.value = false
  }

  /**
   * Set custom dimensions
   */
  function setCustomDimensions(width: number, height: number): void {
    activePreset.value = null
    customDimensions.value = { width, height }
  }

  /**
   * Toggle rotation (portrait/landscape)
   */
  function toggleRotation(): void {
    isRotated.value = !isRotated.value
  }

  /**
   * Set zoom level
   */
  function setZoom(level: number): void {
    zoom.value = Math.max(25, Math.min(200, level))
  }

  /**
   * Zoom in by step
   */
  function zoomIn(step: number = 10): void {
    setZoom(zoom.value + step)
  }

  /**
   * Zoom out by step
   */
  function zoomOut(step: number = 10): void {
    setZoom(zoom.value - step)
  }

  /**
   * Reset to responsive mode
   */
  function reset(): void {
    activePreset.value = null
    customDimensions.value = null
    isRotated.value = false
    zoom.value = 100
  }

  /**
   * Get Tailwind breakpoint for current width
   */
  function getTailwindBreakpoint(width: number): string {
    if (width < 640) return 'xs'
    if (width < 768) return 'sm'
    if (width < 1024) return 'md'
    if (width < 1280) return 'lg'
    if (width < 1536) return 'xl'
    return '2xl'
  }

  /**
   * Get current Tailwind breakpoint
   */
  const currentBreakpoint = computed(() => {
    const dims = currentDimensions.value
    if (typeof dims.width === 'string') return 'responsive'
    return getTailwindBreakpoint(dims.width)
  })

  /**
   * Quick presets for common sizes
   */
  const quickPresets = [
    { id: 'mobile', name: 'Mobile', width: 375, icon: 'smartphone' },
    { id: 'tablet', name: 'Tablet', width: 768, icon: 'tablet' },
    { id: 'desktop', name: 'Desktop', width: 1280, icon: 'monitor' },
    { id: 'full', name: 'Full', width: null, icon: 'maximize' },
  ]

  /**
   * Set quick preset
   */
  function setQuickPreset(presetId: string): void {
    const preset = quickPresets.find((p) => p.id === presetId)
    if (!preset || !preset.width) {
      reset()
    } else {
      setCustomDimensions(preset.width, 800)
    }
  }

  return {
    // State
    activePreset,
    customDimensions,
    isRotated,
    zoom,
    devicePresets,
    presetsByCategory,
    activeDevice,
    currentDimensions,
    previewStyles,
    isResponsive,
    currentBreakpoint,
    quickPresets,

    // Actions
    setPreset,
    setCustomDimensions,
    toggleRotation,
    setZoom,
    zoomIn,
    zoomOut,
    reset,
    setQuickPreset,
    getTailwindBreakpoint,
  }
}
