/**
 * Keyboard Shortcuts for Vuecraft
 * Provides power-user shortcuts for common actions
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useMagicKeys } from '@vueuse/core'

export interface Shortcut {
  key: string
  label: string
  description: string
  action: () => void
  category: 'general' | 'editing' | 'navigation' | 'export'
}

// Shared state for dialog visibility
const shortcutsDialogOpen = ref(false)

export function useKeyboardShortcuts() {
  const keys = useMagicKeys()
  const registeredShortcuts = ref<Shortcut[]>([])
  const isEnabled = ref(true)

  /**
   * Check if we're in an input field
   */
  function isInputFocused(): boolean {
    const activeElement = document.activeElement
    if (!activeElement) return false

    const tagName = activeElement.tagName.toLowerCase()
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      (activeElement as HTMLElement).isContentEditable
    )
  }

  /**
   * Register a shortcut
   */
  function registerShortcut(shortcut: Shortcut): void {
    registeredShortcuts.value.push(shortcut)
  }

  /**
   * Unregister a shortcut by key
   */
  function unregisterShortcut(key: string): void {
    registeredShortcuts.value = registeredShortcuts.value.filter((s) => s.key !== key)
  }

  /**
   * Enable/disable all shortcuts
   */
  function setEnabled(enabled: boolean): void {
    isEnabled.value = enabled
  }

  /**
   * Toggle shortcuts dialog
   */
  function toggleShortcutsDialog(): void {
    shortcutsDialogOpen.value = !shortcutsDialogOpen.value
  }

  /**
   * Open shortcuts dialog
   */
  function openShortcutsDialog(): void {
    shortcutsDialogOpen.value = true
  }

  /**
   * Close shortcuts dialog
   */
  function closeShortcutsDialog(): void {
    shortcutsDialogOpen.value = false
  }

  /**
   * Get all registered shortcuts grouped by category
   */
  function getShortcutsByCategory(): Record<string, Shortcut[]> {
    return registeredShortcuts.value.reduce(
      (acc, shortcut) => {
        if (!acc[shortcut.category]) {
          acc[shortcut.category] = []
        }
        acc[shortcut.category]!.push(shortcut)
        return acc
      },
      {} as Record<string, Shortcut[]>
    )
  }

  /**
   * Format key for display (platform-aware)
   */
  function formatKey(key: string): string {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

    return key
      .replace(/ctrl/gi, isMac ? '⌃' : 'Ctrl')
      .replace(/cmd|meta/gi, isMac ? '⌘' : 'Win')
      .replace(/alt/gi, isMac ? '⌥' : 'Alt')
      .replace(/shift/gi, isMac ? '⇧' : 'Shift')
      .replace(/\+/g, ' + ')
      .replace(/escape/gi, 'Esc')
  }

  return {
    // State
    shortcutsDialogOpen,
    registeredShortcuts,
    isEnabled,

    // Actions
    registerShortcut,
    unregisterShortcut,
    setEnabled,
    toggleShortcutsDialog,
    openShortcutsDialog,
    closeShortcutsDialog,
    getShortcutsByCategory,

    // Utilities
    formatKey,
    isInputFocused,

    // VueUse keys for custom handling
    keys,
  }
}

/**
 * Setup default Vuecraft shortcuts
 * Call this in a component with access to all required composables
 */
export function setupDefaultShortcuts(options: {
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onExport: () => void
  onImport: () => void
  onToggleDarkMode: () => void
  onRandomize?: () => void
  onPreviewTemplate?: (index: number) => void
}) {
  const { registerShortcut, isInputFocused, openShortcutsDialog } = useKeyboardShortcuts()

  // Register all default shortcuts
  const defaultShortcuts: Shortcut[] = [
    {
      key: 'Ctrl+Z',
      label: 'Undo',
      description: 'Undo last change',
      action: options.onUndo,
      category: 'editing',
    },
    {
      key: 'Ctrl+Shift+Z',
      label: 'Redo',
      description: 'Redo last undone change',
      action: options.onRedo,
      category: 'editing',
    },
    {
      key: 'Ctrl+S',
      label: 'Save',
      description: 'Save current configuration',
      action: options.onSave,
      category: 'general',
    },
    {
      key: 'Ctrl+E',
      label: 'Export',
      description: 'Open export dialog',
      action: options.onExport,
      category: 'export',
    },
    {
      key: 'Ctrl+I',
      label: 'Import',
      description: 'Open import dialog',
      action: options.onImport,
      category: 'export',
    },
    {
      key: 'Ctrl+D',
      label: 'Toggle Dark Mode',
      description: 'Switch between light and dark mode',
      action: options.onToggleDarkMode,
      category: 'general',
    },
    {
      key: '?',
      label: 'Show Shortcuts',
      description: 'Display keyboard shortcuts help',
      action: openShortcutsDialog,
      category: 'general',
    },
  ]

  if (options.onRandomize) {
    defaultShortcuts.push({
      key: 'Ctrl+R',
      label: 'Randomize',
      description: 'Generate random theme',
      action: options.onRandomize,
      category: 'editing',
    })
  }

  // Register all shortcuts
  defaultShortcuts.forEach(registerShortcut)

  // Setup keyboard event listener
  function handleKeyDown(e: KeyboardEvent): void {
    // Don't trigger shortcuts in input fields (except for specific ones)
    if (isInputFocused() && e.key !== 'Escape') return

    const ctrl = e.ctrlKey || e.metaKey
    const shift = e.shiftKey
    const key = e.key.toLowerCase()

    // Build key combination string
    let combo = ''
    if (ctrl) combo += 'Ctrl+'
    if (shift) combo += 'Shift+'
    combo += key.charAt(0).toUpperCase() + key.slice(1)

    // Check for matching shortcut
    for (const shortcut of defaultShortcuts) {
      const shortcutCombo = shortcut.key.replace(/\s/g, '')
      if (shortcutCombo.toLowerCase() === combo.toLowerCase()) {
        e.preventDefault()
        shortcut.action()
        return
      }
    }

    // Handle ? for shortcuts dialog (no modifier)
    if (e.key === '?' && !ctrl && !shift) {
      e.preventDefault()
      openShortcutsDialog()
    }

    // Handle Escape to close dialogs
    if (e.key === 'Escape') {
      // This will be handled by individual dialogs
    }

    // Handle number keys for preview templates
    if (options.onPreviewTemplate && !ctrl && !shift && /^[1-5]$/.test(e.key)) {
      const index = parseInt(e.key) - 1
      options.onPreviewTemplate(index)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return defaultShortcuts
}
