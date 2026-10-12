---
id: ui-h6wg
title: "Ticket links with no daemon row are broken: the ticket page should fall back to the ticket file (regression from ui-utp5)"
kind: bug
created: 2026-10-12
created_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [ui-utp5]
---

The human, 2026-10-12 ~12:05 AM ET, verbatim (to the bridle-ui aide):

> All the links to "related" tickets in the UI for docs/tickets/open/move-a-project-between-machines-with-one-command-bridle-proj-kt25.md are broken links.

and

> Searching for them as documents owrks; i think they are resolved

## What the aide found

bridle's kt25 has `related: [br-24mj, br-kuw2, br-hw6c, br-rjd5, br-sk7p, br-n63z, br-3haz]`.
Each links to `/p/bridle/tickets/<id>` (`ticketHref` in `src/Md.tsx`'s `Anchor`; a qualified ID
always links). The ticket page (`src/Tickets.tsx`) loads the daemon's row
(`ticketDetail`) and says "No ticket <id>" when there is none.

The bridle daemon, 2026-10-12 12:05 AM ET (`GET /v1/tickets/<id>`):

| ID | File | Daemon row |
|---|---|---|
| br-24mj | resolved/ | 404 |
| br-sk7p | resolved/ | 404 |
| br-3haz | resolved/ | 200 |
| br-kuw2 | open/ | 404 |
| br-hw6c | open/ | 404 |
| br-n63z | open/ | 404 |
| br-rjd5 | open/ | 200 |

So resolved or not doesn't decide it. Any ticket **file** with no daemon row is a broken link:
older tickets, and ones filed without a task. The file is there, which is why searching for them
as documents works.

This is a **regression from ui-utp5** (9d04ff6). Before it, `/ticket?project=&id=`
(`src/Ticket.tsx`, deleted there) resolved the ID to its file and showed it as a document.

## The ask

- The ticket page falls back to the ticket file when the daemon has no row: resolve the ID with
  `links/resolve` and show the file as a document (or redirect to `documentHref`). It says
  "No ticket" only when there's neither a row nor a file.
- A test: a qualified ID with a file and no row opens the file.
- Out of scope here: the daemon giving every ticket a row (bridle 22ab, "A row for every
  ticket"). That's bridle's side; until then the UI must not depend on it.
