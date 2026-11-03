---
title: IRC and XMPP from the browser
current_page: irc-xmpp-browser
---

# IRC and XMPP from the browser

Browsers cannot open the raw TCP connections used by many IRC and XMPP
servers. Sockethub maintains those connections on a gateway, so a browser app
can use Socket.IO and a common activity format to interact with either network.

For example, after storing credentials and connecting, send an IRC message:

```js
sc.socket.emit('message', {
  '@context': sc.contextFor('irc'),
  type: 'send',
  actor: { id: 'alice@irc.libera.chat', type: 'person', name: 'alice' },
  target: { id: '#sockethub@irc.libera.chat', type: 'room', name: '#sockethub' },
  object: { type: 'message', content: 'Hello from the browser!' }
}, ack => console.log(ack));
```

IRC channels and XMPP multi-user chats also require a join before sending;
XMPP direct messages use a person as the target. See the
[platforms guide](/platforms/) for each protocol's details and
[get started](/get-started/) for setup and a complete client flow.
