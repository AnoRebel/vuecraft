/**
 * Element inspector for the live preview.
 *
 * Shared state lets the preview header (toggle), the highlight layer and the
 * inspector panel agree on what is hovered and pinned.
 */
import { ref, shallowRef } from 'vue'
import { COLOR_KEYS, toTokenName } from '~/utils/themeTokens'
import { getContrastRatio } from '~/utils/colorUtils'

export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

export interface TokenMatch {
  property: 'text' | 'background' | 'border'
  value: string
  tokens: string[]
  /** True when the token comes from the element's classes (e.g. while hovered) */
  declared?: boolean
}

export interface InspectedElement {
  tag: string
  component: string | null
  slot: string | null
  id: string
  classes: string[]
  size: { width: number; height: number }
  box: {
    margin: [number, number, number, number]
    border: [number, number, number, number]
    padding: [number, number, number, number]
  }
  typography: { family: string; size: string; weight: string; lineHeight: string }
  radius: string
  shadow: string
  colors: TokenMatch[]
  contrast: number | null
  path: { label: string; el: HTMLElement }[]
}

const enabled = ref(false)
const hovered = shallowRef<HTMLElement | null>(null)
const pinned = shallowRef<HTMLElement | null>(null)
const container = shallowRef<HTMLElement | null>(null)

// --- Colour normalisation -------------------------------------------------

let ctx: CanvasRenderingContext2D | null = null
const rgbaCache = new Map<string, Rgba | null>()

/** Resolve any CSS colour (oklch, color-mix, rgb...) to sRGB via a canvas */
export function toRgba(color: string): Rgba | null {
  if (!color || color === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }
  if (rgbaCache.has(color)) return rgbaCache.get(color)!
  if (!ctx) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    ctx = canvas.getContext('2d', { willReadFrequently: true })
  }
  if (!ctx) return null
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#000'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  const result = { r: r!, g: g!, b: b!, a: a! / 255 }
  rgbaCache.set(color, result)
  return result
}

const TOKEN_NAMES = new Set(COLOR_KEYS.map((k) => toTokenName(k)))
const CLASS_PREFIX: Record<TokenMatch['property'], string> = {
  text: 'text',
  background: 'bg',
  border: 'border',
}

/** Token named by a resting utility class, e.g. `bg-primary/90` -> `primary/90` */
function declaredToken(classes: string[], property: TokenMatch['property']): string | null {
  const prefix = CLASS_PREFIX[property]
  for (const cls of classes) {
    if (cls.includes(':')) continue
    const m = cls.match(new RegExp(`^${prefix}-([a-z0-9-]+?)(?:/(\\d+))?$`))
    if (m && TOKEN_NAMES.has(m[1]!)) return m[2] ? `${m[1]}/${m[2]}` : m[1]!
  }
  return null
}

const key = (c: Rgba) => `${c.r},${c.g},${c.b},${Math.round(c.a * 100)}`

/** Map rendered colours to theme token names, using probes inside the preview */
function buildTokenMap(root: HTMLElement): Map<string, string[]> {
  const map = new Map<string, string[]>()
  const probe = document.createElement('span')
  probe.style.display = 'none'
  root.appendChild(probe)
  for (const k of COLOR_KEYS) {
    const name = toTokenName(k)
    probe.style.color = `var(--color-${name})`
    const rgba = toRgba(getComputedStyle(probe).color)
    if (!rgba) continue
    const id = key(rgba)
    map.set(id, [...(map.get(id) ?? []), name])
  }
  probe.remove()
  return map
}

function opaqueBackground(el: HTMLElement | null): Rgba {
  let node: HTMLElement | null = el
  while (node) {
    const bg = toRgba(getComputedStyle(node).backgroundColor)
    if (bg && bg.a > 0.5) return bg
    node = node.parentElement
  }
  return toRgba(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 }
}

// --- Element description --------------------------------------------------

interface VueInstanceLike {
  type?: { name?: string; __name?: string }
  subTree?: { el?: unknown }
  parent?: VueInstanceLike | null
}

/** Name of the component this element is the root of (e.g. UiButton) */
function componentName(el: HTMLElement): string | null {
  let instance = (el as HTMLElement & { __vueParentComponent?: VueInstanceLike })
    .__vueParentComponent
  // Walk up wrappers (Primitive, Slot) whose root is the same element
  let name: string | null = null
  while (instance && instance.subTree?.el === el) {
    const n = instance.type?.name ?? instance.type?.__name ?? null
    if (n && !/^(Primitive|Slot)$/.test(n)) name = n
    instance = instance.parent ?? undefined
  }
  return name
}

