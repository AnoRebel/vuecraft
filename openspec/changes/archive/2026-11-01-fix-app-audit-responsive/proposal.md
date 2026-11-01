# Proposal

## Why

A full audit of the builder showed that most configuration controls change state that nothing renders, imported presets live only as inline styles (so they are never exported, shared, persisted or undone), several finished features are unreachable or broken (undo/redo, shortcuts, gallery apply/fork, stale share links, unusable user menu), the hand-rolled dialog/tabs/select primitives are inaccessible, and the preview neither reflows inside its device frames nor works on phones. The preview itself shows only a fraction of what a theme affects.

## What Changes

- One resolved token set per configuration drives the runtime theme and every exporter, so what is previewed is what is exported.
- Every control has a visible effect: font scale, heading weight, line height, spacing, component style, border width, animation speed, focus ring, icon size/stroke/library, container/sidebar/header size, menu colour/accent, shadow intensity, neutral accents, exact radius, custom primary colour.
- Fonts load on demand for every selectable family.
- Presets (built-in, tweakcn, and the new Crystal Neuo materials) and palette / accessibility fixes are stored in the configuration.
- Share links, JSON import/export and saved configurations round-trip the full configuration including export settings; the share code is URL-safe; an opened link no longer overrides later edits.
- Undo/redo, keyboard shortcuts and the shortcuts dialog are wired up; Theme Compare, Brand Color Import and Color Blindness simulation become reachable; gallery Apply and Fork work.
- UI primitives (dialog, tabs, select, tooltip, switch, slider) are rebuilt on reka-ui with focus management, Escape handling and ARIA roles.
- The preview reflows by container width (device frames work), zoom and fullscreen work, data is deterministic (no hydration mismatches), and it gains a palette strip, charts using chart-1..5, an app shell using the sidebar tokens, typography and a broader component gallery.
- The builder layout works from 360px phones to wide desktops: no clipped toolbars, no floating elements covering content, a usable config drawer, and a user menu above the preview.
- **BREAKING (exports)**: shadcn-vue and Tailwind CSS exports now follow the Tailwind v4 `@theme inline` / `@theme` conventions instead of self-referencing variables.

## Capabilities

### New Capabilities

- `theme-engine`: resolving a configuration into design tokens and applying them to the builder, the preview and the exported files.
- `theme-presets`: built-in, tweakcn and Crystal Neuo presets and colour tools that write into the configuration.
- `theme-persistence`: local persistence, share links, JSON import/export, saved configurations and undo/redo history.
- `live-preview`: preview templates, device frames, zoom, fullscreen and inspector.
- `builder-shell`: responsive application layout, toolbar, dialogs, keyboard shortcuts and accessibility of the builder UI.

### Modified Capabilities

None (no existing specs).

## Impact

- `utils/themeTokens.ts` (new), `utils/cssGenerator.ts`, `utils/tailwindGenerator.ts`, `utils/nuxtUIGenerator.ts`, `config/*`, `types/config.ts`
- `composables/useDesignSystem.ts`, `useThemeHistory.ts`, `useKeyboardShortcuts.ts`, `useThemeGallery.ts`, new font loader
- `components/ui/*` rebuilt on reka-ui; `components/preview/*`, `components/config/*`, toolbar and dialogs
- `assets/css/main.css`, `app.vue`, `pages/index.vue`, `nuxt.config.ts`
