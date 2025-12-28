type ColorMode = 'light' | 'dark' | 'system'

const colorMode = ref<ColorMode>('system')
const resolvedMode = ref<'light' | 'dark'>('light')

// Initialize color mode from localStorage and system preference
function initColorMode() {
  if (import.meta.client) {
    // Check localStorage first
    const stored = localStorage.getItem('color-mode') as ColorMode | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      colorMode.value = stored
    }

    // Resolve actual mode
    updateResolvedMode()

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateResolvedMode)
  }
}

// Update the resolved mode based on current setting
function updateResolvedMode() {
  if (colorMode.value === 'system') {
    resolvedMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } else {
    resolvedMode.value = colorMode.value
  }

  // Apply to document
  if (resolvedMode.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Set color mode
function setColorMode(mode: ColorMode) {
  colorMode.value = mode
  if (import.meta.client) {
    localStorage.setItem('color-mode', mode)
    updateResolvedMode()
  }
}

// Toggle between light and dark
function toggleColorMode() {
  const modes: ColorMode[] = ['light', 'dark', 'system']
  const currentIndex = modes.indexOf(colorMode.value)
  const nextIndex = (currentIndex + 1) % modes.length
  setColorMode(modes[nextIndex]!)
}

export function useColorMode() {
  // Initialize on first use
  onMounted(() => {
    initColorMode()
  })

  return {
    colorMode: readonly(colorMode),
    resolvedMode: readonly(resolvedMode),
    preference: resolvedMode,
    setColorMode,
    toggleColorMode,
    isDark: computed(() => resolvedMode.value === 'dark'),
    isLight: computed(() => resolvedMode.value === 'light')
  }
}
