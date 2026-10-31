# Proposal

## Why

The dependency refresh moved several packages across major/minor versions with breaking APIs. The app no longer typechecks, the section reordering list cannot load (`@vue-dnd-kit/core` v2 removed its v1 exports), and authentication logs a deprecation warning on every boot because `nuxt-auth-utils` 0.6 no longer reads the session password.

## What Changes

- Migrate the section reorder list from the removed `useDraggable` / `useDroppable` / `DnDOperations` / default plugin API to the v2 `DnDProvider` + `makeDraggable` / `makeDroppable` API, and drop the now-invalid global plugin.
- **BREAKING (ops)**: sessions are sealed with `NUXT_APP_SECRET` instead of `NUXT_SESSION_PASSWORD`; existing sessions are invalidated once. Update `.env.example`, `docker-compose.yml` and the README.
- Import `sendRedirect` / `createError` from `nuxt/server` in OAuth, WebAuthn and email auth handlers and use `status` instead of the deprecated `statusCode`.
- Rename the design-token exporter's local `ExportFormat` type to `TokenExportFormat` so it no longer collides with the shared config type in auto-imports.
- Fix the lint error in the brand color extractor (useless initial assignment) and map low-chroma brand colors to the neutral accent.
- Keep TypeScript on 6.x: TypeScript 7 removed the programmatic compiler API that `vue-tsc` depends on.

## Capabilities

### New Capabilities

None - this change preserves existing behavior.

### Modified Capabilities

None.

## Impact

- `components/config/SortableSection*.vue`, `plugins/vue-dnd-kit.client.ts` (removed)
- `server/api/auth/*`, `server/api/webauthn/*`, `nuxt.config.ts`
- `utils/designTokenExporter.ts`, `composables/useBrandColorExtractor.ts`
- Deployment env: `NUXT_APP_SECRET` is now required in production builds.
