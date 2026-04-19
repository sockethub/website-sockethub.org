#!/usr/bin/env bash
# Rasterise every src/res/img/og/*.svg into a sibling .png at the
# Open Graph standard 1200×630. Social platforms (X, Slack, LinkedIn,
# Facebook) render PNG far more reliably than SVG, so PNGs are what the
# page <meta og:image> tags actually point at.
#
# Usage:
#   ./scripts/render-og.sh
#
# Requires ImageMagick (`convert`).

set -euo pipefail

cd "$(dirname "$0")/.."

OG_DIR="src/res/img/og"

# Prefer ImageMagick 7's `magick` command; fall back to v6's `convert`.
if command -v magick >/dev/null 2>&1; then
  IM=(magick)
elif command -v convert >/dev/null 2>&1; then
  IM=(convert)
else
  echo "error: ImageMagick not found on PATH (need 'magick' or 'convert')" >&2
  echo "install with: brew install imagemagick  (macOS)" >&2
  echo "           or: apt install imagemagick   (Debian/Ubuntu)" >&2
  exit 1
fi

count=0
for svg in "$OG_DIR"/*.svg; do
  [[ -e "$svg" ]] || { echo "no SVGs found in $OG_DIR"; exit 0; }
  png="${svg%.svg}.png"
  echo "rendering $(basename "$svg") → $(basename "$png")"
  "${IM[@]}" -background none -density 144 "$svg" -resize 1200x630 "$png"
  count=$((count+1))
done

echo "rendered $count OG card(s)"
