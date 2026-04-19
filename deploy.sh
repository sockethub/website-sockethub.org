#!/bin/sh
# Deploy the generated build/ directory to GitHub Pages.
#
# Usage:
#   ./deploy.sh            → push to gh-pages (production, sockethub.org)
#   ./deploy.sh preview    → push to gh-pages-preview (for redesign review)
#
# The preview branch is intended to be served from a separate subdomain
# (e.g. preview.sockethub.org) so production is never touched until the
# redesign is approved and we run ./deploy.sh without arguments.
set -eu

TARGET="gh-pages"
if [ "${1:-}" = "preview" ]; then
  TARGET="gh-pages-preview"
fi

SRC_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# build/ must exist and be current
if [ ! -d build ]; then
  echo "error: build/ does not exist. Run 'npm run build' first." >&2
  exit 1
fi

echo "Deploying build/ on branch '${SRC_BRANCH}' → '${TARGET}'"
git push origin "$(git subtree split --prefix build/ "${SRC_BRANCH}")":"${TARGET}" --force
echo "Done."
