# MainStore API (Cloudflare Workers + Hono)

## Quick start

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

## Step 1: Neon database setup

### A. Create a Neon project (browser)

1. Open [Neon Console](https://console.neon.tech/signup) and sign up or log in.
2. Click **New Project**.
3. Use these settings:
   - **Name:** `mainstore` (or any name you like)
   - **Postgres version:** latest (default)
   - **Region:** pick one close to your users (e.g. US East if unsure)
4. Click **Create Project**.

You do **not** need to create tables yet — the default empty database is enough for now.

### B. Copy the connection string

1. On the project dashboard, click **Connect** (top right).
2. Turn **Connection pooling** **ON** (important for Cloudflare Workers).
3. Copy the full `postgresql://...` connection string.

### C. Save it locally (development)

1. Copy the example env file:

   ```txt
   copy .dev.vars.example .dev.vars
   ```

2. Open `.dev.vars` and replace the placeholder with your real connection string:

   ```txt
   DATABASE_URL=postgresql://...
   ```

   `.dev.vars` is gitignored — your secret stays on your machine.

### D. Save it for production (when you deploy)

After `npm run deploy`, set the secret on Cloudflare:

```txt
npx wrangler secret put DATABASE_URL
```

Paste the same pooled connection string when prompted.

---

## Step 2: Drizzle (database tables + API)

Packages are installed. The `products` table is defined in `src/db/schema/product.ts`.

### Create the table in Neon

```txt
npm run db:push
```

This syncs your schema to Neon (creates the `products` table).

### Run the API locally

```txt
npm run dev
```

Then open:

- `http://localhost:8787/` — API health text
- `http://localhost:8787/products` — list products (empty array at first)

### Add test products (optional)

Use Drizzle Studio — a simple web UI for your database:

```txt
npm run db:studio
```

Add rows in the `products` table, then refresh `/products`.

### Database scripts

| Command | What it does |
|---------|----------------|
| `npm run db:push` | Push schema changes to Neon (quick, good for dev) |
| `npm run db:generate -- --name <slug>` | Generate a named migration file |
| `npm run db:migrate` | Apply migration files |
| `npm run db:studio` | Open database UI in browser |

---

## Step 3: Clerk authentication

### A. Create a Clerk application

1. Open [Clerk Dashboard](https://dashboard.clerk.com/sign-up) and sign up or log in.
2. Click **Create application**.
3. Name it `MainStore` and enable sign-in methods you want (Email, Google, etc.).
4. Go to **Configure → API Keys**.
5. Copy:
   - **Publishable key** (`pk_test_...` or `pk_live_...`)
   - **Secret key** (`sk_test_...` or `sk_live_...`)

### B. Add keys to `.dev.vars`

Add these lines to your `server/.dev.vars` file (keep your existing `DATABASE_URL`):

```txt
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### C. Create the users table

```txt
npm run db:generate -- --name add_users
npm run db:migrate
```

### D. Test locally

```txt
npm run dev
```

| Route | Auth required? | Purpose |
|-------|----------------|---------|
| `GET /` | No | API health check |
| `GET /catalog` | No | Public catalog (enabled products only) |
| `GET /products` | Admin | Full product list (all statuses) |
| `GET /me` | Yes | Current user + sync to Neon |
| `GET /users` | Admin | List all users + roles |
| `PATCH /users/:id/role` | Admin | Change a user's role |

To call `/me`, send a Clerk session token in the `Authorization` header:

```txt
Authorization: Bearer <clerk_session_token>
```

You get this token from your frontend after a user signs in with Clerk. For quick testing, use Clerk's dashboard or a small test page later when Astro is set up.

### E. Production secrets

After deploy, set secrets on Cloudflare:

```txt
npx wrangler secret put CLERK_SECRET_KEY
npx wrangler secret put CLERK_PUBLISHABLE_KEY
```

---

## Step 4: Roles (RBAC)

Roles live in Neon on `users.role`: `admin`, `manager`, or `customer`. New users default to `customer` on first login sync (`GET /me`). Clerk only handles identity; authorization is decided here.

### Protecting routes

```ts
import { requireAuth, requireRole } from '../middleware/auth'

route.use('*', requireAuth)
route.use('*', requireRole('admin'))        // admin only
// or allow several roles:
route.use('*', requireRole('admin', 'manager'))
```

`requireRole` loads the user from Neon, checks the role, and attaches `c.get('user')` for the route.

### Bootstrap your first admin

After signing in once (so your user row exists), promote yourself:

1. Run `npm run db:studio`
2. Open the `users` table, find your row, set `role` to `admin`, save.

Or run SQL in the Neon console:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Then `GET /users` and `PATCH /users/:id/role` become available with your token. Example role change body:

```json
{ "role": "manager" }
```

---

## Step 5: Orders & checkout

Customers keep items in the browser (local storage). At checkout the storefront sends line items; the API validates stock, prices, and product availability, creates a paid order, and decrements stock immediately. Online payment is not integrated yet.

### A. Create the order tables

```txt
npm run db:generate -- --name add_cart_and_orders
npm run db:migrate
```

If you later removed server-side carts:

```txt
npm run db:generate -- --name drop_cart_tables
npm run db:migrate
```

If you removed Stripe columns from the schema:

```txt
npm run db:generate -- --name remove_stripe_from_orders
npm run db:migrate
```

### B. Optional env

```txt
SHIPPING_FLAT_CENTS=0
```

`SHIPPING_FLAT_CENTS` is a flat shipping fee in cents (`0` = free shipping).

### C. Endpoints

| Route | Auth | Purpose |
|-------|------|---------|
| `POST /checkout` | Customer | Place order (`{ shippingAddress, items: [{ variantId, quantity }] }`) |
| `GET /orders` | Customer/Staff | Own orders (all orders for admin/manager) |
| `GET /orders/:id` | Customer/Staff | Order detail (scoped to caller) |
| `PATCH /orders/:id/status` | Admin/Manager | Update status (`shipped`, `delivered`, `cancelled`) |

### D. Test the flow

1. Sign in on the storefront, add an enabled product to the cart.
2. Check out with a shipping address and click **Place order**.
3. Stock drops immediately and the cart clears.
4. The order appears in the admin Orders page, where staff can mark it `shipped` then `delivered`.

---

## Wrangler types

[For generating/synchronizing types based on your Worker configuration](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
