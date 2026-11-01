# Proposal

## Why

The configuration panel renders every section in one column - about 8,700px of scrolling at desktop width - with large tile buttons for every option. Related settings are split across sections (radius and shadow sit with colours, animation speed with components), and finding a single setting means scrolling or guessing a category filter.

## What Changes

- Organise settings into seven tabs on a vertical rail: Themes, Colors, Style, Type, Motion, Layout and Export. Each tab scrolls on its own and the active tab is remembered.
- Regroup settings by purpose: colours (base, accent, custom primary, palette generator, contrast check), style (component style, radius, shadow, borders, focus ring), type (fonts, scale, weights, icons), motion (speed, duration, easing, effects), layout (spacing, container, sidebar/header, menu, effects), export (target, format, prefix, components).
- Replace tile grids with compact segmented controls and smaller swatches; move advanced settings into collapsible groups.
- Settings search lists matching settings across all tabs and jumps to the chosen one.
- Keep shuffle, reset, section visibility/reordering (now within each tab) and the guided tour.

## Capabilities

### New Capabilities

- `config-panel`: organisation, navigation and search of the configuration panel.

### Modified Capabilities

None.

## Impact

- `components/config/*` (new `ColorsConfig`, `StyleConfig`, `SettingsSearch`; restyled `ConfigSection`, `OptionPicker`, `ColorPicker`, `PresetThemes`; `ThemeConfig` and `ComponentsConfig` replaced)
- `composables/useAppTour.ts`
