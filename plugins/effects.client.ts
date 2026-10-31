// Apply stored effects on startup, even while the Effects section is collapsed
import { applyEffects, EFFECTS_STORAGE_KEY, type EffectsSettings } from '~/utils/effects'

export default defineNuxtPlugin(() => {
  let stored: Partial<EffectsSettings> = {}
  try {
    stored = JSON.parse(
      localStorage.getItem(EFFECTS_STORAGE_KEY) ?? '{}'
    ) as Partial<EffectsSettings>
  } catch {
    // corrupt storage - fall back to defaults
  }
  applyEffects(stored)
})
