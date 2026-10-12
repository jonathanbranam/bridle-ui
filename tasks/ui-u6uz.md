+++
id = "ui-u6uz"
title = "A Usage page: week-to-week charts of the five-hour and seven-day limits (UI half of br-yydm)"
kind = "feature"
state = "integrated"
created_at = "2026-10-12T22:41:33.823Z"
updated_at = "2026-10-12T23:14:55.354732Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
branch = "bridle/usage-page"
commit = "5690c8b9ef5e40dfb75472419ce9d02642b7f2cb"
summary = "Usage page at /usage (nav 'Usage'): src/Usage.tsx (page + hand-rolled SVG charts, no new dependency), src/usageWeeks.ts (Eastern Monday-week grouping; five-hour windows by resets_at, assigned to the week they reset in; seven-day per-week peak and reset marks), client usageHistory(), synced UsageHistory/UsagePoint. Uses the first project that answers; a non-2xx OR a 200 with reachable:false shows 'Usage unreachable: <error>', never a chart. Caveat: the bindings/gateway report utilization as a fraction (0.9 = 90%), not percent as the brief implied; I multiply by 100 so hit >= 100% and near >= 90% (near includes hits). Sync script also changed TaskDetail/TaskSummary bindings (unrelated drift); I left those out. Not checked against a real gateway."
ticket = "u6uz"
+++

## The ask

The UI half of br-yydm (bridle), in epic br-rdkn (usage you can trust). The human, 2026-10-05 ~2:55 PM ET (to the aide, ticket br-xxw9): "I'd like to see some charts about how often I go up to my five-hour limit" and the seven-day limit, week to week. Approved 2026-10-12 ~6:35 PM ET (to advisor product-manager): "Agree on 1-3. Let's do it".

A Usage page with week-to-week charts, from the account's usage history:

1. Five-hour limit: for each week, how many five-hour windows reached the limit (or came within 10% of it), and the peak utilization.
2. Seven-day limit: utilization over time, week by week, with each week's peak and where it reset.
3. A daemon that can't be reached is shown as unreachable, never as zero.

Done when: the page shows at least the last four weeks from real history, linked from the nav.

## Brief (orchestrator, acting planner for bridle-ui)

**The route** (landed in bridle f9eae4bf, br-yydm): `GET /api/v1/projects/{project}/usage/history?window=five_hour|seven_day&since=<RFC 3339>` returns `UsageHistory {project, window, points}`, oldest first; each `UsagePoint` is `{utilization: number|null, resets_at: string|null, observed_at: string}` (RFC 3339 UTC). Readings are about every 5 minutes; a flat stretch is one point, so don't assume even spacing. The limits are account-wide: the project only picks which daemon answers, so use one project (the first reachable one from `GET /api/v1/projects`, or `bridle`), not a per-project view.

**Unreachable**: unlike `/system`, this route has no `reachable: false` body. An unknown project is 404; a daemon that is down or has no token is a non-2xx error. Show any error as "unreachable" (with the error text), never as an empty or zero chart.

**Types**: copy `UsageHistory.ts` and `UsagePoint.ts` from the bridle repo's `crates/bridle-gateway/bindings/` into `src/api/generated/` with the sync script (never hand-written; see CLAUDE.md).

