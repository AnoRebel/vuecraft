# preview-inspector Specification

## Purpose

Let users inspect any element of the live preview to understand how the theme styles it and to copy its markup.

## Requirements

### Requirement: Pin an element

With the inspector enabled, clicking or tapping a preview element SHALL pin it, keep it highlighted, and open the inspector panel without triggering the element's own action.

#### Scenario: Pin a button

- **WHEN** the inspector is on and the user clicks a preview button
- **THEN** the button stays highlighted, the panel opens for it, and the button's click handler does not run

### Requirement: Navigate the element tree

The panel SHALL show the pinned element's ancestor path inside the preview and SHALL let the user select an ancestor, including with the ArrowUp key.

#### Scenario: Select parent

- **WHEN** an element is pinned and the user presses ArrowUp
- **THEN** its parent element becomes the pinned element

### Requirement: Theme token report

The panel SHALL list which theme colour tokens the element's text, background and border resolve to, with swatches, and the contrast ratio between its text and background.

#### Scenario: Primary button

- **WHEN** a default button is pinned
- **THEN** the panel reports its background as `primary` and its text as `primary-foreground` with their contrast ratio

### Requirement: Box model, classes and snippet

The panel SHALL show the element's size, margin, border and padding, its classes, and SHALL copy its classes or a markup snippet to the clipboard.

#### Scenario: Copy classes

- **WHEN** the user clicks "Copy classes"
- **THEN** the element's class list is on the clipboard

### Requirement: Dismissal

Escape SHALL unpin the element first and turn the inspector off on a second press; the panel SHALL also close from its close button.

#### Scenario: Escape twice

- **WHEN** an element is pinned and the user presses Escape twice
- **THEN** the panel closes and inspector mode ends
