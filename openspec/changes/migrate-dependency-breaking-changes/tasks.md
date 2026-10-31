# Tasks

## 1. Dependencies

- [x] 1.1 Install and audit dependencies with `bun install` / `bun outdated`; verify only TypeScript 7 is reported and documented as intentionally held back

## 2. Breaking API migrations

- [x] 2.1 Migrate section reordering to `@vue-dnd-kit/core` v2 (`DnDProvider`, `makeDraggable`, `makeDroppable`) and remove the v1 plugin; verify `nuxt typecheck` reports no dnd errors and sections reorder in the browser
- [x] 2.2 Replace `runtimeConfig.session.password` with `NUXT_APP_SECRET`, updating `.env.example`, `docker-compose.yml` and README; verify the boot warning is gone
- [x] 2.3 Import `sendRedirect` / `createError` from `nuxt/server` and use `status` in all auth handlers; verify `nuxt typecheck` passes
- [x] 2.4 Rename the token exporter's `ExportFormat` to `TokenExportFormat`; verify the duplicated-import warning is gone
- [x] 2.5 Fix the `no-useless-assignment` lint error; verify `bun run lint` reports 0 errors

## 3. Verification

- [x] 3.1 Run `nuxt typecheck`, `bun run lint` and `bun run build`; verify all succeed
