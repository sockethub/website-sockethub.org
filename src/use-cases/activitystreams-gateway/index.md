---
title: ActivityStreams 2.0 gateway
current_page: activitystreams-gateway
---

# ActivityStreams 2.0 gateway

Applications that combine chat, feeds, and other services otherwise need to
handle different protocols and data formats. Sockethub translates between those
services and a shared ActivityStreams 2.0 JSON-LD interface, so an application
can work with a consistent envelope while still supplying platform-specific
details.

For example, this activity sends an XMPP message after credentials are stored
and the connection is established:

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://sockethub.org/ns/context/v1.jsonld",
    "https://sockethub.org/ns/context/platform/xmpp/v1.jsonld"
  ],
  "type": "send",
  "actor": { "id": "alice@chat.example", "type": "person" },
  "target": { "id": "bob@chat.example", "type": "person" },
  "object": { "type": "message", "content": "Hello!" }
}
```

The platform context identifies the destination protocol; supported actions
and fields depend on that platform. [Get started](/get-started/) to run the
gateway and send activities from a client.
