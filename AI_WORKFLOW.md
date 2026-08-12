# AI workflow notes

Built with Claude Code (Anthropic), agentic in a real shell/filesystem —
not chat-and-paste. Rough sequence, in case the "how" matters as much as
the diff:

1. **Fetched the assignment page** and found the linked download
   (`purelane-homepage.html`) wasn't a real static file — the page
   generates it client-side from a base64 blob sitting in a
   `<script id="fileData" type="application/octet-stream">` tag and
   triggers a Blob download via JS. Grepped that tag out of the page's raw
   HTML directly and `base64 -d`'d it rather than trying to drive a
   headless browser through the click-to-download flow — faster and it's
   the same bytes.

2. **Read the prototype source directly**, section by section (it's
   helpfully divided by `<!-- ===== NAME ===== -->` comments), rather than
   summarizing it — pixel fidelity requires the actual class names,
   breakpoints, and markup structure, not a paraphrase. Cross-checked which
   of two conflicting `:root` colour-token blocks the file actually ships
   (there are two — a dark v1 and a light "brand colours" v2 — the second
   wins the CSS cascade, so that's what really renders) before writing any
   theme CSS, to avoid building the wrong palette.

3. **Checked Dawn's existing conventions before writing new code**: read
   `sections/image-banner.liquid` and `snippets/card-product.liquid` first,
   to match Dawn's own patterns for `image_url`/`image_tag`, sold-out/
   sale-badge logic (`product.available`, `compare_at_price`), and schema
   shape, rather than inventing a parallel style. Grepped `base.css` for
   classname collisions before choosing the `pl-` prefix — it caught that
   Dawn already owns `.badge`.

4. **Built section-by-section**: shared design tokens/CSS first, then each
   of the 5 required sections (CSS, Liquid, schema), committing after each
   one lands so the git history reads as an actual build, not one dump.

5. **Installed the Shopify CLI locally and ran `shopify theme check`**
   against the real theme before calling anything done — not a manual
   read-through. It caught 3 real bugs (a nonexistent `push` filter, a
   nonexistent `newline` object I'd misremembered as a Liquid built-in, and
   a schema name over Shopify's 25-char limit) that a code-only review
   would likely have missed. Fixed all three, reran to confirm 0 errors in
   every file this build touched.

6. **What AI did not do**: sign into Shopify, create the dev store, install
   the theme on it, seed products beyond generating the import CSV, or
   visually compare the rendered page to the prototype in a real browser —
   no Shopify credentials were available in this environment. See
   `SETUP.md` for the remaining manual steps and `BUILD_NOTES.md`'s
   "Verification done" section for exactly what was and wasn't checked.

**Where I'd push back if this were a real handoff:** the 2-day scope as
literally read ("5 sections, matched exactly, real data, edge cases,
accessibility, Core Web Vitals, dev store, GitHub, metafields, build notes,
AI workflow notes") is closer to a 3-4 day job once you count actually
verifying pixel fidelity in a browser across breakpoints and seeding a
believable catalog — the code-writing itself was the smaller half. I
front-loaded the 5 required sections at production quality and cut the
prototype's decorative animated-background system rather than half-do
everything; see `BUILD_NOTES.md` for the explicit list of what that cut.
