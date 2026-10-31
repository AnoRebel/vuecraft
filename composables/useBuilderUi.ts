/**
 * Shared UI state for the builder shell: which panels and dialogs are open.
 * Lets the toolbar, preview header and keyboard shortcuts drive the same state.
 */
import { ref } from 'vue'

const dialogs = {
  export: ref(false),
  import: ref(false),
  share: ref(false),
  auth: ref(false),
  gallery: ref(false),
  compare: ref(false),
  brand: ref(false),
  shortcuts: ref(false),
  save: ref(false),
}

const showMobileConfig = ref(false)
const showCSSPanel = ref(false)
const showCSSDialog = ref(false)
const activeTemplate = ref('dashboard')

export type BuilderDialog = keyof typeof dialogs

export function useBuilderUi() {
  function openDialog(name: BuilderDialog) {
    showMobileConfig.value = false
    dialogs[name].value = true
  }

  return {
    dialogs,
    openDialog,
    showMobileConfig,
    showCSSPanel,
    showCSSDialog,
    activeTemplate,
  }
}
