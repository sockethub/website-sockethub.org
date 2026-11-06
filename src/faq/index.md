---
title: Frequently asked questions
current_page: faq
---

# Frequently asked questions

## What is Sockethub?

Sockethub is an open-source protocol gateway that lets web applications talk to
multiple services through an ActivityStreams 2.0 API. It runs as a server
between your app and those services.

## Which protocols and services does Sockethub support?

Sockethub supports IRC and XMPP chat, email over IMAP and SMTP, RSS and Atom
feeds, CalDAV calendars and tasks, CardDAV contacts, metadata extraction for
link previews, and outgoing Messenger and Instagram messages. You can also
build custom platforms. See the [platforms guide](/platforms/) for details.

## How does Sockethub compare with using each protocol's client directly?

A direct client talks to one service using that protocol's own library and
connection requirements. Sockethub runs the protocol connections on a gateway
and gives your app a shared message format and API. This is useful for browser
apps and apps combining services, but adds a server and Redis to operate and
still requires credentials and protocol-specific configuration.

## How do I self-host Sockethub?

Run Sockethub with Redis using npm, Docker Compose, or the source checkout.
The [get-started guide](/get-started/) covers the prerequisites, commands, and
a client example.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Sockethub?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sockethub is an open-source protocol gateway that lets web applications talk to multiple services through an ActivityStreams 2.0 API. It runs as a server between your app and those services." }
    },
    {
      "@type": "Question",
      "name": "Which protocols and services does Sockethub support?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sockethub supports IRC and XMPP chat, email over IMAP and SMTP, RSS and Atom feeds, CalDAV calendars and tasks, CardDAV contacts, metadata extraction for link previews, and outgoing Messenger and Instagram messages. You can also build custom platforms." }
    },
    {
      "@type": "Question",
      "name": "How does Sockethub compare with using each protocol's client directly?",
      "acceptedAnswer": { "@type": "Answer", "text": "A direct client talks to one service using that protocol's own library and connection requirements. Sockethub runs the protocol connections on a gateway and gives your app a shared message format and API. This is useful for browser apps and apps combining services, but adds a server and Redis to operate and still requires credentials and protocol-specific configuration." }
    },
    {
      "@type": "Question",
      "name": "How do I self-host Sockethub?",
      "acceptedAnswer": { "@type": "Answer", "text": "Run Sockethub with Redis using npm, Docker Compose, or the source checkout. The get-started guide covers the prerequisites, commands, and a client example." }
    }
  ]
}
</script>
