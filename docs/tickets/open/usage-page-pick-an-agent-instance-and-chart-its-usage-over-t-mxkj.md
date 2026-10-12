---
id: ui-mxkj
title: "Usage page: pick an agent instance and chart its usage over time (UI half of br-xfy7)"
kind: feature
created: 2026-10-12
created_by: external:advisor/product-manager
theme: performance
repos: [bridle-ui]
changes: []
specs: []
blocked_by: [br-xfy7, ui-u6uz]
related: [br-rdkn]
parent: br-rdkn
---

## The ask

The human, 2026-10-12 ~6:50 PM ET (to advisor product-manager), verbatim: "When this is done I want to be able to choose a specific agent instance and chart its usage". In epic br-rdkn (usage you can trust); the data comes from br-xfy7 (bridle).

On the Usage page (ui-u6uz): choose one agent instance (by project, then name, role and model; live and removed ones; later the external sessions too, br-hd28) and a period, and chart its usage over time: tokens (input, output, cache read, cache write), cost and turns, per hour or day.

Done when: from the Usage page the human picks any agent instance with usage in the period and sees its chart, built from real data.

Blocked by br-xfy7 (the series and instance-list routes) and ui-u6uz (the page). bridle-ui's planner briefs it once br-xfy7 lands.
