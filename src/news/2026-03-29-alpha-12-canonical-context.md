---
date: 2026-03-29
title: Alpha 12 — Canonical AS2.0 contexts
collection: news
author: Nick Jennings
---

With the 5.0.0-alpha.12 release, Sockethub's message envelope is a first-class
[ActivityStreams 2.0](https://www.w3.org/TR/activitystreams-core/) and JSON-LD
citizen. Every outgoing and incoming message carries a canonical three-element
`@context` array identifying the AS2 base vocabulary, the Sockethub gateway
vocabulary, and the specific platform vocabulary in play.

## What changed

Before:

```json
{
  "context": "irc",
  "type": "send",
  ...
}
```

After:

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://sockethub.org/ns/context/v1.jsonld",
    "https://sockethub.org/ns/context/platform/irc/v1.jsonld"
  ],
  "type": "send",
  ...
}
```

The server now routes by resolving the platform context URL in that array, not
by matching a bespoke `context` string. That unlocks four things:

- **Proper AS2.0 compliance.** Payloads validate against any off-the-shelf
  JSON-LD or AS2 tool — no Sockethub-specific reader required.
- **Deterministic platform resolution.** The platform identity lives in the
  context URL itself, not in convention. No more guessing from a short name.
- **Versioned platform vocabularies.** A platform can ship breaking changes
  under `/v2.jsonld` without forcing every consumer to migrate at once.
- **A real schema registry.** The server exposes each platform's schema
  metadata (`contextUrl`, `contextVersion`, `schemaVersion`) so clients build
  canonical arrays without hardcoding URLs.

## New client APIs

Two additions to `@sockethub/client` make this easy:

### `await sc.ready()`

Waits for the schema registry to finish loading. Messages sent before readiness
are queued and flushed afterward; anything emitted after `ready()` is
validated immediately on the client.

```javascript
const sc = new SockethubClient(socket);
await sc.ready();
```

### `sc.contextFor(platform)`

Builds the canonical three-element array from server metadata. Use it instead
of hardcoding URLs:

```javascript
sc.socket.emit('message', {
  '@context': sc.contextFor('irc'),
  type: 'send',
  actor:  { id: 'alice@irc.libera.chat', type: 'person' },
  target: { id: '#sockethub@irc.libera.chat', type: 'room' },
  object: { type: 'message', content: 'hello' }
});
```

`contextFor()` is preferred over hand-writing the array because it derives URLs
from the live schema registry and stays correct across server versions.

## Backward compatibility

Legacy `context` strings continue to route as before during the alpha
transition. If you're already sending the old shape, nothing breaks — you just
get a subtly nicer error surface when platforms are misregistered. New code
should prefer canonical `@context`.

## Why this matters

Sockethub has always carried the spirit of AS2.0, but not always the letter.
Alpha 12 closes that gap. The protocol gateway now speaks a format that any
AS2 consumer can read — which means an ActivityPub inbox, a Fediverse tool, or
anything that knows JSON-LD can parse Sockethub traffic natively.

Upgrade with `npm install -g sockethub@alpha`.
Full changelog: [v5.0.0-alpha.12](https://github.com/sockethub/sockethub/releases/tag/v5.0.0-alpha.12).
