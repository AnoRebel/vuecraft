## Purpose

Show how the configured theme looks on realistic screens and components, at any device width, so users can judge a theme before exporting it.

## ADDED Requirements

### Requirement: Content reflows to the preview width

Preview templates SHALL lay out according to the width of the preview frame, not the browser window, so device presets show the true mobile, tablet and desktop layout.

#### Scenario: Mobile frame on desktop

- **WHEN** the user selects the mobile device preset on a wide screen
- **THEN** the preview stacks into a single column with no horizontal overflow

### Requirement: Zoom and fullscreen

Zoom SHALL scale the preview frame and its occupied space in every mode, and a fullscreen control SHALL show the preview without the builder chrome until dismissed.

#### Scenario: Zoom out

- **WHEN** the user zooms to 50%
- **THEN** the frame is rendered at half size without leaving blank space for its unscaled size

### Requirement: Deterministic sample data

Sample data SHALL be identical on the server and the client.

#### Scenario: First load

- **WHEN** the page is server-rendered and hydrated
- **THEN** no hydration mismatch is reported

### Requirement: Theme coverage

The preview SHALL show every token group: a palette strip with contrast ratios, charts using chart-1 to chart-5, an application shell using the sidebar tokens, typography, and interactive components including buttons, badges, alerts, inputs, checkboxes, radios, switches, sliders, selects, tabs, tables, avatars, progress, skeletons, accordions, dialogs, tooltips and toasts.

#### Scenario: Interactive controls

- **WHEN** the user clicks a switch, checkbox or tab in the preview
- **THEN** its state changes

### Requirement: Element inspector alignment

The element inspector SHALL highlight the hovered element at its actual position, including after the preview has scrolled.

#### Scenario: Scrolled preview

- **WHEN** the user scrolls the preview and hovers an element with the inspector on
- **THEN** the highlight box covers that element
