# Tasks

## 1. Theme engine

- [x] 1.1 Add `resolveTheme` with preset tokens, custom primary, exact radius and readable foregrounds; verify `nuxt typecheck` passes
- [x] 1.2 Generate runtime CSS (global palette, preview-scoped density, shadows, style variants) and remove unlayered overrides / fixed spacing scale from `main.css`; verify in the browser that shadow, spacing, font scale, border width and style change the preview
- [x] 1.3 Rewrite shadcn-vue, Tailwind and Nuxt UI exporters on `resolveTheme` and honour the variable prefix; verify exported CSS has no self-referencing variables
- [x] 1.4 Follow the colour-mode toggle for `dark:` variants, drop the wrapper `.dark` class, and add a no-flash head script; verify dark reload has no light flash
- [x] 1.5 Load selected fonts on demand; verify `document.fonts` contains the selected family

## 2. Presets and colour tools

- [x] 2.1 Store tweakcn presets in `theme.custom`; verify preset dark palette and persistence after reload
- [x] 2.2 Add Crystal Neuo presets section; verify Tactile shows ink borders and offset shadows
- [x] 2.3 Built-in presets start from defaults and clear custom tokens; manual edits drop the matching custom token
- [x] 2.4 Custom primary, palette Apply and accessibility Fix write to the configuration; accessibility report re-runs on change

## 3. Persistence and history

- [x] 3.1 Deep-clone serialisation including export settings and custom tokens; base64url share codes with legacy decode; strip `?c=` after load; verify share after shuffle shows the current theme
- [x] 3.2 Never mutate defaults on load/import/reset; verify reset after import restores export defaults
- [x] 3.3 Wire undo/redo (toolbar + shortcuts); verify Ctrl+Z restores the previous accent

## 4. Builder shell

- [x] 4.1 Rebuild dialog, tabs, select, tooltip, switch and slider on reka-ui; add `class` passthrough and `data-slot` to Button; verify Escape closes dialogs and focus returns
- [x] 4.2 Fix toolbar stacking (user menu above preview), mount shortcuts dialog and register shortcuts; verify Shift+? and Ctrl+E
- [x] 4.3 Make gallery Apply/Fork work and the gallery responsive; expose Compare, Brand Import, Color Blindness and Shortcuts from a toolbar tools menu
- [x] 4.4 Responsive layout: preview header wraps, footer and FABs never cover content, drawer has a single header, Escape and scroll lock; verify no overflow at 360/390/820/1024/1440
- [x] 4.5 Hide unconfigured OAuth providers and toast sign-in errors

## 5. Live preview

- [x] 5.1 Container-query layouts, fixed table/grid spans, zoom wrapper, fullscreen toggle, inspector scroll offset; verify mobile frame on desktop has no overflow
- [x] 5.2 Deterministic sample data, working switches/checkboxes, avatars with initials, readable destructive badge; verify no hydration warnings
- [x] 5.3 Add palette strip, charts on chart-1..5, app shell using sidebar tokens and menu settings, typography and expanded component gallery; verify each renders in light and dark
- [x] 5.4 Preview icons follow the selected icon library, size and stroke

## 6. Verification and docs

- [x] 6.1 Run lint, typecheck and build; run the browser checks at all widths with zero console errors
- [x] 6.2 Update README for presets, exports and environment
- [x] 6.3 Expose design token exports (W3C, Figma, Style Dictionary, CSS-in-JS, Tailwind config) generated from the resolved theme; verify the Tokens tab shows the current palette

## Workflow follow-up

- Archive the change once merged so the capability specs move to `openspec/specs/`.
