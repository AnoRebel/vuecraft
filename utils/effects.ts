/**
 * Builder chrome effects (transparency, blur, glass). Shared by the boot
 * plugin and the Effects panel so both apply settings the same way.
 */
export interface EffectsSettings {
  headerTransparency: number
  sidebarTransparency: number
  cardTransparency: number
  blurAmount: number
  enableBlur: boolean
  enableGlassmorphism: boolean
}

export const EFFECTS_STORAGE_KEY = 'vuecraft-effects'

export const DEFAULT_EFFECTS: EffectsSettings = {
  headerTransparency: 100,
  sidebarTransparency: 100,
  cardTransparency: 100,
  blurAmount: 8,
  enableBlur: false,
  enableGlassmorphism: false,
}

export function applyEffects(partial: Partial<EffectsSettings>) {
  if (typeof document === 'undefined') return
  const s = { ...DEFAULT_EFFECTS, ...partial }
  const root = document.documentElement
  root.style.setProperty('--effects-header-opacity', String(s.headerTransparency / 100))
  root.style.setProperty('--effects-sidebar-opacity', String(s.sidebarTransparency / 100))
  root.style.setProperty('--effects-card-opacity', String(s.cardTransparency / 100))
  root.style.setProperty('--effects-blur', s.enableBlur ? `${s.blurAmount}px` : '0px')
  root.classList.toggle('vc-glass', s.enableGlassmorphism)
  try {
    localStorage.setItem('vuecraft-glass', s.enableGlassmorphism ? '1' : '0')
  } catch {
    // storage unavailable
  }
}
