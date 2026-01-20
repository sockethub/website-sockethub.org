# AGENTS.md

This document provides essential information for AI agents working in the sockethub.org website repository.

## Project Overview

This is a static website for sockethub.org built with **Metalsmith**, a static site generator. The site uses Handlebars templates, Markdown content, and generates a news feed.

- **Tech Stack**: Node.js, Metalsmith, Handlebars, Markdown
- **Purpose**: Marketing/documentation website for the Sockethub project
- **Deployment**: GitHub Pages via `gh-pages` branch (built from `build/` directory)

## Essential Commands

### Build
```bash
npm run build
# or
npx metalsmith
```
This processes source files from `src/` and generates the static site in `build/` directory.

### Deploy
```bash
./deploy.sh
```
Pushes the `build/` directory to the `gh-pages` branch using git subtree. Note: This force pushes, so use with caution.

### Test
No test suite is currently configured. The package.json test script exits with an error.

## Project Structure

```
.
├── src/                    # Source content (Markdown files)
│   ├── index.md           # Homepage content
│   ├── about/             # About page
│   ├── client/            # Client documentation
│   ├── server/            # Server documentation
│   ├── news/              # News articles (blog posts)
│   ├── developer/         # Generated API documentation (static HTML)
│   ├── config/            # Natural Docs configuration (not used in build)
│   └── res/               # Static resources (images, CSS, JS)
│       ├── css/
│       ├── js/
│       └── img/
├── layouts/               # Handlebars templates
│   ├── layout.hbs         # Base layout (includes header/footer partials)
│   ├── index.hbs          # Homepage layout
│   ├── about.hbs          # About page layout
│   ├── news.hbs           # News listing layout
│   ├── client.hbs         # Client docs layout
│   └── server.hbs         # Server docs layout
├── partials/              # Handlebars partials
│   ├── header.hbs         # Site header with navigation
│   ├── footer.hbs         # Site footer
│   ├── nav.hbs            # Navigation menu
│   └── news_list.hbs      # News article list component
├── helpers/               # Handlebars helpers (JavaScript)
│   ├── currPage.js        # Checks if page is active (for nav highlighting)
│   ├── getDay.js          # Date formatting helper
│   ├── getMonth.js        # Date formatting helper
│   ├── getYear.js         # Date formatting helper
│   └── toDisplay.js       # Controls news item display count
├── design/                # Design assets (logos, icons, SVG sources)
├── build/                 # Generated output (not in git, except as subtree for gh-pages)
├── metalsmith.json        # Metalsmith configuration
└── package.json           # NPM dependencies and scripts
```

## Build System (Metalsmith)

### Configuration
All build configuration is in `metalsmith.json`:

- **Plugins used** (in order):
  1. `metalsmith-discover-partials` - Auto-loads partials from `partials/`
  2. `metalsmith-discover-helpers` - Auto-loads helpers from `helpers/`
  3. `metalsmith-markdown` - Converts Markdown to HTML
  4. `metalsmith-collections` - Creates a `news` collection, sorted by date (newest first)
  5. `metalsmith-feed` - Generates RSS feed (`feed.xml`) from news collection
  6. `metalsmith-layouts` - Applies Handlebars layouts

- **Site metadata** (available in all templates as `{{site.*}}`):
  - `site.title`: "Sockethub"
  - `site.url`: "https://sockethub.org"
  - `site.author`: "Nick Jennings"
  - `site.title_brief`: "Sockethub - a polyglot messaging service"
  - `site.description`: "The polyglot solution to the federated social web"
  - `site.keywords`: "federated social web, messaging, protocols, api, open source, facebook, twitter"

### How the Build Works

1. Metalsmith reads all files from `src/`
2. Markdown files are parsed for frontmatter (YAML between `---` markers)
3. Markdown content is converted to HTML
4. Files with `collection: news` are grouped into the news collection
5. Layouts are applied based on the `layout` field in frontmatter
6. Static assets (CSS, JS, images) are copied to `build/`
7. RSS feed is generated at `build/feed.xml`

