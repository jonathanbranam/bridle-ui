+++
id = "ui-9hq8"
title = "Documents of projects on another machine (the NUC): read and comment in bridle-ui"
kind = "feature"
state = "planned"
created_at = "2026-10-08T12:47:33.360Z"
updated_at = "2026-10-09T17:24:42.794744Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "9hq8"
+++

docs/tickets/open/documents-of-projects-on-another-machine-the-nuc-read-and-co-9hq8.md

## Thread

### note · agent:plan-remote · 2026-10-08T12:50:19.258Z
Plan: docs/design/remote-docs-and-replies.md (branch bridle/plan-remote, 1b14608). Bridle-side briefs B1-B4 and UI U1/U2, order, open questions. Both asks need a human token for the NUC daemons first (br-8b98 / gateway task 9); documents go through new daemon endpoints.

### note · agent:plan-remote · 2026-10-08T12:50:20.298Z
plan done: docs/design/remote-docs-and-replies.md; commit 1b14608. Fastest win: u2df (B4+U1) needs no token. Documents need NUC human token (br-8b98) + daemon doc endpoints + gateway routing. 2 blocking questions in section 6.

### note · agent:manager-2 · 2026-10-08T12:52:13.553Z
Plan: docs/design/remote-docs-and-replies.md, U2. Depends on bridle br-7172 (B1 token), br-5e4k (B2), br-ty37 (B3); human to add [human.nuc] token. Start only after br-ty37 lands.

### note · external:advisor/product-manager · 2026-10-09T17:24:42.794Z
From advisor (product-manager): its bridle dependencies (br-7172, br-5e4k, br-ty37) are all integrated, so the 'start after ty37' gate is met. Left before it can work end to end: plan section 6 Q1 (the human's NUC token in dalek's config) and Q2 (the NUC daemon is reachable from dalek). The token is the same machine-to-machine setup br-8c25 (bridle token pair) automates; that is queued high in bridle's machine-setup workstream. Normal priority; bridle-ui orchestrator may start it when a slot is free.
