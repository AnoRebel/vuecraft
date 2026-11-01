## Purpose

Let users design the motion of their theme - timing, easing and entrance effects - see it in the preview, and take it with the export.

## ADDED Requirements

### Requirement: Motion settings in the configuration

Duration, easing, entrance effects and reduced motion SHALL be stored in the configuration so they persist, are included in share links and imports, and can be undone.

#### Scenario: Persisted easing

- **WHEN** the user picks the Spring easing and reloads
- **THEN** Spring is still selected

### Requirement: Exact duration and custom easing

The user SHALL set an exact duration between 0 and 1000 ms and choose an easing preset or a custom cubic-bézier curve whose shape is drawn as it changes. Choosing an animation speed preset SHALL clear the exact duration.

#### Scenario: Custom curve

- **WHEN** the user edits the bézier control points
- **THEN** the curve preview updates and the easing becomes the matching `cubic-bezier()` value

### Requirement: Motion applies to the preview

Preview transitions SHALL use the configured duration and easing, and preview content SHALL enter with the enabled effects when switching templates or opening content.

#### Scenario: Slow transitions

- **WHEN** the duration is 600 ms
- **THEN** transitions inside the preview take 600 ms

#### Scenario: Reduced motion

- **WHEN** reduced motion is enabled
- **THEN** preview transitions and entrance animations are disabled

### Requirement: Replayable demo

The Motion section SHALL include a demo that replays the entrance animation with the current settings.

#### Scenario: Replay

- **WHEN** the user presses Play
- **THEN** the demo animates with the configured effects, duration and easing

### Requirement: Motion in exports

The shadcn-vue and Tailwind exports SHALL include the default transition duration and timing function, an `animate-enter` utility with its keyframes, and a `prefers-reduced-motion` rule.

#### Scenario: Export

- **WHEN** the user exports for shadcn-vue
- **THEN** the CSS defines `--animate-enter` and `@keyframes enter` using the configured duration and easing
