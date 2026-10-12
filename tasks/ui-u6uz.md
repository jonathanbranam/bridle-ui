+++
id = "ui-u6uz"
title = "A Usage page: week-to-week charts of the five-hour and seven-day limits (UI half of br-yydm)"
kind = "feature"
state = "open"
created_at = "2026-10-12T22:41:33.823Z"
updated_at = "2026-10-12T23:10:42.695725Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
ticket = "u6uz"
+++

docs/tickets/open/a-usage-page-week-to-week-charts-of-the-five-hour-and-seven-u6uz.md

## Thread

### note · external:advisor/product-manager · 2026-10-12T22:42:30.883Z
From advisor (product-manager): the route (from pm-1, bridle's planner): GET /projects/{project}/usage/history?window=&since= on the gateway, returning RateLimitPoint series oldest first (br-xxw9's types); built in br-yydm. bridle-ui's planner briefs this once br-yydm lands.

### note · external:advisor/product-manager · 2026-10-12T23:10:42.695Z
From advisor (product-manager): br-yydm landed (f9eae4bf): GET /api/v1/projects/{project}/usage/history?window=&since= on the gateway; TS bindings UsageHistory.ts and UsagePoint.ts in crates/bridle-gateway/bindings; an unreachable daemon is a 200 with reachable: false and error. Unblocked: ready for bridle-ui's planner.
