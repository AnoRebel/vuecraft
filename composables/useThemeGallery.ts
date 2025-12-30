/**
 * Theme Gallery for Vuecraft
 * Browse, share, and fork community themes
 */

import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import type { SerializedConfig } from '~/types/config'
import { PRESET_THEMES } from '~/config/defaults'

export interface GalleryTheme {
  id: string
  name: string
  author: string
  description: string
  tags: string[]
  config: SerializedConfig
  preview: {
    primaryColor: string
    backgroundColor: string
    accentColor?: string
  }
  stats: {
    forks: number
    views: number
    likes: number
  }
  createdAt: number
  updatedAt: number
  isBuiltIn: boolean
}

export interface GalleryFilter {
  search: string
  tags: string[]
  sortBy: 'newest' | 'popular' | 'name'
  showBuiltIn: boolean
}

const STORAGE_KEY = 'vuecraft-gallery'

// Convert preset themes to gallery format
function createBuiltInThemes(): GalleryTheme[] {
  return PRESET_THEMES.map((preset) => ({
    id: `built-in-${preset.name}`,
    name: preset.label,
    author: 'Vuecraft',
    description: preset.description,
    tags: [preset.name, 'preset', 'official'],
    config: {
      v: 1,
      t: preset.config.theme as SerializedConfig['t'],
      ty: preset.config.typography as SerializedConfig['ty'],
      c: preset.config.components as SerializedConfig['c'],
      i: { library: 'lucide', defaultSize: 'md', strokeWidth: 'default' },
      l: { containerWidth: 'xl', spacingScale: 'default', sidebarWidth: 'default', headerHeight: 'default' },
    },
    preview: {
      primaryColor: preset.preview.primary,
      backgroundColor: preset.preview.background,
    },
    stats: {
      forks: 0,
      views: 0,
      likes: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isBuiltIn: true,
  }))
}

export function useThemeGallery() {
  // Community themes stored in localStorage
  const communityThemes = useStorage<GalleryTheme[]>(STORAGE_KEY, [])

  // Built-in themes (from presets)
  const builtInThemes = ref<GalleryTheme[]>(createBuiltInThemes())

  // Current filter
  const filter = ref<GalleryFilter>({
    search: '',
    tags: [],
    sortBy: 'newest',
    showBuiltIn: true,
  })

  // Selected theme for preview
  const selectedTheme = ref<GalleryTheme | null>(null)

  /**
   * All themes (built-in + community)
   */
  const allThemes = computed(() => {
    const themes = [...communityThemes.value]
    if (filter.value.showBuiltIn) {
      themes.push(...builtInThemes.value)
    }
    return themes
  })

  /**
   * All unique tags
   */
  const allTags = computed(() => {
    const tags = new Set<string>()
    for (const theme of allThemes.value) {
      theme.tags.forEach((tag) => tags.add(tag))
    }
    return Array.from(tags).sort()
  })

  /**
   * Filtered and sorted themes
   */
  const filteredThemes = computed(() => {
    let themes = [...allThemes.value]

    // Apply search filter
    if (filter.value.search) {
      const search = filter.value.search.toLowerCase()
      themes = themes.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.author.toLowerCase().includes(search) ||
          t.tags.some((tag) => tag.toLowerCase().includes(search))
      )
    }

    // Apply tag filter
    if (filter.value.tags.length > 0) {
      themes = themes.filter((t) => filter.value.tags.some((tag) => t.tags.includes(tag)))
    }

    // Apply sorting
    switch (filter.value.sortBy) {
      case 'newest':
        themes.sort((a, b) => b.createdAt - a.createdAt)
        break
      case 'popular':
        themes.sort((a, b) => b.stats.forks + b.stats.likes - (a.stats.forks + a.stats.likes))
        break
      case 'name':
        themes.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return themes
  })

  /**
   * Publish a new theme to the gallery
   */
  function publishTheme(
    config: SerializedConfig,
    metadata: {
      name: string
      author: string
      description: string
      tags: string[]
      preview: GalleryTheme['preview']
    }
  ): string {
    const id = `community-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const theme: GalleryTheme = {
      id,
      name: metadata.name,
      author: metadata.author,
      description: metadata.description,
      tags: metadata.tags,
      config: structuredClone(config),
      preview: metadata.preview,
      stats: {
        forks: 0,
        views: 0,
        likes: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isBuiltIn: false,
    }

    communityThemes.value.push(theme)
    return id
  }

  /**
   * Fork a theme (create a copy)
   */
  function forkTheme(themeId: string, newName?: string): string | null {
    const original = allThemes.value.find((t) => t.id === themeId)
    if (!original) return null

    // Increment fork count
    if (!original.isBuiltIn) {
      const communityTheme = communityThemes.value.find((t) => t.id === themeId)
      if (communityTheme) {
        communityTheme.stats.forks++
      }
    }

    // Create fork
    const forkedId = publishTheme(original.config, {
      name: newName || `${original.name} (Fork)`,
      author: 'Me', // Would come from auth in real app
      description: `Forked from ${original.name} by ${original.author}`,
      tags: [...original.tags.filter((t) => t !== 'official'), 'fork'],
      preview: original.preview,
    })

    return forkedId
  }

  /**
   * Delete a community theme
   */
  function deleteTheme(themeId: string): boolean {
    const index = communityThemes.value.findIndex((t) => t.id === themeId)
    if (index === -1) return false

    communityThemes.value.splice(index, 1)
    return true
  }

  /**
   * Update a community theme
   */
  function updateTheme(themeId: string, updates: Partial<GalleryTheme>): boolean {
    const theme = communityThemes.value.find((t) => t.id === themeId)
    if (!theme) return false

    Object.assign(theme, updates, { updatedAt: Date.now() })
    return true
  }

  /**
   * Get a theme by ID
   */
  function getTheme(themeId: string): GalleryTheme | null {
    return allThemes.value.find((t) => t.id === themeId) || null
  }

  /**
   * Like a theme
   */
  function likeTheme(themeId: string): void {
    const theme = communityThemes.value.find((t) => t.id === themeId)
    if (theme) {
      theme.stats.likes++
    }
  }

  /**
   * Record a view
   */
  function viewTheme(themeId: string): void {
    const theme = communityThemes.value.find((t) => t.id === themeId)
    if (theme) {
      theme.stats.views++
    }
  }

  /**
   * Set search filter
   */
  function setSearch(search: string): void {
    filter.value.search = search
  }

  /**
   * Toggle tag filter
   */
  function toggleTag(tag: string): void {
    const index = filter.value.tags.indexOf(tag)
    if (index === -1) {
      filter.value.tags.push(tag)
    } else {
      filter.value.tags.splice(index, 1)
    }
  }

  /**
   * Set sort order
   */
  function setSortBy(sortBy: GalleryFilter['sortBy']): void {
    filter.value.sortBy = sortBy
  }

  /**
   * Toggle built-in themes visibility
   */
  function toggleBuiltIn(): void {
    filter.value.showBuiltIn = !filter.value.showBuiltIn
  }

  /**
   * Clear all filters
   */
  function clearFilters(): void {
    filter.value = {
      search: '',
      tags: [],
      sortBy: 'newest',
      showBuiltIn: true,
    }
  }

  /**
   * Select a theme for preview
   */
  function selectTheme(theme: GalleryTheme | null): void {
    selectedTheme.value = theme
    if (theme && !theme.isBuiltIn) {
      viewTheme(theme.id)
    }
  }

  /**
   * Export gallery as JSON
   */
  function exportGallery(): string {
    return JSON.stringify(communityThemes.value, null, 2)
  }

  /**
   * Import themes from JSON
   */
  function importGallery(json: string): number {
    try {
      const imported = JSON.parse(json) as GalleryTheme[]
      let count = 0

      for (const theme of imported) {
        // Validate and add
        if (theme.id && theme.name && theme.config) {
          theme.id = `imported-${Date.now()}-${count}` // Generate new ID
          theme.isBuiltIn = false
          communityThemes.value.push(theme)
          count++
        }
      }

      return count
    } catch {
      return 0
    }
  }

  return {
    // State
    communityThemes,
    builtInThemes,
    filter,
    selectedTheme,
    allThemes,
    allTags,
    filteredThemes,

    // CRUD
    publishTheme,
    forkTheme,
    deleteTheme,
    updateTheme,
    getTheme,

    // Engagement
    likeTheme,
    viewTheme,

    // Filtering
    setSearch,
    toggleTag,
    setSortBy,
    toggleBuiltIn,
    clearFilters,

    // Selection
    selectTheme,

    // Import/Export
    exportGallery,
    importGallery,
  }
}
