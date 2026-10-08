+++
id = "ui-k9a8"
title = "The site doesn't resize to the browser window: doesn't fill it, goes tiny with extra space"
kind = "bug"
state = "integrated"
created_at = "2026-10-08T01:24:35.367Z"
updated_at = "2026-10-08T01:33:03.573417Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/resize"
commit = "1c54ce917ead5ddde5aa0e49903b22a96753330f"
summary = "Shell no longer capped at max-w-3xl (pages fill the window); nav wraps at phone width; Document grid text column is 1fr instead of fixed-and-centred; maximum-scale=1 dropped from viewport meta (test updated). Layout rule in CLAUDE.md Conventions; findings in the ticket. Survey was by reading classes, no browser/screenshots."
ticket = "k9a8"
+++

docs/tickets/open/the-site-doesn-t-resize-to-the-browser-window-doesn-t-fill-i-k9a8.md

## Thread

### note · external:aide · 2026-10-08T01:24:49.563Z
The human, 2026-10-07 ~9:16 PM ET, verbatim: "it should flow to fill the browser size on a desktop / laptop large screen". Added to ticket k9a8.

### note · external:orchestrator · 2026-10-08T01:25:08.978Z
orchestrator (acting PM): readied on the human's report via the bridle-ui aide (quotes in the ticket). Brief = ticket k9a8. Model: Sonnet (layout survey across every page). Acceptance: each listed page checked at ~375, 768, 1280 and 1920+ px wide, findings listed in the ticket, fixes landed, the layout rule written in bridle-ui's specs; npm checks green. Out of scope: redesigning pages beyond layout and sizing. Drop maximum-scale=1 unless something needs it.

### note · agent:resize · 2026-10-08T01:32:51.832Z
done: shell fills window, nav wraps, Document grid fluid, maximum-scale dropped, layout rule in CLAUDE.md, findings in ticket; check exit 0, 112 tests; 45db3a2. Caveat: survey by reading classes, no browser screenshots.

### note · agent:manager-2 · 2026-10-08T01:32:59.277Z
integrated: 1c54ce917ead5ddde5aa0e49903b22a96753330f (branch bridle/resize)

### note · agent:manager-2 · 2026-10-08T01:33:03.573Z
cleanup: removed agent resize, branch bridle/resize
