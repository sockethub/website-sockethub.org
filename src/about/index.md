---
title: About
current_page: about
news_count: 0
layout: about.hbs
---

## What is Sockethub?

Sockethub is a **protocol gateway for the web** that bridges the gap between browser-based applications and traditional network protocols. Using [ActivityStreams](https://www.w3.org/TR/activitystreams-core/) objects as a standardized message format, it acts as an intelligent proxy server that maintains state and connects to services that would otherwise be inaccessible from in-browser JavaScript.

## Architecture & Features

Built with modern TypeScript and powered by Bun runtime, Sockethub features a robust **multi-process architecture** where:

- The main server handles Socket.IO connections through a middleware pipeline
- Each protocol runs as an isolated child process for stability
- A Redis-backed job queue ensures reliable message delivery
- Per-session encrypted credential storage protects user data
- Process isolation prevents failures from affecting other connections

## Supported Protocols

Currently implemented platforms include:

- **XMPP** – Extensible Messaging and Presence Protocol with full presence and multi-user chat support
- **IRC** – Internet Relay Chat for traditional chat networks
- **RSS/Atom** – Feed processing and aggregation
- **Metadata** – Link preview generation and metadata extraction

The extensible design allows for straightforward implementation of additional protocols like SMTP, IMAP, Nostr, and more.

## Origins & Philosophy

Originally conceived as a sister project to [RemoteStorage](https://remotestorage.io/), Sockethub supports the development of [Unhosted](http://unhosted.org/) and [noBackend](http://nobackend.org/) applications. However, its functionality seamlessly integrates into traditional development stacks, removing the need for custom protocol-specific code at the application layer.

## Use Cases

Sockethub enables web applications to:

- Connect to chat networks (XMPP, IRC) without server-side code
- Process and aggregate RSS/Atom feeds
- Generate link previews and extract metadata
- Maintain persistent protocol connections with session management
- Translate between ActivityStreams and traditional protocol formats

## Open Source & Actively Maintained

Sockethub is actively developed and maintained by Nick Jennings with support from the NLNET Foundation. With over 390 stars and contributions from 20+ developers, the project continues to evolve with regular updates and improvements.

The architecture is designed to be extensible – implementing new platforms is straightforward by defining a schema and mapping functions to ActivityStream verbs.
