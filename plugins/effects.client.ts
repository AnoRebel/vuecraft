// Plugin to apply effects CSS variables on app initialization
// This ensures effects are applied even if the Effects config section is collapsed

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  // Default settings
  const defaults = {
    headerTransparency: 100,
    sidebarTransparency: 100,
    cardTransparency: 100,
    blurAmount: 8,
    enableBlur: false,
    enableGlassmorphism: false,
  }

  // Get effects settings from localStorage
  const storageKey = 'vuecraft-effects'
  const stored = localStorage.getItem(storageKey)

  // Use stored settings or defaults
  const settings = stored ? { ...defaults, ...JSON.parse(stored) } : defaults
  const root = document.documentElement

  try {
    // Apply header transparency
    const headerAlpha = (settings.headerTransparency ?? 100) / 100
    root.style.setProperty('--effects-header-opacity', headerAlpha.toString())

    // Apply sidebar transparency
    const sidebarAlpha = (settings.sidebarTransparency ?? 100) / 100
    root.style.setProperty('--effects-sidebar-opacity', sidebarAlpha.toString())

    // Apply card transparency
    const cardAlpha = (settings.cardTransparency ?? 100) / 100
    root.style.setProperty('--effects-card-opacity', cardAlpha.toString())

    // Apply blur
    const blurValue = settings.enableBlur ? `${settings.blurAmount ?? 8}px` : '0px'
    root.style.setProperty('--effects-blur', blurValue)

    // Apply glassmorphism
    if (settings.enableGlassmorphism) {
      root.style.setProperty('--effects-glass-bg', 'rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--effects-glass-border', 'rgba(255, 255, 255, 0.2)')
      root.style.setProperty('--effects-glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.1)')
    } else {
      root.style.removeProperty('--effects-glass-bg')
      root.style.removeProperty('--effects-glass-border')
      root.style.removeProperty('--effects-glass-shadow')
    }
  } catch {
    // Ignore parse errors - apply defaults
    root.style.setProperty('--effects-header-opacity', '1')
    root.style.setProperty('--effects-sidebar-opacity', '1')
    root.style.setProperty('--effects-card-opacity', '1')
    root.style.setProperty('--effects-blur', '0px')
  }
})
