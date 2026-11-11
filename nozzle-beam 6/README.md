# Nozzle and Beam

Custom 3D prints shop + **Canopy Scan** (pine beetle crown detector). Dark UI, Stripe Checkout on Vercel.

## What's included

- Shop, cart, Stripe checkout (`api/checkout.js`)
- Custom file request form
- **Canopy Scan** at `/canopy-scan.html` — runs in the browser, nothing uploaded
- Product photos: set `image: "/images/file.jpg"` in `public/js/catalog.js`

## Repo layout

```
api/checkout.js
package.json
vercel.json
public/
  index.html
  canopy-scan.html
  styles.css
  order-complete.html
  favicon.svg
  js/
    app.js
    catalog.js
    icons.js
```

## Deploy (Vercel)

1. Push this folder to a GitHub repo (files at the **repo root**, not nested extra folders)
2. Import the repo on [vercel.com](https://vercel.com)
3. Deploy (output directory is `public` via `vercel.json`)
4. Add env var `STRIPE_SECRET_KEY` = your `sk_test_...` or live key → Redeploy

Site URLs:

- Shop: `/`
- Canopy Scan: `/canopy-scan.html`
- Order complete: `/order-complete.html`

## Stripe

Orders appear in the Stripe Dashboard → Payments. Customer name, address, and cart items are in session metadata.
