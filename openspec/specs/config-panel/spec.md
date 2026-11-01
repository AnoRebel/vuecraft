# config-panel Specification

## Purpose

Keep the configuration panel easy to scan: settings grouped by purpose into tabs, compact controls, and search that jumps to any setting.

## Requirements

### Requirement: Tabbed organisation

The panel SHALL group settings into the tabs Themes, Colors, Style, Type, Motion, Layout and Export, show one tab at a time with its own scroll position, and remember the last active tab.

#### Scenario: Switching tabs

- **WHEN** the user selects the Motion tab and reloads
- **THEN** the Motion tab is active and only motion settings are shown

### Requirement: Compact controls

Choices with few options SHALL be rendered as segmented controls and advanced settings SHALL be collapsible, so no tab needs more than about two screens of scrolling at 900px height.

#### Scenario: Style tab height

- **WHEN** the Style tab is opened at 1440x900 with advanced groups collapsed
- **THEN** its content fits within two viewport heights

### Requirement: Settings search

Typing in the search field SHALL list matching settings from every tab; choosing a result SHALL activate its tab and scroll the setting into view.

#### Scenario: Find radius

- **WHEN** the user searches "radius" and picks the result
- **THEN** the Style tab opens with the radius setting in view

### Requirement: All functionality retained

Every setting available before the reorganisation SHALL remain available, along with shuffle, reset, per-tab section visibility and ordering, and the guided tour.

#### Scenario: Hidden section

- **WHEN** the user hides the Palette generator section from the section settings
- **THEN** the Colors tab no longer shows it and showing it again restores it
