## Purpose

Let users start from curated themes - built-in presets, tweakcn presets and Crystal Neuo materials - and colour tools whose results become part of the saved configuration.

## ADDED Requirements

### Requirement: Presets are part of the configuration

Applying any preset SHALL write its values into the configuration, so the preset is previewed in light and dark mode, exported, shared, persisted and undoable.

#### Scenario: tweakcn preset in dark mode

- **WHEN** the user applies a tweakcn preset and switches to dark mode
- **THEN** the preview uses the preset's dark palette

#### Scenario: Preset survives reload and share

- **WHEN** the user applies a preset, reloads, and opens the share link in a new browser
- **THEN** both show the preset's colours

### Requirement: Built-in presets reset unrelated settings

A built-in preset SHALL reset theme, typography and component settings to their defaults before applying its own values, and SHALL clear tokens imported from other presets. Icon, layout and export settings are kept.

#### Scenario: Switching from an imported preset

- **WHEN** the user applies a Crystal Neuo preset and then the Default built-in preset
- **THEN** the palette, radius, fonts and shadows return to the Default preset values

### Requirement: Crystal Neuo materials

The system SHALL offer one preset per Crystal Neuo material (Refraction, Tactile, Signal, Folio, Bloom, Hybrid) carrying its light and dark palette, radius, fonts, shadows and border width.

#### Scenario: Tactile material

- **WHEN** the user applies Crystal Neuo Tactile
- **THEN** cards render with ink borders of the material's width and hard offset shadows

### Requirement: Manual edits take precedence

Changing a control after applying a preset SHALL override the matching preset token while keeping the others.

#### Scenario: Radius after preset

- **WHEN** the user applies a preset and then picks a different radius
- **THEN** the new radius is used and the preset palette is kept

### Requirement: Colour tools write to the configuration

Custom primary colour, palette generator "Apply" and accessibility "Fix" actions SHALL store their colours in the configuration instead of only styling the page.

#### Scenario: Accessibility fix persists

- **WHEN** the user applies an accessibility fix and reloads
- **THEN** the fixed colour is still applied and appears in the export