**Week grouping**: weeks in US Eastern (the human's zone), Monday start; label times in Eastern, bare ("7:00 AM").
- Five-hour: a window is identified by its `resets_at`; per window take the max utilization; per week count windows with max >= 100 (hit) and >= 90 (near), and the week's peak.
- Seven-day: plot utilization over time; mark each `resets_at` change (a reset) and each week's peak.

**Charts**: keep it simple. Hand-rolled SVG or a small, well-known chart library if one is clearly lighter to use; justify a new dependency in one line in the commit. No CodeMirror or diagram work.

**Files likely**: a new page under `src/` (match how existing pages and routes are laid out), the nav, the API client, `src/api/generated/`, tests beside the page.

**Tests**: vitest for the week grouping (hit/near counts, peak, Eastern week boundary, DST is fine to skip) and a component test for the unreachable state with a mocked fetch. No live gateway needed; dalek's installed gateway gets the route at its next self-upgrade.

**Check**: `npm run check` green.

**Model**: Sonnet.

**Out of scope, not yet**: the per-agent chart (ui-mxkj, waits on br-xfy7); cost (dollars) charts; any change to the bridle repo.

## Thread

### note · external:advisor/product-manager · 2026-10-12T22:42:30.883Z
From advisor (product-manager): the route (from pm-1, bridle's planner): GET /projects/{project}/usage/history?window=&since= on the gateway, returning RateLimitPoint series oldest first (br-xxw9's types); built in br-yydm. bridle-ui's planner briefs this once br-yydm lands.

### note · external:advisor/product-manager · 2026-10-12T23:10:42.695Z
From advisor (product-manager): br-yydm landed (f9eae4bf): GET /api/v1/projects/{project}/usage/history?window=&since= on the gateway; TS bindings UsageHistory.ts and UsagePoint.ts in crates/bridle-gateway/bindings; an unreachable daemon is a 200 with reachable: false and error. Unblocked: ready for bridle-ui's planner.

### note · external:orchestrator · 2026-10-12T23:11:50.368Z
## The ask

The UI half of br-yydm (bridle), in epic br-rdkn (usage you can trust). The human, 2026-10-05 ~2:55 PM ET (to the aide, ticket br-xxw9): "I'd like to see some charts about how often I go up to my five-hour limit" and the seven-day limit, week to week. Approved 2026-10-12 ~6:35 PM ET (to advisor product-manager): "Agree on 1-3. Let's do it".

A Usage page with week-to-week charts, from the account's usage history:

1. Five-hour limit: for each week, how many five-hour windows reached the limit (or came within 10% of it), and the peak utilization.
2. Seven-day limit: utilization over time, week by week, with each week's peak and where it reset.
3. A daemon that can't be reached is shown as unreachable, never as zero.

Done when: the page shows at least the last four weeks from real history, linked from the nav.

## Brief (orchestrator, acting planner for bridle-ui)

**The route** (landed in bridle f9eae4bf, br-yydm): `GET /api/v1/projects/{project}/usage/history?window=five_hour|seven_day&since=<RFC 3339>` returns `UsageHistory {project, window, points}`, oldest first; each `UsagePoint` is `{utilization: number|null, resets_at: string|null, observed_at: string}` (RFC 3339 UTC). Readings are about every 5 minutes; a flat stretch is one point, so don't assume even spacing. The limits are account-wide: the project only picks which daemon answers, so use one project (the first reachable one from `GET /api/v1/projects`, or `bridle`), not a per-project view.

**Unreachable**: unlike `/system`, this route has no `reachable: false` body. An unknown project is 404; a daemon that is down or has no token is a non-2xx error. Show any error as "unreachable" (with the error text), never as an empty or zero chart.

**Types**: copy `UsageHistory.ts` and `UsagePoint.ts` from the bridle repo's `crates/bridle-gateway/bindings/` into `src/api/generated/` with the sync script (never hand-written; see CLAUDE.md).

**Week grouping**: weeks in US Eastern (the human's zone), Monday start; label times in Eastern, bare ("7:00 AM").
- Five-hour: a window is identified by its `resets_at`; per window take the max utilization; per week count windows with max >= 100 (hit) and >= 90 (near), and the week's peak.
- Seven-day: plot utilization over time; mark each `resets_at` change (a reset) and each week's peak.

**Charts**: keep it simple. Hand-rolled SVG or a small, well-known chart library if one is clearly lighter to use; justify a new dependency in one line in the commit. No CodeMirror or diagram work.

**Files likely**: a new page under `src/` (match how existing pages and routes are laid out), the nav, the API client, `src/api/generated/`, tests beside the page.

**Tests**: vitest for the week grouping (hit/near counts, peak, Eastern week boundary, DST is fine to skip) and a component test for the unreachable state with a mocked fetch. No live gateway needed; dalek's installed gateway gets the route at its next self-upgrade.

**Check**: `npm run check` green.

**Model**: Sonnet.

**Out of scope, not yet**: the per-agent chart (ui-mxkj, waits on br-xfy7); cost (dollars) charts; any change to the bridle repo.

### note · external:advisor/product-manager · 2026-10-12T23:12:04.141Z
Correction (advisor product-manager): my note above was wrong: the usage-history route has no reachable:false body; an unreachable daemon is an HTTP error (crates/bridle-gateway/src/system.rs usage_history_route), as the orchestrator's brief says. The page shows that error as unreachable.

### note · agent:usage-page · 2026-10-12T23:14:40.889Z
Could not mark built: 'bridle ticket built u6uz --branch bridle/usage-page --commit 717186a' and 'bridle task built ui-u6uz ...' both fail with 'error: unknown: ' (no detail). Work is committed on bridle/usage-page at 717186a, check green.

### note · agent:manager-2 · 2026-10-12T23:14:51.894Z
integrated: 5690c8b9ef5e40dfb75472419ce9d02642b7f2cb (branch bridle/usage-page)

### note · agent:manager-2 · 2026-10-12T23:14:55.354Z
cleanup: removed agent usage-page, branch bridle/usage-page
