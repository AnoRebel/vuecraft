# Design

## Context

`ElementInspectorOverlay.vue` / `useElementInspector.ts` and `useAnimationCustomizer.ts` existed but were never mounted. The preview already has a hover inspector (`ElementInspector.vue`) and a coarse `components.animationSpeed` setting.

## Decisions

### Inspector: one inspector, two layers

Instead of a second overlay, the hover inspector gains a pinned state. `useElementInspector` holds shared state (enabled, hovered, pinned) so the preview header, the highlight layer and the panel agree. The highlight layer draws a hover box and a pinned box in the frame's own coordinates (zoom and scroll aware). `ElementInspectorPanel.vue` is docked to the preview panel (a bottom sheet below `md`).

Token detection: for each colour token, a probe element inside the preview resolves `var(--color-<token>)` to its computed `rgb()`; the element's `color`, `background-color` and `border-color` are matched against that map. The map is rebuilt when the theme or colour mode changes. Contrast uses the existing WCAG helpers.

Clicks are captured on the frame in the capture phase while inspecting, so the preview's own handlers never run.

### Motion: part of the configuration

`ComponentsConfig` gains `animationDuration` (exact ms or null), `animationEasing` (CSS timing function), `animationEffects` (fade/scale/slide/blur) and `reducedMotion`. `resolveTheme` prefers the exact duration over the speed preset. The runtime CSS sets `--default-transition-duration` and `--default-transition-timing-function` on `.vc-preview` (Tailwind v4 reads both at runtime) and entrance variables consumed by one `vc-enter` keyframe: opacity, translate, scale and blur come from CSS variables so any combination of effects uses a single animation. `useAnimationCustomizer` becomes a thin layer over the configuration (presets, bézier helpers, demo replay).

Exports add `--default-transition-timing-function`, `--animate-enter` with `@keyframes enter` inside `@theme`, and a reduced-motion media query.

## Risks / Trade-offs

- Token detection matches by computed colour, so two tokens with identical values are reported together.
