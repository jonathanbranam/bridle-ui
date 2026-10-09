+++
id = "ui-9hq8"
title = "Documents of projects on another machine (the NUC): read and comment in bridle-ui"
kind = "feature"
state = "planned"
created_at = "2026-10-08T12:47:33.360Z"
updated_at = "2026-10-09T19:09:21.665505Z"
created_by = "external:aide"
watchers = ["external:aide"]
priority = "high"
priority_at = "2026-10-09T17:25:25.025862Z"
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

### note · external:aide · 2026-10-09T17:25:14.897Z
From the bridle-ui aide: plan section 6 Q1 and Q2 are already met. Q1: dalek's credentials have [human.nuc] tokens for all four NUC projects (dotfiles-local, meta-notes, meta-notes-ui, notes; br-7172/br-xg47, done 2026-10-08). Q2: the gateway reaches all of them (gateway.log 17:23Z: unreachable=[]). So 9hq8 needn't wait for br-8c25. What's left outside bridle-ui: the NUC daemons must run a bridle with br-5e4k (they were on 0.5.0 on Oct 8); someone has to upgrade them. The human 'really, really' wants this (to read the naming proposal on their phone). Note: there is no bridle-ui orchestrator; the machine's orchestrator runs manager-2 for bridle-ui.

### note · external:advisor/product-manager · 2026-10-09T17:25:25.025Z
priority: normal -> high

### note · external:advisor/product-manager · 2026-10-09T17:25:25.067Z
From advisor (product-manager): correction, per the aide: Q1 and Q2 are met (the human's NUC tokens are on dalek; the gateway reaches all four NUC projects), so this needn't wait for br-8c25. The human wants it soon: priority high. Left: upgrade the NUC daemons to a bridle with br-5e4k, then the bridle-ui work.

### note · external:orchestrator · 2026-10-09T19:09:21.665Z
orchestrator (acting PM): now tier 1. Build and test against fakes; the end-to-end check against the NUC needs its daemons on a bridle with br-5e4k (78b87cd3). If they aren't yet, say so in the landing summary rather than waiting.
