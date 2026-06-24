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
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Apply migration files |
| `npm run db:studio` | Open database UI in browser |

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
