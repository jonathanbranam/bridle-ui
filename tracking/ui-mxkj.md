+++
id = "ui-mxkj"
title = "Usage page: pick an agent instance and chart its usage over time (UI half of br-xfy7)"
kind = "feature"
state = "planned"
created_at = "2026-10-12T22:53:13.449Z"
updated_at = "2026-10-13T00:15:06.011801Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
ticket = "mxkj"
+++

docs/tickets/open/usage-page-pick-an-agent-instance-and-chart-its-usage-over-t-mxkj.md

## Thread

### note · external:advisor/product-manager · 2026-10-13T00:14:23.567Z
From advisor (product-manager): br-xfy7 landed (9a10c919), unblocking this. Gateway routes: GET /api/v1/projects/{project}/usage/agents?since= (UsageInstance list: agent_id, name, role, model, removed, turns, cost_usd, first_turn_at, last_turn_at; newest first) and GET /api/v1/projects/{project}/usage/agents/{agent_id}/series?since=&bucket=hour|day (UsageSeries: points oldest first, empty buckets omitted, UTC starts; tokens input/output/cache_read/cache_write, cost_usd, busy_seconds, turns). Types in bridle's crates/bridle-api/src/types.rs. External sessions (br-hd28, landed) may appear as instances. Note: dalek's daemons get these routes at the next upgrade/restart (see br-jp52).

### note · external:advisor/product-manager · 2026-10-13T00:14:55.360Z
Correction (advisor product-manager): external sessions are NOT instances in br-xfy7's routes yet; br-njjt adds them (additive, an external mark). Build mxkj for hosted agents now; show the mark when njjt lands.

### note · external:orchestrator · 2026-10-13T00:15:05.987Z
## Brief (orchestrator, acting planner for bridle-ui)

Goal: on the Usage page (src/Usage.tsx, from ui-u6uz), the human picks one agent instance and a period and sees its usage over time. The ask is above (the human, 2026-10-12 ~6:50 PM ET: "When this is done I want to be able to choose a specific agent instance and chart its usage").

**Routes** (bridle 9a10c919, br-xfy7; doc: bridle's docs/design/human-web-ui.md):
- `GET /api/v1/projects/{project}/usage/agents?since=<RFC 3339>`: `UsageInstances` (list of `UsageInstanceView`: agent_id, name, role, model, removed, turns, cost_usd, first_turn_at, last_turn_at), newest first.
- `GET /api/v1/projects/{project}/usage/agents/{agent_id}/series?since=&bucket=hour|day`: `UsageSeriesView`, points oldest first, **empty buckets omitted** (fill gaps with zero when drawing, don't join across them), bucket `start` in UTC.
- Unlike the account-wide limits, these are **per project**: pick the project first (from `GET /api/v1/projects`), then the instance.
- Errors: an unknown project is 404; an unreachable daemon is a non-2xx error. Show "unreachable" with the error, never an empty chart. A daemon without the route yet (not upgraded) also fails: same handling.

**Types**: copy `UsageInstances.ts`, `UsageInstanceView.ts`, `UsageSeriesView.ts`, `UsageSeriesBucket.ts` from bridle's `crates/bridle-gateway/bindings/` with the sync script. Trap: the token and busy fields are typed `bigint`, but `JSON.parse` gives plain numbers. Convert with `Number(...)` at the boundary (or check how the UI already handles a generated `bigint`); don't use bigint arithmetic.

**UI**:
- Pickers: project, then instance (label: name, role, model, "removed" when removed), period (last 24 h / 7 days / 30 days), bucket (hour for 24 h, day otherwise; let the human switch).
- Chart: tokens stacked by kind (input, output, cache read, cache write), with cost and turns as a second chart or a toggle. Reuse whatever charting ui-u6uz used; no new dependency.
- Times in US Eastern, written bare.
- Agents only. External sessions (hd28) are not instances in this route (they live in a separate table), so leave them out; "later the external sessions too" in the ask is not this ticket.

**Files likely**: src/Usage.tsx (or a new component beside it), src/api/ (client calls), src/api/generated/, tests beside them.

**Tests**: vitest for the gap filling and bigint-to-number conversion; a component test that picking an instance fetches its series and draws it, and one for the unreachable state, with a mocked fetch.

**Check**: `npm run check` green.

**Model**: Sonnet.

**Out of scope, not yet**: external sessions as instances; comparing two instances; any bridle repo change.
