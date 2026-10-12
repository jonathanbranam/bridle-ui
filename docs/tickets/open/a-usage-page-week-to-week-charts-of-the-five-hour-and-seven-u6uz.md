---
id: ui-u6uz
title: "A Usage page: week-to-week charts of the five-hour and seven-day limits (UI half of br-yydm)"
kind: feature
created: 2026-10-12
created_by: external:advisor/product-manager
theme: performance
repos: [bridle-ui]
changes: []
specs: []
blocked_by: [br-yydm]
related: [br-rdkn, br-xxw9]
parent: br-rdkn
---

## The ask

The UI half of br-yydm (bridle), in epic br-rdkn (usage you can trust). The human, 2026-10-05 ~2:55 PM ET (to the aide, ticket br-xxw9): "I'd like to see some charts about how often I go up to my five-hour limit" and the seven-day limit, week to week. Approved 2026-10-12 ~6:35 PM ET (to advisor product-manager): "Agree on 1-3. Let's do it".

A Usage page with week-to-week charts, from the account's usage history (the gateway route br-yydm adds, proxying the daemon's `GET /v1/usage/history`; one reading every ~5 min per window, each with utilization and resets_at):

1. Five-hour limit: for each week, how many five-hour windows reached the limit (or came within 10% of it), and the peak utilization.
2. Seven-day limit: utilization over time, week by week, with each week's peak and where it reset.
3. A daemon that can't be reached is shown as unreachable, never as zero.

Done when: the page shows at least the last four weeks from real history, linked from the nav.
