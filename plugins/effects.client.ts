// Plugin to apply effects CSS variables on app initialization
// This ensures effects are applied even if the Effects config section is collapsed

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  // Get effects settings from localStorage
  const storageKey = 'vuecraft-effects'
  const stored = localStorage.getItem(storageKey)

  if (!stored) return

  try {
    const settings = JSON.parse(stored)
    const root = document.documentElement

    // Apply header transparency
    if (typeof settings.headerTransparency === 'number') {
      const headerAlpha = settings.headerTransparency / 100
      root.style.setProperty('--effects-header-opacity', headerAlpha.toString())
    }

    // Apply sidebar transparency
    if (typeof settings.sidebarTransparency === 'number') {
      const sidebarAlpha = settings.sidebarTransparency / 100
      root.style.setProperty('--effects-sidebar-opacity', sidebarAlpha.toString())
    }

    // Apply card transparency
    if (typeof settings.cardTransparency === 'number') {
      const cardAlpha = settings.cardTransparency / 100
      root.style.setProperty('--effects-card-opacity', cardAlpha.toString())
    }

    // Apply blur
    if (settings.enableBlur && typeof settings.blurAmount === 'number') {
      root.style.setProperty('--effects-blur', `${settings.blurAmount}px`)
    }

    // Apply glassmorphism
    if (settings.enableGlassmorphism) {
      root.style.setProperty('--effects-glass-bg', 'rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--effects-glass-border', 'rgba(255, 255, 255, 0.2)')
      root.style.setProperty('--effects-glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.1)')
    }
  } catch {
    // Ignore parse errors
  }
})
