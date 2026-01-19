#!/bin/bash

# Script to create a new Sockethub release announcement
# Usage: ./announce-release.sh <version>
# Example: ./announce-release.sh 4.2.0

set -e

# Check if version is provided
if [ -z "$1" ]; then
    echo "Error: Version number is required"
    echo "Usage: ./announce-release.sh <version>"
    echo "Example: ./announce-release.sh 4.2.0"
    exit 1
fi

VERSION="$1"

# Generate filename
DATE=$(date +%Y-%m-%d)
FILENAME="src/news/${DATE}-release-${VERSION//.}.md"

# Check if file already exists
if [ -f "$FILENAME" ]; then
    echo "Error: File $FILENAME already exists"
    exit 1
fi

# Create the news post with template
cat > "$FILENAME" <<EOF
---
date: $DATE
title: Sockethub $VERSION
collection: news
author: Nick Jennings
---
Sockethub $VERSION has been released! [Describe the main focus or highlight of this release - e.g., "This release focuses on stability and bugfixes", "includes major architectural improvements", "fixes a few minor issues", etc.]

[Optional: Add specific highlights or notable changes here]

For a full list of changes, see the [Sockethub release page](https://github.com/sockethub/sockethub/releases/tag/v$VERSION).
EOF

echo "✓ Created release announcement: $FILENAME"
echo "✓ Opening in vim for editing..."
echo ""

# Open in vim - cursor will be positioned after the frontmatter
vim "+7" "$FILENAME"

echo ""
echo "Next steps:"
echo "  1. Run 'npm run build' to generate the site"
echo "  2. Review the changes in build/"
echo "  3. Run './deploy.sh' to publish to GitHub Pages"
