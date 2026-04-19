# sockethub.org redesign plan

This is the working plan. Phases 1 and 2 are done. Phase 3 is active.

## Goals
- Clearly communicate what Sockethub is within ~10 seconds of landing
- Show, not just tell — interactive diagrams + animated flows, ActivityStreams 2.0 envelope translation, worker architecture
- Mobile-first, fluid, modern — drop legacy CDN frameworks; use current CSS primitives
- Stay on Metalsmith + Markdown + Handlebars; keep RSS feed and GH Pages / CNAME deployment
- Update outdated content (Twitter/Facebook → IRC/XMPP/Feeds/Metadata, with 5.0 alpha front and center)

## Non-goals
- Not switching static-site generators
- Not a JS-heavy SPA (≤40 kB JS, progressively enhanced)
- Not a docs-site replacement (docs still link to main repo / wiki)

## Information architecture
| Path                   | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `/`                    | Hero + animated flow + 4 platform cards + why Sockethub + news       |
| `/about`               | Origin story, architecture diagram, sister projects, maintainer      |
| `/how-it-works` (new)  | Dedicated scrollytelling page with animated diagrams                 |
| `/platforms` (new)     | Per-platform pages/anchors (IRC, XMPP, Feeds, Metadata) + samples    |
| `/get-started` (new)   | Unified quickstart: Docker, npm, source — replaces `/client` + `/server` |
| `/news` + post pages   | Blog index + individual entries; RSS at `/feed.xml`                  |
| `/developer/`          | **Removed** per Decision #3                                          |

## Visual direction
- "Editorial-meets-protocol": dark-capable, generous whitespace, mono-accent for code, ActivityStreams JSON as first-class visual
- **Palette**: ember gradient from logo (`#ff9c1f → #f23c00 → #de0f3c`) with cyan accent counterpoint
- **Typography**: variable webfonts, self-hosted (Phase 2)
- Fluid type via `clamp()` throughout
- Subtle motion; `prefers-reduced-motion` respected
- Iconography: hand-rolled inline SVGs (no Font Awesome)

## Tech stack changes
**Keep**: Metalsmith, Handlebars, Markdown, metalsmith-feed, -collections, -layouts; `src/` → `build/` → gh-pages via `deploy.sh`; CNAME, Matomo, webmention/pingback.

**Dropped**: Bulma CDN, Font Awesome CDN, jQuery + Bootstrap bundle.

**Added**: metalsmith-permalinks (properly configured), metalsmith-sitemap, syntax highlighting (Prism or Shiki), build-time OG image generator.

## Locked-in decisions
1. **Preview strategy**: all work on `t3code/sockethub-redesign`; local `python3 -m http.server` for spot checks; optional `gh-pages-preview` branch for shareable URL; single final rollout when approved
2. **Release channel**: build-time toggle via `release.json` (`channel: "alpha"` currently); `SOCKETHUB_CHANNEL=stable` env override; controls alpha banner, install command, version display
3. **/developer/**: deleted (out of date)
4. **re:publica video**: removed from /about; preserved in 2013 news post; modern diagrams take precedence
5. **Twitter footer link**: removed; not replaced
6. **Playground**: filed as future issue #21; out of scope for this redesign

## Phases

### Phase 1 — Scaffolding + design tokens ✅ DONE
- New CSS (reset, tokens, typography, color modes)
- Dropped Bulma / Font Awesome / jQuery / Bootstrap
- Rewrote `partials/header.hbs`, `partials/footer.hbs`
- Added `@metalsmith/permalinks`, `metalsmith-sitemap`
- `release.json` + `build.js` + `ifChannel` / `installCommand` helpers
- Preview-branch deploy path

### Phase 2 — Homepage + hero animation ✅ DONE
- New `layouts/index.hbs`
- Envelope fan-out SVG with inline ember gradient
- Platform cards (IRC / XMPP / RSS / Metadata)
- Values grid, code-peek, support strip, news cards
- Ember theme redesign (toned down in final polish pass)
- Support cards with GitHub + Bitcoin icons
- Republica video embedded in its news entry (not homepage)

### Phase 3 — New pages (ACTIVE)
- [ ] `/how-it-works` with scrollytelling diagrams
  - Problem framing (browser sandbox wall)
  - ActivityStreams 2.0 envelope walkthrough
  - Credentials → Connect → Operate flow
  - Server architecture (Socket.IO ↔ server ↔ BullMQ/Redis ↔ platform workers)
  - Session isolation (per-client encrypted lanes)
- [ ] `/platforms` with anchors for `#irc`, `#xmpp`, `#feeds`, `#metadata`
  - One-paragraph description each
  - Credentials schema (with `process.env.*` placeholders)
  - Example action sent + received
  - Link to npm package / repo
- [ ] `/get-started` with tabs (CSS-only `<details>` fallback)
  - Docker compose snippet
  - `npm install -g sockethub@alpha`
  - Source: git clone + bun install + bun run dev
  - Minimal IRC client snippet (uses `sc.contextFor('irc')` + ack callback)
- [ ] Redirect `/client` and `/server` → `/get-started`
- [ ] Update nav in `partials/header.hbs` to include the new pages

### Phase 4 — News polish + content refresh
- Per-post permalinks (already configured in Phase 1; verify all posts)
- Refreshed news layout (timeline with year headers, grouped cards)
- Add reading-time + author line at top of each post
- "5.0 alpha is here" banner (already present via alpha_banner partial)
- Replace outdated `architecture_overview.svg` (Email / Facebook / Twitter labels → current protocols)
- Generate per-page OG images from SVG template
- **Cleanup**: delete `src/developer/`, remove Twitter footer link, remove video from `/about`

## Diagrams to produce
| #  | Name                             | Used on                  | Animation                                       |
| -- | -------------------------------- | ------------------------ | ----------------------------------------------- |
| 1  | Envelope fan-out                 | `/` hero (DONE)          | Loop: JSON → hub → 4 protocols                  |
| 2  | Send/receive JSON                | `/`                      | Type-on once on scroll                          |
| 3  | Protocol walls (problem framing) | `/how-it-works`          | Browser bumping against wall                    |
| 4  | Credentials → Connect → Operate  | `/how-it-works`          | Step progression, one stage highlighted at a time |
| 5  | Architecture — server + workers  | `/how-it-works`, `/about` | Nodes pulse as messages flow                    |
| 6  | Session isolation                | `/how-it-works`          | Multiple clients each with their own lane       |
| 7  | Protocol glyphs                  | homepage cards, `/platforms` | Hover micro-interaction only                |

All animations respect `prefers-reduced-motion: reduce`.

## Accessibility, performance, SEO
- Lighthouse target: ≥95 on all four axes on mobile
- Target first-load transfer ≤40 kB gz (HTML+CSS+JS)
- Per-page `<title>`, description, `og:*`, `twitter:card`, canonical
- Real heading hierarchy
- Keyboard-navigable diagrams (`<title>` + `<desc>` in every SVG; static-version link)
- `lang="en"` set; `color-scheme` meta

## Release-channel toggle (Phase 1 design, for reference)
```json
// release.json
{
  "channel": "alpha",
  "alpha":  { "version": "5.0.0-alpha", "installTag": "@alpha"  },
  "stable": { "version": "4.1.0",        "installTag": ""        }
}
```
- Flip `"channel": "stable"` to switch
- Override: `SOCKETHUB_CHANNEL=stable npm run build`
- Surfaces: alpha banner (alpha only), install command suffix, version display
