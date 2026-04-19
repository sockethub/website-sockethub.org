# Open Graph cards

One SVG per page, rasterised to PNG for social preview. OG spec size 1200×630.

## Why both SVG and PNG?

- SVGs are the **source of truth** — edit these.
- PNGs are what social platforms actually render (X, Slack, LinkedIn, Facebook).
  SVG OG images are technically allowed but unevenly supported.

## Files (under `src/res/img/og/`)

| SVG                | PNG                | Used by                         |
| ------------------ | ------------------ | ------------------------------- |
| `sockethub.svg`    | `sockethub.png`    | home + fallback for any page    |
| `get-started.svg`  | `get-started.png`  | `/get-started/`                 |
| `how-it-works.svg` | `how-it-works.png` | `/how-it-works/`                |
| `platforms.svg`    | `platforms.png`    | `/platforms/`                   |
| `news.svg`         | `news.png`         | `/news/` (listing)              |
| `about.svg`        | `about.png`        | `/about/`                       |

Individual news posts inherit `/res/img/og/news.png` unless they set
`og_image` in frontmatter.

## Regenerate PNGs

After editing any SVG, re-run:

    ./scripts/render-og.sh

Requires ImageMagick (`convert`). The script reads every `*.svg` in
`src/res/img/og/` and writes a sibling `.png` at 1200×630.

## Wiring a page

Set `og_image` in the page's frontmatter:

    ---
    layout: get-started.hbs
    title: Get started
    og_image: /res/img/og/get-started.png
    og_description: Install, connect, and send your first AS2.0 message.
    ---

`og_description` falls back to the site-wide description. Only override
what you need.
