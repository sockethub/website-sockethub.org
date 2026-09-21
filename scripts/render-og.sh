#!/usr/bin/env bash
# Rasterise every src/res/img/og/*.svg into a sibling .png at the
# Open Graph standard 1200×630. Social platforms (X, Slack, LinkedIn,
# Facebook) render PNG far more reliably than SVG, so PNGs are what the
# page <meta og:image> tags actually point at.
#
# Usage:
#   ./scripts/render-og.sh
#
# Renderer: librsvg (`rsvg-convert`, brew install librsvg), or headless
# Chrome when it is missing. ImageMagick is deliberately not used: its
# internal SVG renderer has no font support and fails on these cards,
# and Homebrew's build does not hand SVGs to the librsvg delegate.

set -euo pipefail

cd "$(dirname "$0")/.."

OG_DIR="src/res/img/og"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

render() {
  local svg="$1" png="$2"
  case "$RENDERER" in
    rsvg)
      rsvg-convert --width 1200 --height 630 --output "$png" "$svg"
      ;;
    chrome)
      "$CHROME" --headless=new --disable-gpu --force-device-scale-factor=1 \
        --window-size=1200,630 --screenshot="$PWD/$png" \
        "file://$PWD/$svg" >/dev/null 2>&1
      ;;
  esac
}

if command -v rsvg-convert >/dev/null 2>&1; then
  RENDERER=rsvg
elif [[ -x "$CHROME" ]]; then
  RENDERER=chrome
else
  echo "error: no usable SVG renderer found" >&2
  echo "install with: brew install librsvg  (macOS)" >&2
  echo "           or: apt install librsvg2-bin  (Debian/Ubuntu)" >&2
  echo "           or: install Google Chrome" >&2
  exit 1
fi

echo "using renderer: $RENDERER"

count=0
for svg in "$OG_DIR"/*.svg; do
  [[ -e "$svg" ]] || { echo "no SVGs found in $OG_DIR"; exit 0; }
  png="${svg%.svg}.png"
  echo "rendering $(basename "$svg") → $(basename "$png")"
  render "$svg" "$png"
  count=$((count+1))
done

echo "rendered $count OG card(s)"
