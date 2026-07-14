# MainStore

A full-stack e-commerce platform with a customer storefront, admin dashboard, and Cloudflare Workers API.

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────────┐
│   Store     │     │   Admin     │     │       Server         │
│  Astro SSR  │────▶│ React + Ant │────▶│  Hono on CF Workers  │
│  :5174      │     │ Design :5173│     │  :8787               │
└─────────────┘     └─────────────┘     └──────────┬───────────┘
                                                   │
                                    ┌──────────────┼──────────────┐
                                    ▼              ▼              ▼
                                 Neon DB        Clerk Auth    Drizzle ORM
```

| App | Role | Port | Stack |
|-----|------|------|-------|
| **store** | Customer storefront | `5174` | Astro 5, Clerk, localStorage cart |
| **admin** | Staff dashboard | `5173` | Vite, React 19, Ant Design, TanStack Query |
| **server** | REST API | `8787` | Hono, Cloudflare Workers, Neon, Drizzle |

---

## Prerequisites

- **Node.js** 20+
- **Neon** Postgres account — [console.neon.tech](https://console.neon.tech)
- **Clerk** application — [dashboard.clerk.com](https://dashboard.clerk.com)
- **Wrangler** (installed via `server` deps) for local Workers

---

## Repository layout

```
MainStore/
├── store/          # Customer-facing storefront (Astro)
├── admin/          # Admin / manager dashboard (React)
├── server/         # API Worker (Hono + Drizzle + Neon)
├── .vscode/        # Shared VS Code tasks (Run All Dev, DB scripts, …)
└── README.md
```

Each package has its own `package.json`, env files, and a more detailed README.

---

## Quick start

### 1. Install dependencies

```bash
cd server && npm install
cd ../store && npm install
cd ../admin && npm install
```

### 2. Configure environment

**API** — `server/.dev.vars` (copy from `.dev.vars.example`):

```txt
DATABASE_URL=postgresql://...          # Neon pooled connection string
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
SHIPPING_FLAT_CENTS=0                  # optional, cents
```

**Store** — `store/.env` (copy from `.env.example`):

```txt
PUBLIC_API_URL=http://localhost:8787
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Admin** — `admin/.env` (copy from `.env.example`):

```txt
VITE_API_URL=http://localhost:8787
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Use the **same Clerk application** for all three packages.

### 3. Database

From `server/`:

```bash
# Prefer a clean reset in local/dev (drop → migrate → seed)
npm run db:reset

# Or seed only if schema already exists
npm run db:seed
```

| Script | What it does |
|--------|----------------|
| `npm run db:reset` | Drop tables/enums, apply Drizzle migrations, then seed |
| `npm run db:seed` | Clear seedable tables and insert demo catalog/orders |
| `npm run db:push` | Push schema via drizzle-kit (dev only; can fail on enum/column conflicts) |
| `npm run db:generate -- --name <slug>` | Create a named migration |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Open Drizzle Studio |

**Seed contents (demo data):** 3 users, 16 categories, 22 products, 42 variants, 3 orders, 6 order items.

> Seeded user rows use **placeholder** Clerk IDs. They are not login accounts. See [Authentication & roles](#authentication--roles).

### 4. Run everything

**VS Code / Cursor** — press `Ctrl+Shift+B` (default build task **Run All Dev**), or run the task from the Command Palette.

**Or manually** (three terminals):

```bash
cd server && npm run dev   # http://localhost:8787
cd store  && npm run dev   # http://localhost:5174
cd admin  && npm run dev   # http://localhost:5173
```

| URL | App |
|-----|-----|
| http://localhost:5174 | Storefront |
| http://localhost:5173 | Admin dashboard |
| http://localhost:8787 | API (`GET /` → `MainStore API`) |

---

## Authentication & roles

Clerk handles **identity** (sign-in / sign-up). Authorization lives in Neon on `users.role`:

| Role | Access |
|------|--------|
| `customer` | Storefront checkout & own orders (default on first login) |
| `manager` | Admin orders (view / update status) |
| `admin` | Full admin: products, categories, users, orders |

### How to sign in

1. Open **http://localhost:5174/sign-in** (store) or **http://localhost:5173/sign-in** (admin).
2. Create or sign in with a real Clerk account (email/password, Google, etc. — whatever you enabled in Clerk).
3. The API upserts your user on first authenticated request (`GET /me`). New users get role `customer`.

### Become an admin (first bootstrap)

Seeded emails like `admin@mainstore.com` **cannot** be used to log in.

After you sign in once:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'you@example.com';
```

