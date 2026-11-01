# Design

## Context

`bun outdated` reports every dependency at its latest version except TypeScript (6.0.3 vs 7.0.2). After the upgrade, `nuxt typecheck` failed on the drag-and-drop API, the auth runtime config and the OAuth handler event types.

## Decisions

### Drag and drop: provider + child zone component

`makeDroppable` / `makeDraggable` inject the provider context, so they must run in a component rendered _inside_ `<DnDProvider>`. `SortableSectionList` now only renders the provider; a new `SortableSectionZone` owns the drop zone and computes the new order with `event.helpers.suggestSort('vertical')`. Items register `() => [index, items]` as their payload and use a dedicated grip handle (`dragHandle`) with a 4px activation distance so clicks on the switch are not hijacked.

### Auth secret

`nuxt-auth-utils` 0.6 derives its sealing key from Nuxt's `appSecret` (`NUXT_APP_SECRET`). Development generates one automatically; production builds do not, so `docker-compose.yml` now fails fast with a clear message when the variable is missing rather than shipping a shared default secret.

### TypeScript 7

TypeScript 7 (native Go compiler) ships without the JS compiler API used by `vue-tsc`; the Vue language tools team recommends staying on 6.x until TS 7.1 content mappers land. TypeScript stays pinned to `^6`.

## Risks / Trade-offs

- All existing sessions are logged out once (cookie renamed to `nuxt-auth-session`). Acceptable: the auth store is in-memory demo storage.
