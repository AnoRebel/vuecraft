/**
 * Applies the configured theme to the document.
 *
 * Runs once for the whole app (not per preview), caches the generated CSS so
 * the inline head script can apply it before first paint on the next visit,
 * and loads the fonts the theme uses.
 */
import { watch, computed } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { generateRuntimeCSS } from '~/utils/cssGenerator'
import { resolveTheme } from '~/utils/themeTokens'
import { loadFontStacks } from '~/utils/fontLoader'

export const THEME_STYLE_ID = 'vc-theme'
export const THEME_CACHE_KEY = 'vuecraft-theme-css'

export default defineNuxtPlugin(() => {
  const { config } = useDesignSystem()

  const css = computed(() => generateRuntimeCSS(config))

  function apply(text: string) {
    let el = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = THEME_STYLE_ID
      document.head.appendChild(el)
    }
    if (el.textContent !== text) el.textContent = text
    try {
      localStorage.setItem(THEME_CACHE_KEY, text)
    } catch {
      // storage unavailable
    }
  }

  watch(css, apply, { immediate: true })

  watch(
    () => {
      const t = resolveTheme(config)
      return [t.fontSans, t.fontHeading, t.fontMono] as const
    },
    (stacks) => loadFontStacks(...stacks),
    { immediate: true }
  )
})
