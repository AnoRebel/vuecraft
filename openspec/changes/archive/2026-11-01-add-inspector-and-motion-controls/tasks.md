# Tasks

## 1. Motion

- [x] 1.1 Add motion fields to the configuration with defaults and keep old configurations loading; verify `nuxt typecheck`
- [x] 1.2 Resolve duration/easing/effects in `resolveTheme`, apply them to the preview runtime CSS and add entrance animations; verify a 600 ms duration changes preview transition timing
- [x] 1.3 Rebuild `useAnimationCustomizer` on the configuration and add the Motion section (duration, easing presets, custom bézier with curve, effects, reduced motion, demo); verify settings persist after reload
- [x] 1.4 Export motion in shadcn-vue and Tailwind CSS; verify `--animate-enter` and `@keyframes enter` in the export

## 2. Inspector

- [x] 2.1 Shared inspector state with hover and pinned elements; capture clicks while inspecting; verify a pinned button's handler does not run
- [x] 2.2 Inspector panel with breadcrumb, ArrowUp parent selection, box model, theme tokens with contrast, classes and snippet copy; verify a default button reports `primary` / `primary-foreground`
- [x] 2.3 Escape unpins then exits; panel works as a bottom sheet on phones; verify at 390 px

## 3. Verification and docs

- [x] 3.1 Lint, format, typecheck, build and browser checks pass with no console errors
- [x] 3.2 Document the inspector and motion settings in the README
- [x] 3.3 Declare Tailwind's layer order at the top of the runtime theme CSS so a cached theme injected before Tailwind's stylesheet cannot demote utilities below the reset; verify a reload with a stored theme keeps button padding and background

## Workflow follow-up

- Archive the change once merged so the capability specs move to `openspec/specs/`.
