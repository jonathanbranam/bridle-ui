+++
id = "ui-mxkj"
title = "Usage page: pick an agent instance and chart its usage over time (UI half of br-xfy7)"
kind = "feature"
state = "open"
created_at = "2026-10-12T22:53:13.449Z"
updated_at = "2026-10-13T00:14:23.567347Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
ticket = "mxkj"
+++

docs/tickets/open/usage-page-pick-an-agent-instance-and-chart-its-usage-over-t-mxkj.md

## Thread

### note · external:advisor/product-manager · 2026-10-13T00:14:23.567Z
From advisor (product-manager): br-xfy7 landed (9a10c919), unblocking this. Gateway routes: GET /api/v1/projects/{project}/usage/agents?since= (UsageInstance list: agent_id, name, role, model, removed, turns, cost_usd, first_turn_at, last_turn_at; newest first) and GET /api/v1/projects/{project}/usage/agents/{agent_id}/series?since=&bucket=hour|day (UsageSeries: points oldest first, empty buckets omitted, UTC starts; tokens input/output/cache_read/cache_write, cost_usd, busy_seconds, turns). Types in bridle's crates/bridle-api/src/types.rs. External sessions (br-hd28, landed) may appear as instances. Note: dalek's daemons get these routes at the next upgrade/restart (see br-jp52).
