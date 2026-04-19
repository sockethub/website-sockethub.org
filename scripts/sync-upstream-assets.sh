#!/usr/bin/env bash
# Refresh diagrams/images that are authored upstream in the core sockethub
# repo and copied into this website repo (so the site stays self-contained
# and doesn't cross-load assets at runtime).
#
# Usage:
#   ./scripts/sync-upstream-assets.sh [/path/to/sockethub]
#
# Defaults:
#   - Uses $SOCKETHUB_REPO if set
#   - Otherwise probes a short list of common local checkout paths

set -euo pipefail

cd "$(dirname "$0")/.."

SOCKETHUB_REPO="${1:-${SOCKETHUB_REPO:-}}"

if [[ -z "$SOCKETHUB_REPO" ]]; then
  for candidate in \
    "$HOME/code/sockethub/sockethub" \
    "$HOME/src/sockethub/sockethub" \
    "$HOME/.t3/worktrees/sockethub/main"; do
    if [[ -d "$candidate/docs/img" ]]; then
      SOCKETHUB_REPO="$candidate"
      break
    fi
  done
fi

if [[ -z "$SOCKETHUB_REPO" || ! -d "$SOCKETHUB_REPO/docs/img" ]]; then
  echo "error: could not locate the sockethub core repo" >&2
  echo "pass a path or set SOCKETHUB_REPO, e.g.:" >&2
  echo "  ./scripts/sync-upstream-assets.sh ~/code/sockethub/sockethub" >&2
  exit 1
fi

echo "syncing from: $SOCKETHUB_REPO/docs/img"

# Files that originate in the core repo. If one is missing upstream we
# warn rather than fail, so the script keeps working as the set evolves.
ASSETS=(
  "activitystreams-send-receive.svg"
  "activitystreams-send-receive.dark.svg"
)

count=0
for asset in "${ASSETS[@]}"; do
  src="$SOCKETHUB_REPO/docs/img/$asset"
  dst="src/res/img/$asset"
  if [[ -f "$src" ]]; then
    cp "$src" "$dst"
    echo "  updated $dst"
    count=$((count+1))
  else
    echo "  skip: $asset not found upstream" >&2
  fi
done

echo "synced $count asset(s)"
