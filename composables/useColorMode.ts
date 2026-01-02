import { computed, readonly, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

export function useColorMode() {
  // Use useDark for simple and reliable dark mode toggle
  const isDark = useDark({
    storageKey: 'vuecraft-color-mode',
    valueDark: 'dark',
    valueLight: 'light',
    selector: 'html',
    attribute: 'class',
  })

  const toggleDark = useToggle(isDark)
  const isLight = computed(() => !isDark.value)

  // Get the resolved mode (actual light/dark)
  const resolvedMode = computed(() => (isDark.value ? 'dark' : 'light'))
  const colorMode = computed(() => resolvedMode.value)

  // Set color mode
  function setColorMode(newMode: 'light' | 'dark') {
    isDark.value = newMode === 'dark'
  }

  // Simple toggle between light and dark
  function toggleColorMode() {
    toggleDark()
  }

  // Ensure class is applied on changes
  watch(
    isDark,
    (dark) => {
      if (typeof document !== 'undefined') {
        if (dark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    { immediate: true }
  )

  return {
    colorMode: readonly(colorMode),
    resolvedMode,
    preference: resolvedMode,
    setColorMode,
    toggleColorMode,
    isDark,
    isLight,
  }
}
