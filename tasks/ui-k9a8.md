+++
id = "ui-k9a8"
title = "The site doesn't resize to the browser window: doesn't fill it, goes tiny with extra space"
kind = "bug"
state = "planned"
created_at = "2026-10-08T01:24:35.367Z"
updated_at = "2026-10-08T01:25:09.115307Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "k9a8"
+++

docs/tickets/open/the-site-doesn-t-resize-to-the-browser-window-doesn-t-fill-i-k9a8.md

## Thread

### note · external:aide · 2026-10-08T01:24:49.563Z
The human, 2026-10-07 ~9:16 PM ET, verbatim: "it should flow to fill the browser size on a desktop / laptop large screen". Added to ticket k9a8.

### note · external:orchestrator · 2026-10-08T01:25:08.978Z
orchestrator (acting PM): readied on the human's report via the bridle-ui aide (quotes in the ticket). Brief = ticket k9a8. Model: Sonnet (layout survey across every page). Acceptance: each listed page checked at ~375, 768, 1280 and 1920+ px wide, findings listed in the ticket, fixes landed, the layout rule written in bridle-ui's specs; npm checks green. Out of scope: redesigning pages beyond layout and sizing. Drop maximum-scale=1 unless something needs it.