## Content Patterns

### Markdown Files
All content files in `src/` use YAML frontmatter:

```markdown
---
title: Page Title
current_page: home
layout: index.hbs
---

Content goes here...
```

### News Articles
News posts live in `src/news/` and follow this pattern:

**Filename**: `YYYY-MM-DD-slug.md` (e.g., `2021-09-02-release-410.md`)

**Frontmatter**:
```yaml
---
date: 2021-09-02
title: Sockethub 4.1.0
collection: news
author: Nick Jennings
---
```

The `date` field is used for sorting, and `collection: news` includes the post in the news feed.

### Page Layout Selection
Pages specify their layout in frontmatter:
- `layout: index.hbs` - Homepage
- `layout: about.hbs` - About page
- `layout: news.hbs` - News listing
- `layout: client.hbs` - Client documentation
- `layout: server.hbs` - Server documentation

If no layout is specified, content is processed but may not be wrapped in a template.

## Handlebars Patterns

### Layout Structure
All layouts typically start with `{{>header}}` and end with `{{>footer}}`, which include the site chrome (navigation, branding, footer).

The base `layout.hbs` is minimal:
```handlebars
{{>header}}
{{{contents}}}
{{>footer}}
```

### Helper Functions

#### `currPage` helper
Used in navigation to highlight the active page:
```handlebars
<a class="navbar-item {{currPage current_page 'about'}}" href="/about">About</a>
```
Returns `'active'` if the first argument matches the second, otherwise `''`.

#### `toDisplay` helper
Controls how many news items to display on the homepage. Checks if the item index is within `news_count` (set in page frontmatter).

### Accessing Collections
In templates, the news collection is available as an array:
```handlebars
{{#each collections.news}}
  <h3>{{this.title}}</h3>
  <p>{{this.date}}</p>
  {{{this.contents}}}
{{/each}}
```

## Styling and Assets

- **CSS Framework**: Bulma (loaded from CDN)
- **Icons**: Font Awesome 5.15.3 (loaded from CDN)
- **Custom CSS**: `/res/css/main.css`
- **JavaScript**: jQuery and Bootstrap (in `res/js/`, though Bootstrap CSS is not used)

Navigation uses Bulma's navbar classes. Page content uses Bulma's grid system (`columns`, `container`).

## Deployment Workflow

1. Make changes to source files in `src/`, `layouts/`, `partials/`, or `helpers/`
2. Run `npm run build` to generate the site
3. Verify changes by inspecting `build/` directory
4. Run `./deploy.sh` to deploy to GitHub Pages

The deploy script uses `git subtree split` to push only the `build/` directory to the `gh-pages` branch. This is a force push operation.

## Git Workflow

- **Primary branch**: `master`
- **Deployment branch**: `gh-pages` (auto-managed by deploy script)
- **Ignored files**: `node_modules/`, temp files (`*~`), `.DS_Store`, `.idea/`

Note: The `build/` directory exists in the repo but is managed via git subtree for deployment. Don't manually commit changes to `build/` - always regenerate via `npm run build`.

## Common Tasks

### Adding a New Page
1. Create a Markdown file in `src/` (e.g., `src/newpage/index.md`)
2. Add frontmatter with `title`, `current_page`, and `layout`
3. Write content in Markdown
4. Run `npm run build`
5. The page will be available at `/newpage/`

### Adding a News Post
1. Create a file in `src/news/` with format `YYYY-MM-DD-title.md`
2. Add frontmatter with `date`, `title`, `collection: news`, and `author`
3. Write content in Markdown
4. Run `npm run build`
5. Post appears in `/news/` and the RSS feed

### Modifying Navigation
Edit `partials/nav.hbs` to add/remove navigation items. Use the `currPage` helper to highlight the active page.

