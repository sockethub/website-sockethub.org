---
title: About
current_page: about
news_count: 0
layout: about.hbs
---

## What is Sockethub?

Sockethub is a **protocol gateway for the web**. It lets browser apps talk to
IRC, XMPP, feeds, and other services using one message format:
[ActivityStreams](https://www.w3.org/TR/activitystreams-core/).

## ActivityStreams In/Out

Sockethub uses the same JSON envelope for every platform. Your app sends one
shape, Sockethub translates it, and you receive the same shape back.

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://sockethub.org/res/img/activitystreams-send-receive.dark.svg"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://sockethub.org/res/img/activitystreams-send-receive.svg"
  />
  <img
    alt="ActivityStreams send/receive examples"
    src="https://sockethub.org/res/img/activitystreams-send-receive.svg"
  />
</picture>

## What You Can Do

- Send and receive chat messages (IRC, XMPP)
- Fetch and parse feeds (RSS, Atom)
- Generate link previews and metadata
- Add new protocols as custom platforms

## Architecture

Sockethub runs each protocol in its own process and moves messages through
Redis so browsers can talk to long-lived connections safely.

- Main server handles Socket.IO, validation, routing
- Platform processes run per protocol
- Redis job queue handles delivery
- Encrypted, per-session credential storage

## Supported Protocols

Currently implemented platforms include:

- **XMPP** – Extensible Messaging and Presence Protocol
- **IRC** – Internet Relay Chat
- **RSS/Atom** – Feed processing and aggregation
- **Metadata** – Link preview generation and metadata extraction

## Origins

Originally conceived as a sister project to [RemoteStorage](https://remotestorage.io/),
Sockethub supported the development of [Unhosted](http://unhosted.org/) and
[noBackend](http://nobackend.org/). It also fits cleanly into traditional stacks
by removing protocol-specific code at the application layer.
