# Design

## Context

The builder applied the theme by injecting CSS variables on `:root`, but most configuration fields were never turned into CSS, Tailwind v4 baked shadow and spacing values into utilities at build time, unlayered overrides in `main.css` defeated hover variants, presets wrote inline styles that bypassed the configuration, and the preview used viewport breakpoints so device frames could not reflow.

## Decisions

### Token resolution (`utils/themeTokens.ts`)
`resolveTheme(config)` returns colours (light/dark), radius, font stacks, a full shadow scale per mode, border width, motion and density values. Precedence: generated palette < preset tokens (`theme.custom`) < explicit overrides (`theme.customPrimary`, `theme.radiusValue`). Runtime CSS and the shadcn-vue, Tailwind and Nuxt UI exporters all consume it.

### What is global and what is scoped
Colours, radius and fonts are applied on `:root`/`.dark` so dialogs and popovers (rendered in a portal) match the theme. Density and look - spacing (`--spacing`), the text scale (`--text-*`), heading weight, line height, border width, focus ring, icon size/stroke, motion, shadows, component style and layout sizes - are scoped to `.vc-preview` so the builder chrome stays usable whatever the user selects.

Tailwind v4 reads `--spacing`, `--text-*` and `--default-transition-duration` at runtime, so overriding them on `.vc-preview` rescales every utility inside the preview. Shadows are compiled into utilities, so the runtime stylesheet re-points `.shadow-*` inside the preview at `--vc-shadow-*` within `@layer utilities` (hover variants keep precedence through specificity).

### Component style variants
The preview root carries `data-style`. `main.css` adjusts Button/Card/Input/Badge (identified by `data-slot`) per style: New York (compact, smaller radius), Miami (gradient fills, glow), Brutal (no radius, ink borders, offset shadows), Soft (large radius, borderless tonal cards).

### Presets as configuration
Applying a preset writes `theme.custom` (`CustomThemeTokens`). Setters drop the matching custom token when the user edits a control (e.g. radius drops `custom.radius`, base/accent drop the custom palette). Built-in presets start from defaults. Crystal Neuo presets are generated from the design system's `tokens.json` by `scripts/sync-crystal-neuo-presets.ts`.

### Persistence
Serialisation deep-clones each group (fixing stale computed share links) and includes export settings and custom tokens. Share codes are base64url; decoding also accepts legacy base64. After loading from `?c=`, the parameter is removed. Undo/redo records debounced snapshots of the serialised config.

### No flash on load
The runtime stylesheet is cached in `localStorage`; an inline head script applies it and the stored colour mode before first paint.

### UI primitives
Dialog, Tabs, Select, Tooltip, Switch and Slider are rebuilt on reka-ui (shadcn-vue style) with the same component names and props so call sites are unchanged. Components carry `data-slot` attributes.

### Preview
The preview frame is a size container (`@container`); templates use container variants (`@md:`, `@lg:`). Zoom uses a sized wrapper around a scaled frame. Sample data comes from a fixed seed.

## Risks / Trade-offs

- Theme colours restyle the builder chrome as well as the preview, matching tweakcn-style editors; density does not.
- Fonts are fetched from Google Fonts at runtime; families not on Google Fonts fall back to the system stack.
