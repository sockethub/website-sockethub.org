---
title: Show upcoming events from an ICS calendar
current_page: use-cases
og_description: Read an ICS or webcal calendar link with Sockethub and use its events in a community website or personal dashboard.
---

# Show upcoming events from an ICS calendar

Your community publishes its schedule as a calendar subscription link. You
want those events on your website without entering each one twice. Or you want
a personal dashboard that includes a holiday calendar alongside your own agenda.

If you have an `.ics` or `webcal://` link, Sockethub can read it and return
structured events. You build the list or calendar view around those results.

## What is an ICS calendar subscription?

An ICS file contains calendar data in the iCalendar format. A subscription
points to a published URL that a calendar app fetches again to check for changes.
It is generally a read-only view of the publisher's calendar.

Saving that URL is only part of a subscription. Your app also needs to remember
it, refresh it, and update the displayed events when the publisher changes them.

## Read events from a published calendar link

[Run Sockethub locally](/get-started/) and install `@sockethub/client` and
`socket.io-client` in your JavaScript app. This example uses the 5.0 beta API.
Replace the example feed URL with your published calendar's HTTPS URL:

```js
import SockethubClient from '@sockethub/client';

const sc = await SockethubClient.connect('http://localhost:10550');
await sc.ready();

const start = new Date();
const end = new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);

sc.socket.emit('message', {
  '@context': sc.contextFor('caldav'),
  type: 'read',
  actor: { id: 'calendar:community', type: 'person' },
  target: { id: 'https://example.org/events.ics', type: 'feed' },
  object: {
    type: 'event',
    startTime: start.toISOString(),
    endTime: end.toISOString()
  }
}, result => {
  if (result?.error) {
    console.error('Calendar unavailable:', result.error);
    return;
  }
  for (const event of result.items) {
    console.log(event.name, event.startTime, event.endTime);
  }
});
```

The UTC date range selects events overlapping the next 90 days. Recurring
events still need expansion before display, as described below.

Despite the `caldav` context name, this request reads a published file. It
requires no CalDAV account, credentials, or calendar-discovery step. The actor
identifies the request; the calendar URL belongs in `target.id`.

The same action accepts `webcal://` links and fetches them over HTTPS. Public
HTTPS destinations are allowed by default. See the
[published calendar API reference](https://github.com/sockethub/sockethub/blob/v5.0.0-beta.1/packages/platform-caldav/README.md#read-a-published-icalendar-feed)
for date-range filters and response details. Use your deployed Sockethub URL
over HTTPS when you deploy the app.

## Keep your events view current

Store the subscription URL and decide how often to read it again. Treat each
response as a snapshot for the requested date range and reconcile changed or
removed events within that range. If a refresh fails, you can retain the previous
snapshot and show when it was last updated.

Recurring events need extra work: Sockethub returns recurrence rules rather
than expanding every occurrence. Your calendar view must expand those rules and
handle exceptions. Preserve all-day dates and time-zone information when
formatting events.

A subscription URL may grant access to a private calendar without a password.
Keep it out of public pages and logs unless the publisher intends it to be public.

## Choose a feed reader or an embedded calendar

If the calendar provider offers an embed and you just need its calendar on a
page, that may be less work. Sockethub is useful when you need event data for
your own layout or want to combine several sources. You still run Sockethub and
Redis and provide storage, refresh scheduling, and the display.

## ICS calendar questions

### Can I edit events through the subscription link?

No. These results are read-only. Editing an account's calendar uses the separate
authenticated CalDAV actions, where supported by the server.

### Does Sockethub keep checking the calendar for changes?

Each `read` request fetches it once. Your app schedules subsequent reads and
stores the subscription.

### Can I use this for holidays or a club's event schedule?

Yes, if the publisher provides a readable ICS link. Test the actual feed,
including recurring and all-day events, before relying on it for your display.

[Get started](/get-started/) to run Sockethub, then read your calendar link and
inspect its events before building the view.
