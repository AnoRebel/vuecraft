/**
 * Keyboard shortcuts for Vuecraft.
 *
 * Modifier shortcuts use Ctrl (Cmd on macOS). Single-key shortcuts only fire
 * when no text field has focus and no dialog is open, and browser shortcuts
 * such as reload (Ctrl+R) and bookmark (Ctrl+D) are left alone.
 */
import { onMounted, onUnmounted } from 'vue'

export interface Shortcut {
  /** Display form, e.g. "Ctrl+Shift+Z" or "?" */
  key: string
  description: string
  category: 'General' | 'Editing' | 'Export' | 'Preview'
}

export const SHORTCUTS: Shortcut[] = [
  { key: '?', description: 'Show keyboard shortcuts', category: 'General' },
  { key: 'D', description: 'Toggle dark mode', category: 'General' },
  { key: 'Ctrl+S', description: 'Save configuration', category: 'General' },
  { key: 'Ctrl+Z', description: 'Undo', category: 'Editing' },
  { key: 'Ctrl+Shift+Z', description: 'Redo (also Ctrl+Y)', category: 'Editing' },
  { key: 'R', description: 'Randomize theme', category: 'Editing' },
  { key: 'Ctrl+E', description: 'Export theme', category: 'Export' },
  { key: 'Ctrl+I', description: 'Import configuration', category: 'Export' },
  { key: 'Ctrl+Shift+S', description: 'Share link', category: 'Export' },
  { key: '1 – 7', description: 'Switch preview template', category: 'Preview' },
  { key: '↑', description: 'Inspector: select parent element', category: 'Preview' },
  { key: 'Esc', description: 'Unpin, then exit the inspector', category: 'Preview' },
]

export function isMacPlatform(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
}

/** Render a shortcut for the current platform */
export function formatShortcut(key: string): string {
  if (!isMacPlatform()) return key
  return key
    .replace(/Ctrl\+/g, '⌘')
    .replace(/Shift\+/g, '⇧')
    .replace(/Alt\+/g, '⌥')
}

function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

function dialogOpen(): boolean {
  return !!document.querySelector('[role="dialog"][data-state="open"]')
}

export interface ShortcutHandlers {
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onExport: () => void
  onImport: () => void
  onShare: () => void
  onToggleDarkMode: () => void
  onRandomize: () => void
  onShowShortcuts: () => void
  onPreviewTemplate: (index: number) => void
}

/** Register the global shortcut listener for the lifetime of the calling component */
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.defaultPrevented || e.repeat) return
    const mod = e.ctrlKey || e.metaKey
    const key = e.key.toLowerCase()

    if (mod && !e.altKey) {
      // Let native undo/redo work inside text fields
      if (isTyping() && ['z', 'y'].includes(key)) return
      let action: (() => void) | null = null
      if (key === 'z' && !e.shiftKey) action = handlers.onUndo
      else if ((key === 'z' && e.shiftKey) || key === 'y') action = handlers.onRedo
      else if (key === 's' && e.shiftKey) action = handlers.onShare
      else if (key === 's') action = handlers.onSave
      else if (key === 'e') action = handlers.onExport
      else if (key === 'i') action = handlers.onImport
      if (action) {
        e.preventDefault()
        action()
      }
      return
    }

    if (e.altKey || isTyping() || dialogOpen()) return

    if (e.key === '?') {
      e.preventDefault()
      handlers.onShowShortcuts()
    } else if (key === 'd') {
      handlers.onToggleDarkMode()
    } else if (key === 'r') {
      handlers.onRandomize()
    } else if (/^[1-7]$/.test(e.key)) {
      handlers.onPreviewTemplate(Number(e.key) - 1)
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
}
