---
title: Build a web-based RSS reader
current_page: use-cases
og_description: Fetch RSS and Atom feeds from a JavaScript app, handle publishers without CORS support, and get parsed entries for your reader.
---

# Build a web-based RSS reader

You want a reader that brings posts from several blogs into one page.
Fetching a feed with browser JavaScript can fail before you get to parsing XML:
the publisher must allow cross-origin requests from your app.

A server-side fetch avoids that browser restriction. You can build a fetcher
and parser in your own backend, or use Sockethub's feeds support to request
RSS and Atom feeds and get their entries as JSON.

## Fetch an RSS or Atom feed from JavaScript

Start a local Sockethub instance using the [installation guide](/get-started/).
For a JavaScript app with a bundler, install `@sockethub/client` and
`socket.io-client`. This example uses the 5.0 beta API advertised on this site.

```js
import SockethubClient from '@sockethub/client';

const sc = await SockethubClient.connect('http://localhost:10550');
await sc.ready();

sc.socket.emit('message', {
  '@context': sc.contextFor('feeds'),
  type: 'fetch',
  actor: { id: 'https://sockethub.org/feed.xml', type: 'feed' }
}, result => {
  if (result?.error) {
    console.error('Feed fetch failed:', result.error);
    return;
  }
  for (const entry of result.items) {
    console.log(entry.object.title, entry.object.url);
  }
});
```

The feed URL goes in `actor.id`. The response contains an `items` array;
each item's `object` contains the article fields. See the
[feeds API reference](https://github.com/sockethub/sockethub/blob/v5.0.0-beta.2/packages/platform-feeds/README.md)
for request and response details.

Use your deployed Sockethub URL when you move beyond local development.
An HTTPS reader needs an HTTPS connection to Sockethub too.

## Turn fetched entries into a reader

The request above fetches a feed once. Your app decides when to refresh it.
It also stores subscriptions, tracks read articles, and combines entries from
multiple feeds into a timeline. Use article identifiers to avoid adding the
same entry again on every refresh.

Feed content comes from publishers. Render titles as text, and sanitize any
article HTML before displaying it in your app.

## Choose between Sockethub and your own feed fetcher

If you already have a backend and a feed parser, a dedicated fetch endpoint may
be the smaller addition. Direct browser fetching also works when a publisher
allows your origin.

Sockethub is useful when you want feed fetching and parsing behind an existing
API, especially if your app also uses its chat or other services. You still need
to operate Sockethub and Redis and choose how your reader stores its data.

[Get started](/get-started/) to run Sockethub locally, then replace the example
feed URL with a feed you want to read.
