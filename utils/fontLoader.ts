/**
 * Loads Google Fonts families on demand so any font picked in the builder
 * (or provided by a preset) actually renders.
 */
import { primaryFontFamily } from '~/utils/themeTokens'

// Bundled with @nuxt/fonts for the builder chrome
const loaded = new Set<string>(['Inter', 'JetBrains Mono'])

// Families that do not ship every weight between 400 and 700
const WEIGHTS: Record<string, string> = {
  Lato: '400;700',
  'Space Mono': '400;700',
  'Ubuntu Mono': '400;700',
}

function href(family: string, weights: string | null): string {
  const name = encodeURIComponent(family).replace(/%20/g, '+')
  const axis = weights ? `:wght@${weights}` : ''
  return `https://fonts.googleapis.com/css2?family=${name}${axis}&display=swap`
}

export function loadFontFamily(family: string | null | undefined) {
  if (!import.meta.client || !family || loaded.has(family)) return
  loaded.add(family)

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.dataset.vcFont = family
  link.href = href(family, WEIGHTS[family] ?? '400;500;600;700')
  // Retry with the default weight if the requested weights do not exist
  link.onerror = () => {
    link.onerror = null
    link.href = href(family, null)
  }
  document.head.appendChild(link)
}

/** Load the first family of each CSS font stack */
export function loadFontStacks(...stacks: string[]) {
  for (const stack of stacks) loadFontFamily(primaryFontFamily(stack))
}
