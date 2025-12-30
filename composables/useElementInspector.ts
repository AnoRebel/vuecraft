/**
 * Element/Code Inspector for Vuecraft
 * Inspect preview elements and view their styles/code
 */

import { ref, computed } from 'vue'

export interface InspectedElement {
  tagName: string
  className: string
  id: string
  computedStyles: Record<string, string>
  cssVariables: Record<string, string>
  tailwindClasses: string[]
  boundingRect: DOMRect
  innerHTML: string
  outerHTML: string
}

export interface StyleProperty {
  name: string
  value: string
  isCustomProperty: boolean
  source: 'computed' | 'variable' | 'tailwind'
}

export function useElementInspector() {
  const isInspecting = ref(false)
  const isPinned = ref(false)
  const selectedElement = ref<HTMLElement | null>(null)
  const hoveredElement = ref<HTMLElement | null>(null)
  const inspectedData = ref<InspectedElement | null>(null)
  const previewContainer = ref<HTMLElement | null>(null)

  // Relevant CSS properties to show
  const RELEVANT_PROPERTIES = [
    'color',
    'background-color',
    'background',
    'border',
    'border-radius',
    'padding',
    'margin',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'letter-spacing',
    'box-shadow',
    'opacity',
    'display',
    'flex',
    'grid',
    'gap',
    'width',
    'height',
    'min-width',
    'max-width',
    'min-height',
    'max-height',
  ]

  // Relevant CSS variables (theme variables)
  const THEME_VARIABLE_PREFIXES = [
    '--background',
    '--foreground',
    '--card',
    '--popover',
    '--primary',
    '--secondary',
    '--muted',
    '--accent',
    '--destructive',
    '--border',
    '--input',
    '--ring',
    '--radius',
  ]

  /**
   * Set the preview container to inspect within
   */
  function setPreviewContainer(container: HTMLElement | null): void {
    previewContainer.value = container
  }

  /**
   * Start inspecting mode
   */
  function startInspecting(): void {
    isInspecting.value = true
    isPinned.value = false
    selectedElement.value = null
    hoveredElement.value = null
    inspectedData.value = null
  }

  /**
   * Stop inspecting mode
   */
  function stopInspecting(): void {
    isInspecting.value = false
    isPinned.value = false
    selectedElement.value = null
    hoveredElement.value = null
    inspectedData.value = null
  }

  /**
   * Toggle inspecting mode
   */
  function toggleInspecting(): void {
    if (isInspecting.value) {
      stopInspecting()
    } else {
      startInspecting()
    }
  }

  /**
   * Handle element hover
   */
  function handleElementHover(element: HTMLElement | null): void {
    if (!isInspecting.value || isPinned.value) return
    hoveredElement.value = element
    if (element) {
      inspectedData.value = inspectElement(element)
    }
  }

  /**
   * Handle element click (pin selection)
   */
  function handleElementClick(element: HTMLElement): void {
    if (!isInspecting.value) return
    selectedElement.value = element
    isPinned.value = true
    inspectedData.value = inspectElement(element)
  }

  /**
   * Unpin the current selection
   */
  function unpinSelection(): void {
    isPinned.value = false
    selectedElement.value = null
  }

  /**
   * Inspect an element and extract relevant data
   */
  function inspectElement(element: HTMLElement): InspectedElement {
    const computed = getComputedStyle(element)
    const computedStyles: Record<string, string> = {}
    const cssVariables: Record<string, string> = {}

    // Get relevant computed styles
    for (const prop of RELEVANT_PROPERTIES) {
      const value = computed.getPropertyValue(prop)
      if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
        computedStyles[prop] = value
      }
    }

    // Get CSS variables used by this element
    const rootStyles = getComputedStyle(document.documentElement)
    for (const prefix of THEME_VARIABLE_PREFIXES) {
      const value = rootStyles.getPropertyValue(prefix)
      if (value) {
        cssVariables[prefix] = value.trim()
      }
    }

    // Extract Tailwind classes
    const tailwindClasses = extractTailwindClasses(element.className)

    return {
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      id: element.id,
      computedStyles,
      cssVariables,
      tailwindClasses,
      boundingRect: element.getBoundingClientRect(),
      innerHTML: element.innerHTML.slice(0, 500), // Truncate for performance
      outerHTML: element.outerHTML.slice(0, 1000),
    }
  }

  /**
   * Extract Tailwind CSS classes from a class string
   */
  function extractTailwindClasses(className: string): string[] {
    if (!className) return []

    // Common Tailwind patterns
    const tailwindPatterns = [
      /^(bg|text|border|ring|shadow|rounded|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|h|min-w|max-w|min-h|max-h|flex|grid|gap|space|font|tracking|leading|opacity|z|inset|top|right|bottom|left|overflow|cursor|select|transition|duration|ease|animate|transform|scale|rotate|translate|skew|origin)-/,
      /^(block|inline|inline-block|flex|inline-flex|grid|inline-grid|hidden|visible|invisible)$/,
      /^(static|fixed|absolute|relative|sticky)$/,
      /^(items|justify|content|self|place)-/,
      /^(col|row)-/,
      /^(sm|md|lg|xl|2xl):/,
      /^(hover|focus|active|disabled|dark):/,
    ]

    return className.split(/\s+/).filter((cls) => tailwindPatterns.some((pattern) => pattern.test(cls)))
  }

  /**
   * Get all style properties formatted for display
   */
  const styleProperties = computed<StyleProperty[]>(() => {
    if (!inspectedData.value) return []

    const properties: StyleProperty[] = []

    // Add computed styles
    for (const [name, value] of Object.entries(inspectedData.value.computedStyles)) {
      properties.push({
        name,
        value,
        isCustomProperty: false,
        source: 'computed',
      })
    }

    // Add CSS variables
    for (const [name, value] of Object.entries(inspectedData.value.cssVariables)) {
      properties.push({
        name,
        value,
        isCustomProperty: true,
        source: 'variable',
      })
    }

    return properties
  })

  /**
   * Generate code snippet for the selected element
   */
  function generateCodeSnippet(): string {
    if (!inspectedData.value) return ''

    const { tagName, tailwindClasses, id } = inspectedData.value

    // Generate a simplified code example
    const classStr = tailwindClasses.length > 0 ? ` class="${tailwindClasses.join(' ')}"` : ''
    const idStr = id ? ` id="${id}"` : ''

    return `<${tagName}${idStr}${classStr}>
  <!-- content -->
</${tagName}>`
  }

  /**
   * Copy code snippet to clipboard
   */
  async function copyCodeSnippet(): Promise<boolean> {
    const snippet = generateCodeSnippet()
    if (!snippet) return false

    try {
      await navigator.clipboard.writeText(snippet)
      return true
    } catch {
      return false
    }
  }

  /**
   * Copy Tailwind classes to clipboard
   */
  async function copyTailwindClasses(): Promise<boolean> {
    if (!inspectedData.value) return false

    const classes = inspectedData.value.tailwindClasses.join(' ')
    if (!classes) return false

    try {
      await navigator.clipboard.writeText(classes)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get highlight overlay styles for the hovered/selected element
   */
  const highlightStyles = computed(() => {
    const element = isPinned.value ? selectedElement.value : hoveredElement.value
    if (!element) return null

    const rect = element.getBoundingClientRect()
    const containerRect = previewContainer.value?.getBoundingClientRect()

    if (!containerRect) {
      return {
        position: 'fixed' as const,
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        pointerEvents: 'none' as const,
      }
    }

    // Relative to container
    return {
      position: 'absolute' as const,
      top: `${rect.top - containerRect.top}px`,
      left: `${rect.left - containerRect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: 'none' as const,
    }
  })

  /**
   * Current element being highlighted
   */
  const currentElement = computed(() => {
    return isPinned.value ? selectedElement.value : hoveredElement.value
  })

  return {
    // State
    isInspecting,
    isPinned,
    selectedElement,
    hoveredElement,
    inspectedData,
    styleProperties,
    highlightStyles,
    currentElement,

    // Actions
    setPreviewContainer,
    startInspecting,
    stopInspecting,
    toggleInspecting,
    handleElementHover,
    handleElementClick,
    unpinSelection,
    inspectElement,

    // Code generation
    generateCodeSnippet,
    copyCodeSnippet,
    copyTailwindClasses,
    extractTailwindClasses,
  }
}
