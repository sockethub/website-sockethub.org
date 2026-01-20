---
date: 2026-01-19
title: Sockethub 5.0.0 alpha releases
collection: news
author: Nick Jennings
---
Sockethub 5.0.0 has been a multi-year project, and we've been quietely releasing alpha builds for testing. These alpha releases have major rewrite and architectural improvements across the board. 

Stability has improved a lot and so we're announcing the alpha releases are available for anyone who'd like to try them out. 

We won't individually announce each alpha release, but will do so once we move to beta. 

Some new features include:  


- Packaging changes, the `sockethub` package is still the main package, but works as a meta package for a number of packages in the `@sockethub` namespace. i
  e.g. `@sockethub/server`, `@sockethub/client`, `@sockethub/platform-xmpp`
- Greatly improved unit and integration tests
- A New Metadata Platform!
- An Examples package
- Migrate to BullMQ
- Migrate to Bun
- Improved documentation
- So much more...

To try it out, you can run `npm install -g sockethub@alpha`

For a full list of changes, see the [Sockethub release page](https://github.com/sockethub/sockethub/releases).
