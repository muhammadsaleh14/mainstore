# Storefront — Engineering Rules & Conventions

Follow the same feature-based layout as the admin panel. When in doubt, mirror `admin/src/features/`.

## Project structure

- Every domain lives under `src/features/<feature>/`.
- Route files in `src/pages/` are thin wrappers that import feature pages.
- Cross-feature shared code lives in top-level layers: `layouts/`, `lib/`, `config/`, `types/`.
- Never import from another feature's internals; share via `lib/`, `types/`, or `components/` at the top level when truly shared.

## Feature layout

```
src/features/<feature>/
  api/<feature>.api.ts       # HTTP calls (server + client)
  lib/                       # Pure helpers, transforms, client stores
  scripts/                   # Client-side init logic (cart, checkout forms)
  components/                # Feature UI pieces (.astro or .tsx islands)
  pages/<Feature>Page.astro  # Full screen (includes Layout)
```

## Examples in this repo

| Feature | api | lib / store | scripts | pages |
|---------|-----|-------------|---------|-------|
| catalog | `catalog.api.ts` | `catalog.util.ts` | `add-to-cart.ts` | `CatalogPage`, `ProductDetailPage` |
| cart | — | `cart.store.ts`, `cart.util.ts` | `cart-page.ts`, `cart-badge.ts` | `CartPage` |
| checkout | `checkout.api.ts` | `checkout.util.ts` | `checkout-page.ts` | `CheckoutPage`, `CheckoutSuccessPage` |
| orders | `orders.api.ts` | `orders.util.ts`, `orderStatus.ts` | — | `OrdersPage`, `OrderDetailPage` |
| auth | — | — | — | `SignInPage`, `UserMenu` component |

## Imports & naming

- Always use the `@/` alias (e.g. `@/features/cart/lib/cart.store`).
- API modules: `<feature>.api.ts`
- Client cart state: `cart.store.ts` (localStorage, not server data)
- Client init scripts: `scripts/<name>.ts` with `init*` entry functions

## Data fetching

- Server-rendered pages call `features/<feature>/api/*.api.ts` in the Astro frontmatter.
- Client scripts call feature `api/` functions with a Clerk token when auth is required.
- All HTTP goes through `@/lib/api-client` helpers; read base URL from `@/config/env`.
- Shared API types live in `@/types/api.ts`.

## Routing

- Register URLs only in `src/pages/`; keep those files as one-line imports.
- Protected routes are enforced in `src/middleware.ts` (Clerk) plus token checks in feature pages.

## UI

- Prefer Astro components for static/SSR markup.
- Use React islands sparingly (Clerk `UserButton` only).
- Use client `scripts/` for interactive cart and checkout flows.

## Adding a new feature

1. Add types to `@/types/api.ts` if needed.
2. Create `api/`, `pages/`, and any `lib/` or `scripts/` under `src/features/<feature>/`.
3. Add a thin route file in `src/pages/`.
4. Update nav in `src/layouts/Layout.astro` if the feature needs a menu link.
