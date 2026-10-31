## Purpose

Turn a design-system configuration into one resolved set of design tokens and apply it consistently to the builder, the live preview, and every export format.

## ADDED Requirements

### Requirement: Single resolved token set

The system SHALL derive colours (light and dark), radius, fonts, shadows, border width and motion from the configuration through one resolution step, and the runtime theme and all exporters SHALL use that same result.

#### Scenario: Preview and export agree

- **WHEN** a user picks an accent, radius and font and opens the export dialog
- **THEN** the exported CSS contains the same primary colour, radius and font stack that the preview renders

#### Scenario: Imported tokens override generated ones

- **WHEN** the configuration contains custom tokens from a preset
- **THEN** those tokens replace the generated palette, radius, fonts, shadows and border width in both the preview and the exports

### Requirement: Every control has a visible effect

Each configuration control SHALL change the rendered preview: font scale, heading weight, body line height, spacing scale, component style, border width, animation speed, focus ring width and offset, icon size, stroke and library, container width, sidebar width, header height, menu colour, menu accent, shadow intensity, base colour, accent and radius.

#### Scenario: Shadow intensity

- **WHEN** the user switches shadow intensity from Default to None
- **THEN** cards in the preview render without a shadow

#### Scenario: Spacing and font scale

- **WHEN** the user selects the Spacious spacing scale and the Spacious font scale
- **THEN** paddings, gaps and text sizes inside the preview grow while the builder chrome keeps its size

#### Scenario: Neutral accent

- **WHEN** the user picks a neutral accent that differs from the base colour
- **THEN** the primary colour changes to that neutral family's primary

### Requirement: Readable foregrounds

The system SHALL guarantee a legible foreground on destructive and custom primary fills by choosing the higher-contrast of near-white and near-black when the palette does not provide a distinct foreground.

#### Scenario: Destructive badge

- **WHEN** a destructive badge or button is rendered with any palette
- **THEN** its text contrast against its fill is greater than 1:1 and uses the readable foreground

### Requirement: Fonts are loaded

The system SHALL load the selected sans, heading and mono families on demand so the chosen typeface actually renders.

#### Scenario: Selecting a font

- **WHEN** the user selects a sans family that is not bundled
- **THEN** the font is requested and the preview renders with that family once loaded

### Requirement: Dark mode follows the toggle

Dark-mode tokens and `dark:` variants SHALL follow the builder's colour-mode toggle rather than the operating system preference, and SHALL survive a reload without a flash of the light theme.

#### Scenario: Toggle and reload

- **WHEN** the user enables dark mode and reloads the page
- **THEN** the first paint uses the stored theme in dark mode

### Requirement: Standard export formats

The shadcn-vue export SHALL declare raw tokens on `:root`/`.dark` and map them to Tailwind utilities with `@theme inline`; the Tailwind export SHALL declare tokens in `@theme`; the Nuxt UI export SHALL set `--ui-*` variables. An optional variable prefix SHALL be applied to raw token names.

#### Scenario: shadcn-vue CSS

- **WHEN** the user exports for shadcn-vue
- **THEN** the CSS contains `--background` on `:root` and `--color-background: var(--background)` inside `@theme inline`, with no self-referencing declarations
