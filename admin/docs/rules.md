# Admin Panel - Engineering Rules & Conventions

These rules are mandatory for all contributors to the admin panel. They keep the
codebase predictable, reviewable, and safe. Treat any deviation as a blocker in
code review unless explicitly agreed in the PR description.

Each rule below is intentionally short. When in doubt, follow the existing
patterns in `src/features/users/` and `src/features/products/`.

## Operating rules

- Do not run commands from the agent; the developer runs all installs, builds, and dev servers.
- Never commit secrets; the only env file committed is `.env.example`. Real keys live in `.env` (gitignored).
- Only the Clerk publishable key (`pk_...`) belongs in this app; the secret key (`sk_...`) must never appear in the frontend.

## Project structure

- The app is feature-based: every domain lives under `src/features/<feature>/`.
- A feature owns three subfolders: `api/` (HTTP calls), `hooks/` (React Query), `pages/` (screens).
- Cross-feature, reusable building blocks live in top-level layers: `components/`, `layouts/`, `lib/`, `stores/`, `config/`, `types/`, `routes/`.
- Never import from another feature's internals; share via `components/`, `lib/`, `hooks/`, or `types/` instead.
- One responsibility per file; co-locate a component with its feature, not in a global `components/` unless it is truly shared.

## Imports & naming

- Always import via the `@/` alias (e.g. `@/lib/api-client`); never use deep relative paths like `../../../lib`.
- Components and pages use PascalCase filenames (`UsersPage.tsx`); hooks use camelCase with a `use` prefix (`useUsers.ts`).
- API modules are named `<feature>.api.ts`; stores are named `<name>.store.ts`.
- Name React Query hooks by intent: `use<Thing>` for reads, `use<Verb><Thing>` for mutations (e.g. `useUpdateUserRole`).

## Data fetching (server state)

- All server state goes through TanStack Query; never store fetched API data in Zustand or `useState`.
- Components must not call `apiClient` directly; they call a hook, the hook calls the feature's `api/` function.
- Every `api/` function is typed with an explicit return type and returns `data` (not the raw axios response).
- Declare query keys as a stable constant per feature (e.g. `const USERS_KEY = ['users']`) and reuse it for invalidation.
- After a successful mutation, invalidate the affected query keys; do not manually mutate the cache unless justified.
- Use `App.useApp()` `message` for success/error feedback in mutations; never use the static `message` import.

## Client state (UI only)

- Zustand holds only UI/local state (sidebar, theme, modals); it must never hold server data.
- Keep stores small and typed; persist only what should survive reload, via the `persist` middleware with a namespaced key.

## API & auth

- All HTTP goes through the shared `apiClient` in `@/lib/api-client`; do not create new axios instances.
- The Clerk token is injected centrally by the request interceptor; never attach `Authorization` headers manually.
- Read config only from `@/config/env`; never reference `import.meta.env` directly in feature code.
- Treat the API as the source of truth for authorization; the UI must handle `401`/`403`/`500` gracefully, not assume success.

## Routing & access control

- Register routes only in `src/routes/router.tsx`; do not scatter `createBrowserRouter` calls.
- Authenticated areas render behind `ProtectedRoute`; admin-only content renders behind `RoleGuard`.
- Never gate access using client-side role checks alone for security; the API enforces roles, the UI only reflects them.

## UI components

- Use Ant Design components; do not introduce another UI library or hand-rolled equivalents of existing antd components.
- Theme via the `ConfigProvider` algorithm and design tokens; avoid hardcoded colors, prefer antd tokens.
- Every list screen handles all three states explicitly: loading, error, and empty.
- Use the shared `PageHeader` for screen titles; keep page layout consistent across features.

## TypeScript

- `strict` mode stays on; never use `any`, `@ts-ignore`, or non-null assertions to silence the compiler.
- Shared API response shapes live in `@/types/api.ts`; keep them in sync with the server's response types.
- Type all function boundaries (props, hook returns, api functions); let inference handle local variables.

## Quality gates

- `npm run build` (tsc + vite) must pass with zero type errors before a PR is opened.
- `npm run lint` must pass; do not disable lint rules inline without a comment explaining why.
- No `console.log` in committed code except intentional, justified warnings.

## Adding a new feature (checklist)

```
src/features/<feature>/
  api/<feature>.api.ts     # typed HTTP calls via apiClient
  hooks/use<Feature>.ts    # React Query reads + mutations
  pages/<Feature>Page.tsx  # screen, handles loading/error/empty
```

1. Add shared types to `@/types/api.ts`.
2. Add the route in `src/routes/router.tsx` (behind `ProtectedRoute`/`RoleGuard` as needed).
3. Add a menu item in `src/layouts/DashboardLayout.tsx` if it needs navigation.
