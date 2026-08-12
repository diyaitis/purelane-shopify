# Setup — steps that need your own Shopify/GitHub access

I don't have credentials for either, so these steps are for you. Everything
else (the theme code itself) is already done and committed.

## 1. Create a Partner account + dev store (5 min)
1. Sign up free at partners.shopify.com if you don't already have an account.
2. **Stores → Add store → Development store** → any name (e.g. `purelane-dev`)
   → purpose "Test an app or theme" → Create.

## 2. Install the Shopify CLI (already done in this environment; on your
   own machine)
```
npm install -g @shopify/cli@latest
```

## 3. Push this theme to the dev store
From this folder:
```
shopify theme dev --store=purelane-dev.myshopify.com
```
The first run opens a browser login and links the CLI to that store. This
also gives you a live local preview URL to check responsive behaviour
against the prototype before publishing.

To actually publish it as the store's theme:
```
shopify theme push --store=purelane-dev.myshopify.com
```
Then in Admin → Online Store → Themes, click **Publish** on the uploaded
theme once you're happy with it.

## 4. Seed products
`seed/products-seed.csv` has 8 products matching the prototype's shop grid,
with the 3 required edge cases already baked in:
- **Sold out** → "Copper, Bronze & Brass Cleaner" (inventory qty 0, deny overselling)
- **No image** → "Natural Herbal Floor Cleaner" (leave its image blank on purpose)
- **Long title** → "Non-Toxic Laundry Detergent - Concentrated Formula for
  Everyday and Deep-Stain Washes (Family Pack)"

Import: Admin → Products → **Import** → upload `seed/products-seed.csv`.

All 8 rows ship with a blank image (no real Purelane photography exists to
attach) — after import, add a product photo to the other 7 via Admin so
the no-image case is the *one* deliberate exception, not all eight. Any
product photo works; the card only needs `featured_media` to be present.

Then: **Products → Collections → Create collection** (e.g. "Bestsellers"),
add all 8 products, save. In the theme editor, open the **Purelane: Shop
grid** section and set its Collection setting to that collection.

## 5. Reviews (optional)
The product card reads the standard `reviews.rating` / `reviews.rating_count`
metafields if present (see `BUILD_NOTES.md`). Either install a reviews app
that writes them automatically, or set them manually per product under
Admin → Products → [product] → Metafields. Not required — the star row
just won't render without them.

## 6. Fill in the hero's real product photos
Theme editor → **Purelane: Hero** section → each "Product stage slide"
block → set its image. Ships with placeholder pricing text already filled
in (₹200/₹349/₹499 matching the prototype); edit to match your real bundle
pricing.

## 7. Push to GitHub
```
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```
The commit history is already meaningful (one commit per section/decision,
not a single dump) — see `git log --oneline`.

## 8. Submit
Per the assignment page, email **nj@troopod.io** with subject
`AI Product Engineer Assignment - Your Name`, including:
1. Dev store URL + password (Admin → Preferences, or share a collaborator
   link if the store isn't password-protected)
2. This GitHub repo URL
3. `BUILD_NOTES.md` (metafield/metaobject definitions + what changed/why)
4. `AI_WORKFLOW.md`
