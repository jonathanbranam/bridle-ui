---
id: ui-tst8
title: Ticket page shows its task and thread; ticket links work after resolve
kind: bug
created: 2026-11-26
created_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: []
---

Filed by the aide from the human's words, 2026-11-26 (verbatim):

> I'm just extremely frustrated that this stuff hasn't been fixed yet, but there are at least two significant bugs and issues that are causing problems for me constantly with the ticket UI and the underlying implementation:
> * Tickets and tasks are still separate pages in the UI. This is just extremely frustrating.
> * When a task is completed, the task has a link to the ticket. When the task is completed and the ticket is marked resolved, the link that shows up in the UI is not updated because the ticket's changed folders from open to resolved, or whatever it's called. The link doesn't work, so I can't navigate from the task to the ticket to the resolved ticket anymore.
>
> Both of those things should be completely seamless. If I open the ticket URL, it should show me the ticket, no matter if it's open or resolved, and it should show me the task and all the task metadata. The task thread should be in a tab there.

## The ask

1. One page per ticket: the ticket URL (`/p/<project>/tickets/<id>`) shows the ticket, its task and all task metadata, with the task thread in a tab. The separate task page goes away (old task URLs redirect to the ticket page).
2. Ticket links resolve by ID, never by folder path: a ticket opens the same whether it is open or resolved, and a task's link to its ticket keeps working after the ticket moves to resolved.
3. If the gateway or `bridle link` needs a change for (2), file it on the bridle project and name it here; update the URL-scheme "Final formats" table if any URL changes (CLAUDE.md, link formats).

Verify in a browser on a throwaway site: open a task whose ticket is resolved, follow the link, see the ticket with task metadata and the thread tab.
