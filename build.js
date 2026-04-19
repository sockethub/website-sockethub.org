#!/usr/bin/env node
/**
 * Single entry point for building sockethub.org.
 *
 * Replaces the older `npx metalsmith` + metalsmith.json combo so we can
 * inject release-channel metadata (from release.json or the
 * SOCKETHUB_CHANNEL env var) before handing off to Metalsmith.
 */

const path = require("path");
const fs = require("fs");

const Metalsmith = require("metalsmith");
const discoverPartials = require("metalsmith-discover-partials");
const discoverHelpers = require("metalsmith-discover-helpers");
const markdown = require("@metalsmith/markdown");
const collections = require("@metalsmith/collections");
const feed = require("metalsmith-feed");
const permalinks = require("@metalsmith/permalinks");
const sitemap = require("metalsmith-sitemap");
const layouts = require("@metalsmith/layouts");

const ROOT = __dirname;

// ---------------------------------------------------------------------------
// Release channel resolution
// ---------------------------------------------------------------------------

function resolveRelease() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "release.json"), "utf8"));
  const channel = process.env.SOCKETHUB_CHANNEL || raw.channel;
  const details = raw.channels[channel];
  if (!details) {
    throw new Error(
      `Unknown release channel "${channel}". Available: ${Object.keys(raw.channels).join(", ")}`
    );
  }
  return Object.assign({ channel }, details);
}

// ---------------------------------------------------------------------------
// Site metadata
// ---------------------------------------------------------------------------

const release = resolveRelease();

const site = {
  title: "Sockethub",
  url: "https://sockethub.org",
  author: "Nick Jennings",
  title_brief: "Sockethub — a protocol gateway for the web",
  description:
    "Sockethub is a protocol gateway that lets browser apps talk to IRC, XMPP, feeds, and metadata services through one ActivityStreams 2.0 API.",
  keywords:
    "protocol gateway, activitystreams, activitystreams 2.0, irc, xmpp, rss, atom, messaging, federated web, open source",
  release,
};

console.log(
  `[build] release channel = ${release.channel} (v${release.version})`
);

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

Metalsmith(ROOT)
  .metadata({ site })
  .source("./src")
  .destination("./build")
  .clean(true)
  .use(discoverPartials({ directory: "partials" }))
  .use(discoverHelpers({ directory: "helpers" }))
  .use(markdown())
  .use(
    collections({
      news: {
        pattern: "news/*.md",
        // @metalsmith/collections v2: single "key:order" string.
        sort: "date:desc",
      },
    })
  )
  // Derive a slug from each news filename (YYYY-MM-DD-some-title.md → some-title)
  // so permalinks can rewrite news posts to /news/<slug>/.
  .use((files) => {
    const NEWS_FILENAME = /^news\/\d{4}-\d{2}-\d{2}-(.+)\.(md|html)$/;
    for (const filepath of Object.keys(files)) {
      const match = filepath.match(NEWS_FILENAME);
      if (match) files[filepath].slug = match[1];
    }
  })
  // Snapshot the post-markdown body for every file before layouts wraps it.
  // The news list iterates collections.news and otherwise gets the fully
  // layout-wrapped page HTML for each entry (full <html>/<head>/banner/etc.).
  .use((files) => {
    for (const filepath of Object.keys(files)) {
      files[filepath].body = files[filepath].contents;
    }
  })
  // Reading-time — words in the post-markdown body divided by a typical
  // 220 wpm rate, rounded up (minimum 1). Only applied to news posts.
  // Also assign the news_post.hbs layout so individual posts get a proper
  // header with date / author / reading-time.
  .use((files) => {
    for (const filepath of Object.keys(files)) {
      if (!filepath.startsWith("news/")) continue;
      if (filepath === "news/index.md") continue;
      const text = String(files[filepath].body || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const words = text ? text.split(" ").length : 0;
      files[filepath].readingTime = Math.max(1, Math.round(words / 220));
      if (!files[filepath].layout) {
        files[filepath].layout = "news_post.hbs";
      }
    }
  })
  .use(
    // Only rewrite news posts. Everything else (index.md, about/index.md, etc.)
    // keeps its source-directory path so we don't move known URLs.
    permalinks({
      relative: false,
      linksets: [
        {
          match: { collection: "news" },
          pattern: "news/:slug",
        },
      ],
    })
  )
  .use(
    feed({
      collection: "news",
      destination: "feed.xml",
      title: site.title,
      description: site.description,
      site_url: site.url,
      feed_url: `${site.url}/feed.xml`,
    })
  )
  .use(
    sitemap({
      hostname: site.url,
      omitIndex: true,
      modifiedProperty: "date",
      pattern: ["**/*.html"],
    })
  )
  .use(
    layouts({
      transform: "handlebars",
      default: "layout.hbs",
      pattern: "**/*.html",
    })
  )
  .build((err) => {
    if (err) {
      console.error("[build] failed:", err);
      process.exit(1);
    }
    console.log("[build] ok → ./build");
  });
