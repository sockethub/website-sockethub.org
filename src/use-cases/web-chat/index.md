---
title: Add IRC and XMPP chat to your web app
current_page: use-cases
og_description: Build a community chat page or custom messaging client that connects to existing IRC channels and XMPP contacts.
---

# Add IRC and XMPP chat to your web app

Your community already talks in an IRC channel. You want people to join that
conversation from your website, using an interface you control. Or you're
building a messaging app that needs to work with people's existing XMPP accounts.

The work includes more than drawing a message list. Your app needs to log in,
join rooms, receive messages, and report connection failures. Sockethub provides
the protocol connection and messaging API; you build the interface around it.

## Connect a web interface to an existing chat network

Browser JavaScript cannot open the raw TCP connections used by IRC servers.
XMPP can support browser connections through WebSocket or BOSH, depending on
the server. That can be a good option for an XMPP-only app.

With Sockethub, your frontend uses its JavaScript client for both IRC and XMPP.
You still configure each account and address messages for the right network.
An IRC channel and an XMPP room remain separate conversations; sending a message
to one does not copy it into the other.

## Send a message to an IRC channel

First, follow the [client setup example](/get-started/) to connect your client,
store IRC credentials, connect to the IRC server, and join a channel.
After those steps succeed, this request sends a message to that channel:

```js
sc.socket.emit('message', {
  '@context': sc.contextFor('irc'),
  type: 'send',
  actor: { id: 'alice@irc.libera.chat', type: 'person', name: 'alice' },
  target: { id: '#sockethub@irc.libera.chat', type: 'room', name: '#sockethub' },
  object: { type: 'message', content: 'Hello from the community website!' }
}, result => {
  if (result?.error) {
    console.error('Message failed:', result.error);
    return;
  }
  console.log('Message sent:', result);
});
```

Here, `sc` is the connected client from the setup example. The actor must match
the account you connected, and the target must match the channel you joined.
Listen for incoming `message` events to update your conversation view. The
[IRC and XMPP examples](/platforms/) cover credentials, rooms, and direct messages.

## Decide what your chat app owns

You need to build the message list, compose box, account controls, and error
states. Decide how to store conversation history and how people sign back in
after a page reload. Sockethub is one part of that application.

If you only need to put an existing chat client on a website, embedding that
client may be less work. If you're building an XMPP-only client and your server
supports browser connections, a dedicated XMPP library may fit better.
Sockethub is useful when you want your own interface across supported networks
and are prepared to run Sockethub and Redis.

[Get started](/get-started/) with the complete connect, join, and send example
before adding your own chat UI.
