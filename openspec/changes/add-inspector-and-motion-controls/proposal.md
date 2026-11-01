# Proposal

## Why

The builder shipped an element inspector overlay and an animation customizer that were never mounted: the overlay duplicated the hover inspector without being reachable, and the animation customizer kept its settings in memory without affecting the preview or any export. Users can only pick a coarse animation speed and can hover elements, but cannot study an element in depth or design the motion of their theme.

## What Changes

- Clicking an element with the inspector on pins it and opens an inspector panel: ancestor breadcrumb with parent navigation, component name, box model, the theme tokens the element uses (with swatches and text contrast), utility classes and a code snippet to copy. Works with mouse, keyboard and touch.
- A Motion section configures exact duration, easing (presets or a custom cubic-bézier with a live curve), entrance effects (fade, scale, slide, blur) and a reduced-motion mode, with a replayable demo.
- Motion settings are part of the configuration (persisted, shared, undoable), drive transitions and entrance animations in the preview, and are included in the shadcn-vue and Tailwind exports as theme variables, an `animate-enter` utility and a reduced-motion rule.

## Capabilities

### New Capabilities

- `preview-inspector`: inspecting, pinning and navigating preview elements and reading their styles and theme tokens.
- `motion-design`: configuring, previewing and exporting a theme's motion.

### Modified Capabilities

None.

## Impact

- `components/preview/ElementInspector.vue`, new `ElementInspectorPanel.vue`, new `composables/useElementInspector.ts`
- New `components/config/MotionConfig.vue`, `composables/useAnimationCustomizer.ts` (rebuilt on the configuration)
- `types/config.ts`, `config/defaults.ts`, `utils/themeTokens.ts`, `utils/cssGenerator.ts`, `utils/tailwindGenerator.ts`, `assets/css/main.css`
