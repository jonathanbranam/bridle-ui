---
id: ui-jgg8
title: The UI's to-do views show the human's to-dos as tickets (ui-utp5 last slice; after bridle br-cy4q)
kind: feature
created: 2026-10-11
created_by: external:orchestrator
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [ui-utp5]
---

## The ask

Item 6 of ui-utp5, split out so the rest can go now (the PdM, 2026-10-11, on ui-utp5's thread). The human's to-dos become normal tickets in bridle (br-cy4q, 22ab step 7b, queued after br-res3). Once br-cy4q lands, the to-do views (src/Items.tsx and what it calls in src/api/client.ts) show and act on to-dos as tickets: list, open, done/decline. Don't start before br-cy4q has landed in bridle; the PdM posts on ui-utp5's thread when it does. Acceptance: npm run check passes; the Items view lists the human's open to-do tickets and done/decline act on them. Model: Sonnet.
