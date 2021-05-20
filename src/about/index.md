---
title: About
current_page: about
template: about.hbt
---
Sockethub is a translation layer for web applications to communicate with other protocols and services that are traditionally either inaccessible or impractical to use from in-browser JavaScript.

Using [ActivityStream](http://activitystrea.ms/) (AS) objects to pass messages to and from the web app, Sockethub acts as a smart proxy server/agent, which can maintain state, and connect to sockets, endpoints and networks that would otherwise be restricted from an application running in the browser.

Originally inspired as a sister project to [RemoteStorage](https://remotestorage.io/), and assisting in the development of (unhosted)[http://unhosted.org/] and (noBackend)[http://nobackend.org/] applications, Sockethub's functionality can also fit into a more traditional development stack, removing the need for custom code to handle various protocol specifics at the application layer.

Example uses of Sockethub are:

Writing and receiving messages (SMTP, IMAP, Facebook, Twitter, ...)
Instant messaging (XMPP, IRC, MSN, FB Messenger, Hangouts, ...)
Discovery (WebFinger, RDF(a), ...)
The architecture of Sockethub is extensible and supports easy implementation of additional 'platforms' to carry out tasks.
