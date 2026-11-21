---
id: ui-5bev
title: "Ticket page: a short ticket's document text may not render (seen in ui-fwsx's browser check)"
kind: fix
created: 2026-11-21
created_by: external:orchestrator
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [ui-fwsx]
---

## The ask

ui-fwsx (one ticket page, landed 89cb84e) was browser-checked at 375 to 1920 wide, but in the worker's fixture a short ticket's document text did not show on the page; only the row's ask did. A unit test covers it, the browser did not.

Check in a browser (playwright-cli, against a throwaway site with a short ticket that has a file) whether a short ticket's document text renders on the ticket page. If it does not, fix it so the document text shows (the row's ask is not a substitute). If it does render and the fixture was the problem, fix the fixture so the browser check covers it.

Acceptance: npm run check green; a browser click-through shows a short ticket's document text; result noted on this thread. Model: Sonnet. Small fix.