### Updating Site Metadata
Edit the `metadata.site` section in `metalsmith.json`. Changes will be reflected in all templates via `{{site.*}}` variables.

### Creating a New Layout
1. Create a `.hbs` file in `layouts/`
2. Include `{{>header}}` and `{{>footer}}` partials
3. Add your custom HTML structure
4. Reference it in page frontmatter with `layout: your-layout.hbs`

### Creating a New Helper
1. Create a `.js` file in `helpers/`
2. Export a function: `module.exports = function(arg1, arg2) { ... }`
3. The helper is automatically available in templates by its filename (without `.js`)

### Creating a New Partial
1. Create a `.hbs` file in `partials/`
2. The partial is automatically available via `{{>filename}}` (without `.hbs`)

## Important Notes

- **No permalinks plugin configured**: Pages use their source directory structure (e.g., `src/about/index.md` → `/about/index.html`)
- **No live reload**: After changes, manually rebuild with `npm run build`
- **Developer docs are static**: The `src/developer/` directory contains pre-generated API documentation (likely from Natural Docs). These HTML files are copied as-is, not processed by Metalsmith.
- **CNAME file**: The `src/CNAME` file (and root `CNAME`) ensures the GitHub Pages custom domain is preserved
- **Analytics**: Matomo tracking is embedded in the header partial
- **RSS feed**: Generated at `/feed.xml` from the news collection
- **Webmention support**: The news layout includes webmention and pingback links

## Gotchas

1. **Handlebars escaping**: Use `{{{contents}}}` (triple braces) to render unescaped HTML from Markdown. Double braces `{{contents}}` will escape HTML entities.

2. **Helper discovery**: Helpers in `helpers/` are auto-loaded by filename. A file named `currPage.js` becomes the `{{currPage}}` helper.

3. **Collection sorting**: The news collection is sorted by the `date` field in frontmatter, not the filename. Ensure the date field is accurate.

4. **Build directory**: The `build/` directory is both generated locally and used as the source for the `gh-pages` branch. Don't edit files in `build/` directly - they'll be overwritten on the next build.

5. **Force push deployment**: The `deploy.sh` script uses `--force` to push to `gh-pages`. This overwrites remote history, so ensure you have a clean build before deploying.

6. **No asset pipeline**: Static assets (CSS, JS, images) in `src/res/` are copied as-is. There's no minification, bundling, or preprocessing.

7. **Frontmatter required for collections**: For a news post to appear in the news collection and feed, it MUST have `collection: news` in its frontmatter.

8. **Date format**: News post dates in frontmatter should be in `YYYY-MM-DD` format for proper sorting.

## Dependencies

All dependencies are in `package.json`:

**DevDependencies** (all are Metalsmith plugins or transformers):
- `metalsmith` - Core static site generator
- `metalsmith-assets` - Copy static assets
- `metalsmith-collections` - Group files into collections
- `metalsmith-discover-helpers` - Auto-load Handlebars helpers
- `metalsmith-discover-partials` - Auto-load Handlebars partials
- `metalsmith-feed` - Generate RSS/Atom feeds
- `metalsmith-layouts` - Apply layouts to files
- `metalsmith-markdown` - Convert Markdown to HTML
- `jstransformer-handlebars` - Handlebars support for metalsmith-layouts

**Dependencies**:
- `metalsmith-permalinks` - Listed but not configured in `metalsmith.json` (may be unused)

## Code Style

- **JavaScript helpers**: Simple module exports, minimal logic
- **Handlebars templates**: Clean, semantic HTML with Bulma classes
- **Markdown**: Standard GitHub-flavored Markdown
- **Indentation**: Not strictly enforced, but Handlebars templates use 2-space indentation

## External Links and Resources

- Main Sockethub repo: https://github.com/sockethub/sockethub
- Sockethub Wiki: https://github.com/sockethub/sockethub/wiki
- Twitter: https://twitter.com/sockethub
- RSS Feed: https://sockethub.org/feed.xml
