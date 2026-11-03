---
title: Show link previews in your chat or bookmark app
current_page: use-cases
og_description: Turn pasted URLs into preview cards with a title, description, and image. Fetch page metadata with Sockethub and handle missing previews.
---

# Show link previews in your chat or bookmark app

Someone shares an article in your chat app. A bare URL doesn't tell the rest
of the conversation much. A card with the article's title, description, and
image helps people decide whether to open it. The same card works in a saved-links
collection or a reading list.

## What goes into a link preview?

A preview uses metadata published by the linked page, often through Open Graph
tags. Your app needs to fetch that page and extract the fields before it can
draw the card. Browser requests can be blocked by the publisher's cross-origin
policy, so this usually happens on a server.

Sockethub's metadata support handles fetching and extraction. You send it a
URL and use the returned fields in your own interface.

## Fetch a page's title, description, and image

[Start Sockethub locally](/get-started/) and install `@sockethub/client` and
`socket.io-client` in your JavaScript app. This example uses the 5.0 beta API.
It prints the fields you can use to build a card:

```js
import SockethubClient from '@sockethub/client';

const sc = await SockethubClient.connect('http://localhost:10550');
await sc.ready();

sc.socket.emit('message', {
  '@context': sc.contextFor('metadata'),
  type: 'fetch',
  actor: { id: 'https://sockethub.org/', type: 'website' }
}, result => {
  if (result?.error) {
    console.error('Preview unavailable:', result.error);
    return;
  }
  const page = result.object;
  console.log(page.title, page.description, page.image?.[0]?.url);
});
```

Replace `actor.id` with the shared URL. The response's `object` contains the
page metadata; images are an array, and some pages have none. See the
[metadata API reference](https://github.com/sockethub/sockethub/blob/v5.0.0-beta.1/packages/platform-metadata/README.md)
for the response fields. For deployment, use your own Sockethub URL over HTTPS.

## Build a card that still works when metadata is missing

Keep the original link visible while fetching. Add the title and description
as text, and an image only when one is available. Treat publisher-provided
values as untrusted input: use `textContent` for text and accept only HTTP(S)
URLs for links and images.

A page may block automated requests or publish no useful metadata. Keep the
plain link as the fallback. Cache successful results to avoid fetching the same
article for every message, and provide a way to refresh stale previews.

Fetching a preview contacts the destination website before the reader clicks.
Decide when your app should do that, especially for private messages. External
preview images can also contact the publisher when rendered.

## When should you use your own preview fetcher?

If your backend already extracts page metadata, keep using it. Sockethub is
useful when you want this operation through its existing API, particularly in
an app already using chat or feeds. You still operate Sockethub and Redis and
build the card UI and cache.

## Link preview questions

### Does Sockethub render the preview card?

It returns metadata. Your application chooses the layout, truncates text, and
handles loading and failure states.

### Will every URL have a preview image?

No. Metadata depends on what the publisher exposes and whether the page can be
fetched. A useful card should also work with just a title or a plain URL.

### Can I use this for a bookmark manager?

Yes. Fetch metadata when someone saves a link, then store the fields with that
bookmark. Choose when to fetch them again if the linked page changes.

[Get started](/get-started/) to run the request, then try a URL your users are
likely to share. You can combine this with the [web chat guide](/use-cases/web-chat/).
