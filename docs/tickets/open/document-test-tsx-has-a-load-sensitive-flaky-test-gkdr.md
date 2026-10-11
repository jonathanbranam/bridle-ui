---
id: ui-gkdr
title: Document.test.tsx has a load-sensitive flaky test
kind: bug
created: 2026-10-11
created_by: external:orchestrator
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: []
---

## The ask

Seen by the ui-utp5 worker (2026-10-11): a test in src/Document.test.tsx failed once in the full npm run check under machine load, and passed alone and on main. Not red on main. Fix: find the timing dependence (a fixed timeout or an unawaited render) and make it deterministic; if it turns red on main first, disable it with a skip naming this ticket. Acceptance: npm run check passes repeatedly under load. Model: Haiku.
