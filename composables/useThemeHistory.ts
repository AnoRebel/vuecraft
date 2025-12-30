/**
 * Theme History - Undo/Redo functionality for Vuecraft
 * Tracks configuration changes and allows reverting to previous states
 */

import { ref, computed } from 'vue'
import type { SerializedConfig } from '~/types/config'

export interface HistoryEntry {
  config: SerializedConfig
  timestamp: number
  label?: string
}

const MAX_HISTORY_SIZE = 50
const DEBOUNCE_MS = 500

// Shared state across the app
const history = ref<HistoryEntry[]>([])
const currentIndex = ref(-1)
const isApplyingHistory = ref(false)
const lastChangeTime = ref(0)

export function useThemeHistory() {
  /**
   * Whether undo is available
   */
  const canUndo = computed(() => currentIndex.value > 0)

  /**
   * Whether redo is available
   */
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)

  /**
   * Current history length
   */
  const historyLength = computed(() => history.value.length)

  /**
   * Current position in history (1-indexed for display)
   */
  const currentPosition = computed(() => currentIndex.value + 1)

  /**
   * Push a new state to history
   * Debounced to avoid flooding with rapid changes
   */
  function push(config: SerializedConfig, label?: string): void {
    // Don't record changes while applying history (undo/redo)
    if (isApplyingHistory.value) return

    const now = Date.now()

    // Debounce rapid changes
    if (now - lastChangeTime.value < DEBOUNCE_MS && history.value.length > 0) {
      // Update the most recent entry instead of creating a new one
      history.value[currentIndex.value] = {
        config: structuredClone(config),
        timestamp: now,
        label,
      }
      lastChangeTime.value = now
      return
    }

    lastChangeTime.value = now

    // If we're not at the end of history, truncate future entries
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    // Add new entry
    history.value.push({
      config: structuredClone(config),
      timestamp: now,
      label,
    })

    // Enforce max size
    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value.shift()
    } else {
      currentIndex.value++
    }
  }

  /**
   * Undo to previous state
   * Returns the config to apply, or null if can't undo
   */
  function undo(): SerializedConfig | null {
    if (!canUndo.value) return null

    currentIndex.value--
    const entry = history.value[currentIndex.value]
    return entry ? structuredClone(entry.config) : null
  }

  /**
   * Redo to next state
   * Returns the config to apply, or null if can't redo
   */
  function redo(): SerializedConfig | null {
    if (!canRedo.value) return null

    currentIndex.value++
    const entry = history.value[currentIndex.value]
    return entry ? structuredClone(entry.config) : null
  }

  /**
   * Jump to a specific point in history
   */
  function jumpTo(index: number): SerializedConfig | null {
    if (index < 0 || index >= history.value.length) return null

    currentIndex.value = index
    const entry = history.value[index]
    return entry ? structuredClone(entry.config) : null
  }

  /**
   * Get the full history list
   */
  function getHistory(): HistoryEntry[] {
    return history.value.map((entry) => ({
      ...entry,
      config: structuredClone(entry.config),
    }))
  }

  /**
   * Clear all history
   */
  function clear(): void {
    history.value = []
    currentIndex.value = -1
    lastChangeTime.value = 0
  }

  /**
   * Initialize history with a starting state
   */
  function initialize(config: SerializedConfig): void {
    if (history.value.length === 0) {
      history.value = [
        {
          config: structuredClone(config),
          timestamp: Date.now(),
          label: 'Initial',
        },
      ]
      currentIndex.value = 0
    }
  }

  /**
   * Mark that we're applying history (to prevent recording during undo/redo)
   */
  function setApplyingHistory(value: boolean): void {
    isApplyingHistory.value = value
  }

  /**
   * Check if currently applying history
   */
  function isApplying(): boolean {
    return isApplyingHistory.value
  }

  /**
   * Get a formatted timestamp
   */
  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - timestamp

    if (diffMs < 60000) {
      return 'Just now'
    } else if (diffMs < 3600000) {
      const mins = Math.floor(diffMs / 60000)
      return `${mins} min${mins > 1 ? 's' : ''} ago`
    } else if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return {
    // State
    canUndo,
    canRedo,
    historyLength,
    currentPosition,

    // Actions
    push,
    undo,
    redo,
    jumpTo,
    getHistory,
    clear,
    initialize,
    setApplyingHistory,
    isApplying,

    // Utilities
    formatTimestamp,
  }
}
