# theme-persistence Specification

## Purpose

Keep a user's configuration across reloads, share it through links and JSON, store named configurations, and step back and forth through changes.

## Requirements

### Requirement: Complete serialisation

Share links, JSON export/import and saved configurations SHALL include every configuration group, including export settings and imported tokens, and SHALL reflect the latest state at the time they are produced.

#### Scenario: Share after edits

- **WHEN** the user shuffles the theme three times and opens the share dialog
- **THEN** the link and JSON describe the current theme

### Requirement: URL-safe share code

The share code SHALL be URL-safe and decoding SHALL accept codes produced by earlier versions.

#### Scenario: Round trip

- **WHEN** a share link is opened in a new browser
- **THEN** the full configuration is restored

### Requirement: Shared link does not override later edits

After a configuration is loaded from a share link, the code SHALL be removed from the address bar so later edits persist across reloads.

#### Scenario: Edit after opening a link

- **WHEN** the user opens a share link, changes the accent and reloads
- **THEN** the changed accent is shown

### Requirement: Undo and redo

The system SHALL record configuration changes and provide undo and redo through toolbar buttons and Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y.

#### Scenario: Undo a change

- **WHEN** the user changes the accent and presses Ctrl+Z
- **THEN** the previous accent is restored

### Requirement: Defaults are never mutated

Loading, importing and resetting SHALL operate on copies so that resetting always restores the original defaults.

#### Scenario: Reset after import

- **WHEN** the user imports a configuration, changes export settings, and resets
- **THEN** the export settings return to their defaults