export function describe(el: HTMLElement): string {
  const slot = el.dataset.slot
  if (slot) return slot
  const cls = typeof el.className === 'string' ? el.className.split(/\s+/)[0] : ''
  return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}`
}

function sides(
  style: CSSStyleDeclaration,
  prop: string,
  suffix = ''
): [number, number, number, number] {
  return (['top', 'right', 'bottom', 'left'] as const).map((s) =>
    Math.round(parseFloat(style.getPropertyValue(`${prop}-${s}${suffix}`)) || 0)
  ) as [number, number, number, number]
}

function inspect(el: HTMLElement): InspectedElement {
  const style = getComputedStyle(el)
  const root = container.value
  const tokenMap = root ? buildTokenMap(root) : new Map<string, string[]>()

  const colors: TokenMatch[] = []
  const entries: [TokenMatch['property'], string][] = [
    ['text', style.color],
    ['background', style.backgroundColor],
    ['border', parseFloat(style.borderTopWidth) > 0 ? style.borderTopColor : ''],
  ]
  const classes =
    typeof el.className === 'string'
      ? el.className.split(/\s+/).filter(Boolean)
      : (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)

  for (const [property, value] of entries) {
    const rgba = value ? toRgba(value) : null
    if (!rgba || rgba.a === 0) continue
    const matched = tokenMap.get(key(rgba)) ?? []
    const fromClass = declaredToken(classes, property)
    if (!matched.length) {
      colors.push({ property, value, tokens: fromClass ? [fromClass] : [], declared: !!fromClass })
      continue
    }
    // Tokens can share a value: list the one the element asks for first
    const preferred = fromClass && matched.includes(fromClass) ? fromClass : null
    colors.push({
      property,
      value,
      tokens: preferred ? [preferred, ...matched.filter((t) => t !== preferred)] : matched,
    })
  }

  const fg = toRgba(style.color)
  const bg = opaqueBackground(el)
  const contrast = fg ? getContrastRatio(fg, bg) : null

  const path: { label: string; el: HTMLElement }[] = []
  let node: HTMLElement | null = el
  while (node && node !== root) {
    path.unshift({ label: describe(node), el: node })
    node = node.parentElement
  }

  const rect = el.getBoundingClientRect()
  const scale = root && root.offsetWidth ? root.getBoundingClientRect().width / root.offsetWidth : 1

  return {
    tag: el.tagName.toLowerCase(),
    component: componentName(el),
    slot: el.dataset.slot ?? null,
    id: el.id,
    classes,
    size: { width: Math.round(rect.width / scale), height: Math.round(rect.height / scale) },
    box: {
      margin: sides(style, 'margin'),
      border: sides(style, 'border', '-width'),
      padding: sides(style, 'padding'),
    },
    typography: {
      family: style.fontFamily.split(',')[0]?.replace(/["']/g, '').trim() ?? '',
      size: style.fontSize,
      weight: style.fontWeight,
      lineHeight: style.lineHeight,
    },
    radius: style.borderRadius,
    shadow: style.boxShadow === 'none' ? 'none' : style.boxShadow,
    colors,
    contrast: contrast ? Math.round(contrast * 100) / 100 : null,
    path,
  }
}

export function snippet(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase()
  const cls = el.getAttribute('class')
  const text = el.childElementCount === 0 ? el.textContent?.trim().slice(0, 60) : ''
  return `<${tag}${cls ? ` class="${cls}"` : ''}>${text || '…'}</${tag}>`
}

export function useElementInspector() {
  function setContainer(el: HTMLElement | null) {
    container.value = el
  }

  function setEnabled(value: boolean) {
    enabled.value = value
    if (!value) {
      hovered.value = null
      pinned.value = null
    }
  }

  function pin(el: HTMLElement | null) {
    pinned.value = el
  }

  function selectParent() {
    const parent = pinned.value?.parentElement
    if (parent && container.value?.contains(parent) && parent !== container.value) {
      pinned.value = parent
    }
  }

  /** Escape: unpin first, then leave inspector mode */
  function escape(): boolean {
    if (pinned.value) {
      pinned.value = null
      return true
    }
    if (enabled.value) {
      setEnabled(false)
      return true
    }
    return false
  }

  return {
    enabled,
    hovered,
    pinned,
    container,
    setContainer,
    setEnabled,
    pin,
    selectParent,
    escape,
    inspect,
  }
}
