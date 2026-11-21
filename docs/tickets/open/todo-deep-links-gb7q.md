---
id: ui-gb7q
title: "To-do deep links: route /p/<project>/todos/<id> and redirect a task page that loads a to-do (UI half of br-bnfs)"
kind: fix
created: 2026-11-21
created_by: external:orchestrator
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: []
---

## The ask

UI half of bridle br-bnfs (landed on bridle main). The human, 2026-10-09 ~10:40 PM ET, verbatim: "the deep link in bridle ui for human-claimed tickets fails to open because it opens as a task and not a todo; the UI or backend should discover this is a human todo and open the proper page; this should also happen if the user types a todo id into the task page, instead of saying 'not found' it should open the todo page and scroll the todo into view."

The gateway's task summary and detail now carry `todo: bool`, and `bridle link` prints /p/<project>/todos/<id> for a human to-do.

1. Add the route /p/<project>/todos/<id>: the to-do page with that to-do scrolled into view.
2. When the task page loads a task with `todo: true` (including an id typed in), redirect to that route instead of 'not found'.

Acceptance: npm run check green; a worker clicks both paths through in a browser (playwright-cli) before landing. Model: Sonnet. Priority low.
