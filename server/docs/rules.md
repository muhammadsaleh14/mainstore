# Architecture rules

Each rule below should be within one line.

- Routes live in `src/routes/` and handle HTTP only (params, status codes, JSON responses).
- Routes must call a service; they must not contain business logic or database access.
- Services live in `src/modules/<name>/<name>.service.ts` and orchestrate use cases.
- Services call repositories and utils; they must not import Drizzle query builders directly.
- Repositories live in `src/modules/<name>/<name>.repository.ts` and are the only layer that runs Drizzle queries.
- Utils live in `src/modules/<name>/<name>.util.ts` for pure helpers, transforms, and complex business logic.
- Schemas live in `src/db/schema/` (Drizzle table definitions); repositories import table definitions from there.
- API request validation (Zod) lives in `src/modules/<name>/<name>.dto.ts`; routes import DTOs from there.
- One module per domain (e.g. `product`, `user`); add new features as new modules, not inside routes.
- When generating a migration, always pass `--name` with a short descriptive slug (e.g. `add_product_variants`); never use auto-generated names.
- Roles live in Neon `users.role` (`admin` | `manager` | `customer`); Clerk handles identity only, not authorization.
- Protect routes with `requireAuth` then `requireRole(...)`; never check roles inside repositories or routes by hand.
- Role assignment and lookups go through `user.service`; role validation helpers live in `user.util`.
- Login sync must never overwrite an existing role (only set the `customer` default on first insert).
- Do not run commands from agent

## Migrations

Always name migrations when generating:

```txt
npm run db:generate -- --name add_product_variants
npm run db:migrate
```

Use `snake_case` names that describe the change (e.g. `add_categories`, `add_product_images`).

## Request flow

```
Route → Service → Repository → Database (Neon via Drizzle)
              ↘ Util (helpers / business rules)
```

## Example module layout

```
src/modules/product/
  product.repository.ts   # findAllProducts(), createProduct(), ...
  product.service.ts        # listProducts(), createProduct(), ...
  product.dto.ts            # Zod schemas for API request bodies
  product.util.ts           # toProductResponse(), validateProduct(), ...
```

Order module follows the same layout (`order.dto.ts`, `order.util.ts`, `order.response.ts`, etc.).
