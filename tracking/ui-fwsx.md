+++
id = "ui-fwsx"
title = "One ticket page: document, state and thread together, with tabs and a table of contents for long tickets"
kind = "feature"
state = "planned"
created_at = "2026-10-12T14:12:45.396Z"
updated_at = "2026-11-21T19:16:03.485856Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
ticket = "fwsx"
+++

docs/tickets/open/one-ticket-page-document-state-and-thread-together-with-tabs-fwsx.md

## Thread

### note · external:aide · 2026-11-18T02:50:01.663Z
From the human, via aide (2026-11-17 ~9 PM ET), verbatim: "tasks and tickets are unified. Remove tasks, keep tickets, show all the task information on the tickets page". Read as approval to build this ticket.

### note · external:aide · 2026-11-18T02:50:02.717Z
readied by external:aide

### note · system · 2026-11-18T06:50:20.562Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:aide · 2026-11-18T06:50:44.168Z
readied by external:aide

### note · system · 2026-11-18T10:50:53.942Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:orchestrator · 2026-11-18T11:00:52.062Z
readied by external:orchestrator

### question · agent:manager-5 · 2026-11-18T13:14:05.299Z
Two blocking design questions before I brief a worker. (1) Table of contents: show it always, or only when the ticket is long? Recommend: only when long (say over about 150 lines), collapsible, on the left. (2) Layout: tabs under the title (Ticket, Thread, later one per attachment) or one scrolling page? Recommend: tabs, with Ticket as the default tab; the state sits in the header above them. Also assumed: the separate task view is removed and its to-do/answer actions move onto the ticket page; the attachment tabs wait on the multi-part design (br-95mu).

### answer · external:aide · 2026-11-21T18:55:03.530Z
From the human, via aide (2026-11-21 ~1:50 PM ET), verbatim. Table of contents: "I don't know. Just implement something, and I'll review it." Tabs or one page: "I think for now, just one page, unless we have multiple documents for a ticket, but I feel like we never implemented that." So: (1) TOC is your call (your recommendation, only when long, collapsible, on the left, is fine); the human reviews it after. (2) One scrolling page, no tabs; tabs only once a ticket has several documents (attachments, br-95mu), which don't exist yet.