Or open Drizzle Studio (`npm run db:studio` in `server/`) and set `role` to `admin` on your row.

Then refresh the admin app — you should see the dashboard.

Optional: put your real Clerk `user_…` id into `server/scripts/seed.ts` so `db:reset` recreates you as admin automatically.

---

## Apps at a glance

### Store (`store/`)

SSR catalog and checkout for customers.

| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Product catalog |
| `/products/:id` | No | Product detail + add to cart |
| `/cart` | No | Cart (browser `localStorage`, key `mainstore-cart`) |
| `/checkout` | Yes | Place order |
| `/checkout/success` | Yes | Confirmation |
| `/orders` | Yes | Order history |
| `/orders/:id` | Yes | Order detail |
| `/sign-in` | No | Clerk sign-in |

Cart is client-side only. Checkout posts line items to `POST /checkout`; stock is validated and decremented on the server. Online payment is **not** integrated yet.

More detail: [`store/README.md`](store/README.md)

### Admin (`admin/`)

Staff UI gated to `admin` (and order tools also usable by `manager` where the API allows).

Features: dashboard, products (+ variants), categories, orders, users / role assignment.

More detail: [`admin/README.md`](admin/README.md)

### Server (`server/`)

Hono API on Cloudflare Workers. Layered modules: **Route → Service → Repository → Neon**.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/` | Public | Health text |
| `GET` | `/catalog` | Public | Enabled products |
| `GET` | `/catalog/:id` | Public | Product detail |
| `GET` | `/categories` | Public | Category list |
| `POST` | `/categories` | Admin | Create category |
| `GET/POST/PATCH/DELETE` | `/products…` | Admin | Product & variant CRUD |
| `GET` | `/me` | Signed in | Sync Clerk user → Neon |
| `GET` | `/users` | Admin | List users |
| `PATCH` | `/users/:id/role` | Admin | Change role |
| `POST` | `/checkout` | Customer | Place order |
| `GET` | `/orders` | User | Own orders (all for admin/manager) |
| `GET` | `/orders/:id` | User | Order detail |
| `PATCH` | `/orders/:id/status` | Admin/Manager | Update status |

More detail: [`server/README.md`](server/README.md)

---

## VS Code tasks

Defined in [`.vscode/tasks.json`](.vscode/tasks.json):

| Task | Action |
|------|--------|
| **Run All Dev** | `store`, `server`, and `admin` dev servers in parallel (default build) |
| **Build All** | Build store + admin in parallel |
| `server: db:seed` / `server: db:reset` | Seed or full DB reset |
| Per-package `dev` / `build` / `preview` / lint | Individual scripts |

Run via **Terminal → Run Task…** or `Ctrl+Shift+B` for Run All Dev.

---

## Database notes

- **Runtime driver:** `@neondatabase/serverless` (HTTP) on the Worker.
- **Reset / migrations script:** uses `pg` (node-postgres) for reliable DDL; `drizzle-kit push --force` is unreliable non-interactively on enum/column conflicts.
- Prefer `npm run db:reset` locally when you want a known-good schema + demo data.
- Migrations live in `server/drizzle/`. Always name new ones:

  ```bash
  npm run db:generate -- --name add_something_descriptive
  ```

---

## Production (API)

```bash
cd server
npm run deploy
npx wrangler secret put DATABASE_URL
npx wrangler secret put CLERK_SECRET_KEY
npx wrangler secret put CLERK_PUBLISHABLE_KEY
```

Point `store` and `admin` env URLs at the deployed Worker URL.

---

## Architecture rules

Each app documents its conventions under `*/docs/rules.md`:

- [`server/docs/rules.md`](server/docs/rules.md) — routes / services / repositories, RBAC
- [`store/docs/rules.md`](store/docs/rules.md) — feature folders
- [`admin/docs/rules.md`](admin/docs/rules.md) — hybrid feature modules + React Query / Zustand

---

## License

Private / unpublished unless otherwise noted.
