# Build notes — Purelane homepage → Shopify (Dawn)

## What this is
Five production Dawn sections reproducing `reference/purelane-homepage.html`
(the assignment's prototype — recovered from the assignment page, see
`AI_WORKFLOW.md`): **hero**, **shop/product grid**, **best-selling combos**,
**bundles**, and **reviews rail**. Wired onto the homepage in
`templates/index.json` in the prototype's own order: hero → reviews →
combos → bundles → shop.

## Architecture decisions

**Section + block, not metaobjects, for combos/bundles/reviews.** These are
small, curated, homepage-only marketing content (a handful of combo cards,
3 bundle tiers, a handful of reviews) — the natural Dawn fit is section
blocks, edited directly in the theme editor with live preview, not a
separate metaobject-entry admin screen for content that's only ever used
in one place. Metaobjects earn their keep when content is reused across
many pages/products or needs a structured relationship (e.g. one metaobject
entry linked from many products) — that's not the case here. Product
*images* inside combos/bundles are still real product references
(`type: product` block settings), not hardcoded art, so store data still
drives what's actually shown.

**Shop grid pulls from a real collection.** `section.settings.collection`
+ `products_to_show` (Dawn's own `featured-collection.liquid` pattern) —
nothing in that section is a hardcoded product. Point it at a collection
containing the 8 seeded products (see `seed/products-seed.csv`) to see all
three required edge cases render correctly:
  - **Sold out** → badge + disabled "Sold out" button, no strikethrough-price
    confusion (handled in `snippets/purelane-product-card.liquid`).
  - **No image** → placeholder illustration via Shopify's own
    `placeholder_svg_tag`, never a blank/broken box.
  - **Long title** → 2-line clamp (`-webkit-line-clamp`) so it can't break
    the grid; the full title is still the link's accessible name.

**Everything is CSS-scoped `pl-`/`--pl-*`.** Dawn's own `base.css` already
owns generic names the prototype used verbatim (`.card`, `.badge`, `.rate`).
Every ported class and custom property is prefixed so this can't visually
break other sections of the theme, now or after a future Dawn update.

**Scroll-reveal never depends on JS to become visible.** `.pl-rv` content
is visible by default; `purelane-reveal.js` only *arms* the hide-then-
reveal animation once it has actually run (see comments in
`purelane-shared.css`). No JS, no first-load flash, no failure mode where
content is invisible to a user or a crawler.

**LCP-aware hero image.** The first hero product-stage image loads eager
with `fetchpriority: high`; the other two (initially hidden) lazy-load.

## Metafield / metaobject definitions used
One metafield, standard-namespace (used by most review apps, e.g. Judge.me,
Loox, Shopify's own Product Reviews — this reads it, doesn't require a
specific app):
| Namespace | Key | Type | Used by |
|---|---|---|---|
| `reviews` | `rating` | Rating | `purelane-product-card.liquid` — star row |
| `reviews` | `rating_count` | Integer | `purelane-product-card.liquid` — review count |

If no review app is installed and these metafields don't exist, the card
simply omits the star row — it's not a required field, so an unreviewed
product still renders correctly.

No metaobjects were needed (see architecture decision above).

## What was cut, and why
The prototype also ships a full-viewport animated background ("water
scenes" that shift gradient per section on scroll, plus a rising-bubbles
layer), a marquee ticker, custom nav/sticky-CTA, and several bonus content
sections (ingredients, pillars, proof/stats, full range strip, why-bundles,
categories, trust bar, signup, footer). None of these are in the assignment's
5 required sections, none are merchant-editable commerce content, and the
scene system in particular is a non-trivial scroll-linked JS/SVG layer with
zero functional value beyond ambience. Given the 2-day window, I prioritized
the 5 required sections to production quality (real data, edge cases,
accessibility, LCP) over partial coverage of bonus chrome. Each of the 5
sections keeps a static per-section background gradient (matching that
section's designated "scene" stop in the prototype) so the overall visual
mood carries through without the animation system.

Dawn's own header/footer are left as-is rather than re-skinned to match the
prototype's nav — same reasoning: not one of the 5 required sections, and
Dawn's header already handles cart/search/menu/accessibility correctly.

## Verification done
`shopify theme check` run locally against the full theme: 0 errors in any
Purelane file (it did catch and I fixed 3 real bugs before they reached a
store — an unsupported `push` filter, a nonexistent `newline` object, and a
schema `name` over Shopify's 25-character limit). All remaining warnings in
the report are pre-existing in Dawn's own stock files, not introduced here.

**Not yet done, and the single biggest gap:** this has not been opened in
an actual browser against a live theme/store — I don't have Shopify
credentials in this environment. `shopify theme check` verifies Liquid/schema
correctness, not visual fidelity. Before submitting, run `shopify theme dev`
against your dev store (see `SETUP.md`) and eyeball every section at 375px,
768px, and desktop against the prototype.
