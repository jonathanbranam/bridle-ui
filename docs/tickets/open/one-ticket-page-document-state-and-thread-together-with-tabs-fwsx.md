---
id: ui-fwsx
title: "One ticket page: document, state and thread together, with tabs and a table of contents for long tickets"
kind: feature
created: 2026-10-12
created_by: external:advisor/product-manager
theme: human-ui
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [ui-utp5, br-tj7q]
---

## The ask

The human, 2026-10-12 ~10:10 AM ET (to advisor product-manager, dictated while looking at bridle
epic br-kx5u in the UI), verbatim:

> I'm pulling this up. It looks like a task with a thread. Actually, the way this works here, as a
> note for the future, is pretty bizarre. The task and the ticket are two separate things in
> bridle-ui.
>
> Let's add a follow-up for me to review: this UI should be unified. The user shouldn't need to
> know about this fact that we have a different table and a different storage system for tasks and
> tickets. It should live in one place. It should be a ticket, and when I view a ticket, it should
> show the document, as well as the status threads and all this stuff that used to live on a task.
>
> It would be good. I think we're leaning towards the need for a table of contents, or an
> expanding/collapsing table of contents on the left for a ticket, because they're getting really
> long. They're going to have multiple parts anyway. We haven't designed how they have multiple
> documents inside of one ticket, so that's all kind of pending based on that.
>
> Maybe just for a ticket that's really long, when the text is really long, a table of contents
> makes sense, but maybe it is more optional. If we have, at the top, below the line that has the
> title of the ticket, we could have a tab list/nav bar thing that shows the ticket document itself
> and the thread. Other files within the document would be maybe broken out up there.
>
> I'm not exactly sure what the shape of the UI is, but it's something to work on in the future.

## What this asks (PdM reading; the human reviews before any design or build)

1. **One ticket page.** Viewing a ticket shows everything about it in one place: the ticket
   document, its state, its thread and what used to live on the task view. The human never needs
   to know there is a task row and a ticket file behind it.
2. **Navigation for long tickets.** A table of contents on the left (expand and collapse), perhaps
   only when the ticket is long.
3. **Tabs under the title.** A tab or nav bar below the title line: the ticket document, the thread,
   and later each extra part of the ticket.

## Depends on, and related

- ui-utp5 (landed 2026-10-11) renamed the UI to say ticket and reads the ask and thread from the
  ticket; this goes further: one page, not a task view next to a ticket view.
- The multi-part ticket design (bridle epic `attachments`, and bridle br-95mu, waiting on the
  human's review) decides what the extra tabs hold. Point 3's "other files" waits on it; points 1
  and 2 do not.
- bridle br-22ab (everything is a ticket) is the data-side move this follows.

Open for the human: the shape of the page (TOC always or only when long; tabs vs one scrolling
page). A design pass comes first, once the human has reviewed this.

## Part of epic br-tj7q (2026-10-16)

The human, 2026-10-16 ~10:30 PM ET, to advisor (product-manager): "I want UI as part of this. I
want attachments as tabs or document picker inside a ticket." and "where is the ticket to combine
task and ticket in the UI? File that here as well". This ticket is the UI part of bridle epic
br-tj7q (change stages on every ticket): one ticket page with the document, state and thread,
plus the ticket's attachments (proposal, design, specs, tasks and other files) as tabs or a
document picker. Designed with br-tj7q's design pass.
