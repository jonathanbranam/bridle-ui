---
id: br-tecf
title: "Opening by ID: a ticket ID or a task ID, from any project, opens its ticket or task"
kind: feature
created: 2026-10-11
created_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [br-sxs3]
---

## The ask

The human, 2026-10-11 ~8:45 AM ET, verbatim (to the bridle-ui aide):

> when opening a task or ticket, either, if the ID matches a ticket/task in a project, open it

## What it means (the aide's reading; the planner should confirm with the human if unsure)

Wherever the human types or pastes an ID to open something (today the Document page's search
box, "Search tickets and docs, or paste a ticket ID"), accept **either** form and open the match:

- a ticket ID (`sxs3`) or a task ID (`ui-sxs3`, `br-57nt`);
- in **any** project, not only the one selected in the Project dropdown. A task ID's prefix names
  its project (`ui-` bridle-ui, `br-` bridle; the gateway's project list has each prefix). A bare
  ticket ID may match in several projects: open it if only one matches, otherwise list the
  matches to pick from.

Today: `open` in `src/Document.tsx` searches only the selected project, and `resolveOpen`
(`src/doc/comments.ts`) resolves a bare ticket ID to a document there. A task ID, or a ticket in
another project, gives "No document matches".

Where it should land: a task ID whose task has a ticket opens that ticket. A task with no ticket
opens the task view (`/task?id=`). Ticket and task links already exist (`/ticket?project=&id=`,
`/task?id=`); this asks for no new URL format.
