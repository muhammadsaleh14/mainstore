# MainStore — Customer Storefront (Astro)

Lightweight Astro storefront for browsing products, managing a local cart, and placing orders.

## Project structure

The app is feature-based (see `docs/rules.md`):

```
src/features/<feature>/
  api/          # HTTP calls
  lib/          # helpers, client stores
  scripts/      # client-side init logic
  components/   # UI pieces
  pages/        # full screens
```

## Stack

- **Astro 5** (server-rendered pages for fast first load)
- **Clerk** (`@clerk/astro`) for sign-in
- **Vanilla JS + localStorage** for the shopping cart (no heavy UI framework on most pages)
- **React island** only for the Clerk user menu button
- Hono API on Cloudflare Workers

## Why Astro

Catalog and order pages are rendered on the server, so customers get HTML immediately without loading a large React bundle. Interactive parts (cart, checkout form) use small client scripts only where needed.

## Setup

1. Copy env file:

   ```txt
   copy .env.example .env
   ```

2. Fill in `.env`:

   ```txt
   PUBLIC_API_URL=http://localhost:8787
   PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

   Use the same Clerk keys as the admin app.

3. Install and run:

   ```txt
   npm install
   npm run dev
   ```

   Opens at **http://localhost:5174**.

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Product catalog (SSR) |
| `/products/:id` | No | Product detail + add to cart |
| `/cart` | No | Cart (local storage) |
| `/checkout` | Yes | Shipping form → place order |
| `/checkout/success` | Yes | Order confirmation |
| `/orders` | Yes | Order history (SSR) |
| `/orders/:id` | Yes | Order detail (SSR) |
| `/sign-in` | No | Clerk sign-in |

## Test checkout

1. Start the API (`server`: `npm run dev`)
2. Start this app (`store`: `npm run dev`)
3. Add an **enabled** product with stock, go to checkout, sign in if prompted, and click **Place order**

Cart data is stored in the browser under the key `mainstore-cart` (same as the previous React storefront).
