# Design

## Layout

A 56px vertical rail (icon + short label, `role="tablist"`, arrow-key navigation) beside the tab content. The header keeps the panel actions (search, section settings, shuffle, reset, close). The active tab is stored in `localStorage`.

## Grouping

| Tab    | Sections                                                                     |
| ------ | ---------------------------------------------------------------------------- |
| Themes | Presets                                                                      |
| Colors | Colors (base, accent, custom primary), Palette generator*, Contrast check*   |
| Style  | Component style, radius (+ exact radius*), shadow, border width, focus ring* |
| Type   | Typography, Icons                                                            |
| Motion | Speed, duration, easing, effects, reduced motion                             |
| Layout | Spacing, container, sidebar/header, menu, Effects*                           |
| Export | Output settings, Component selection                                         |

`*` collapsed by default. `ThemeConfig` and `ComponentsConfig` are split into `ColorsConfig` and `StyleConfig`; menu settings move to Layout and animation speed to Motion.

## Controls

`OptionPicker` renders a segmented control (wrapping when needed) and shows the selected option's description below it. `ConfigSection` becomes a light collapsible group. Accent swatches become small circles.

## Section settings

Section ids are stored per user as before. Stored layouts are migrated: retired ids (`theme`, `components`) are dropped and new sections are inserted in their default position. Sections render inside their own tab in stored order.

## Search

A static index of settings (label, keywords, tab, element id) drives the search results; choosing one switches tab, opens collapsed groups containing the target, scrolls it into view and briefly highlights it.

## Tour

Tour steps for configuration areas target the rail buttons, which are always visible.
