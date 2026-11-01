# Tasks

## 1. Panel structure

- [x] 1.1 Tab rail with remembered active tab, keyboard navigation and per-tab scrolling; verify the tab survives a reload
- [x] 1.2 Split ThemeConfig/ComponentsConfig into ColorsConfig and StyleConfig; move menu settings to Layout and animation speed to Motion; verify every previous setting is reachable
- [x] 1.3 Migrate stored section layouts and render sections per tab; verify hiding and showing a section

## 2. Compact controls

- [x] 2.1 Segmented OptionPicker, light collapsible ConfigSection, compact swatches and preset tiles; verify Style tab fits within two viewport heights

## 3. Search and tour

- [x] 3.1 Settings search across tabs that jumps to a setting; verify "radius" opens Style with radius in view
- [x] 3.2 Point tour steps at the rail buttons; verify the tour steps highlight visible elements

## 4. Verification

- [x] 4.1 Lint, format, typecheck, build and the browser suites pass at desktop and phone widths
- [x] 4.2 Put icon CSS in Tailwind's base layer so size utilities apply to icons; verify rail and toolbar icons render at their utility size
- [x] 4.3 Record separate history steps for changes more than 100 ms apart; verify two toggles 400 ms apart undo one at a time
