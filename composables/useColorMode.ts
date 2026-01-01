import { computed, readonly } from 'vue'
import { useColorMode as useVueUseColorMode, useDark } from '@vueuse/core'

export function useColorMode() {
  // Use VueUse's built-in color mode handling
  const mode = useVueUseColorMode({
    attribute: 'class',
    modes: {
      light: '',
      dark: 'dark',
    },
    storageKey: 'color-mode',
    initialValue: 'auto',
  })

  // Use useDark for easy dark mode detection
  const isDark = useDark({
    storageKey: 'color-mode',
    valueDark: 'dark',
    valueLight: 'light',
  })

  const isLight = computed(() => !isDark.value)

  // Get the resolved mode (actual light/dark, not 'auto')
  const resolvedMode = computed(() => (isDark.value ? 'dark' : 'light'))

  // Set color mode
  function setColorMode(newMode: 'light' | 'dark' | 'auto') {
    mode.value = newMode
  }

  // Toggle between light, dark, and auto
  function toggleColorMode() {
    const modes = ['light', 'dark', 'auto'] as const
    const currentIndex = modes.indexOf(mode.value as (typeof modes)[number])
    const nextIndex = (currentIndex + 1) % modes.length
    mode.value = modes[nextIndex]!
  }

  return {
    colorMode: readonly(mode),
    resolvedMode,
    preference: resolvedMode,
    setColorMode,
    toggleColorMode,
    isDark,
    isLight,
  }
}
