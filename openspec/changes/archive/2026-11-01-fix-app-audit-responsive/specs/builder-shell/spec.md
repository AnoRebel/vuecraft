## Purpose

Provide a builder interface that is usable and accessible from small phones to large desktops, with every tool reachable.

## ADDED Requirements

### Requirement: Responsive layout

The builder SHALL have no horizontal page overflow and no clipped controls from 360px to 1920px wide; floating buttons and the footer SHALL NOT cover preview or drawer content.

#### Scenario: Tablet width

- **WHEN** the window is 1024px wide
- **THEN** all preview header controls are visible

#### Scenario: Phone drawer

- **WHEN** the configuration drawer is open on a 390px phone
- **THEN** its last section can be scrolled fully into view and it closes with Escape, the close button or the backdrop

### Requirement: Accessible overlays

Dialogs, selects, tabs and tooltips SHALL expose correct ARIA roles, trap and restore focus where modal, close on Escape, and render above the rest of the interface.

#### Scenario: Dialog keyboard use

- **WHEN** a dialog is open and the user presses Escape
- **THEN** the dialog closes and focus returns to the control that opened it

#### Scenario: User menu

- **WHEN** a signed-in user opens the user menu
- **THEN** the menu is above the preview and "Sign out" can be clicked

### Requirement: Reachable tools

Theme gallery, theme comparison, brand colour import, colour palette, accessibility checker, colour blindness simulation and keyboard shortcuts SHALL be reachable from the toolbar on every screen size, and gallery Apply and Fork SHALL work.

#### Scenario: Gallery apply

- **WHEN** the user applies a gallery theme
- **THEN** the configuration changes to that theme

### Requirement: Keyboard shortcuts

Documented shortcuts SHALL work: open export, import, share, toggle dark mode, randomize, undo, redo and show the shortcuts dialog, and SHALL NOT fire while typing in a field.

#### Scenario: Shortcuts dialog

- **WHEN** the user presses Shift+?
- **THEN** the keyboard shortcuts dialog opens

### Requirement: Sign-in feedback

Social sign-in options SHALL only be offered when the provider is configured, and a failed sign-in SHALL show an error message.

#### Scenario: OAuth failure

- **WHEN** the app loads with an `error` query parameter from a failed sign-in
- **THEN** an error toast is shown and the parameter is removed
