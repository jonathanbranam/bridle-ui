+++
id = "ui-rd5f"
title = "Usage page: external sessions in the instance picker, marked, nulls shown as not measured (follow-up to ui-mxkj, br-njjt)"
kind = "feature"
state = "planned"
created_at = "2026-10-13T00:57:41.086Z"
updated_at = "2026-10-13T01:03:49.267071Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
summary = "Usage instance picker now lists external sessions (marked ', external', after hosted agents). toPoint keeps null turns/busy_seconds as null (no Number(null)); for an external session the Turns chart is replaced by a 'not measured' note; token/cost charts as before. Series URL already used encodeURIComponent; test asserts the encoded external id. Types re-synced (UsageInstanceView.external, nullable turns/busy_seconds); unrelated TaskDetail/TaskSummary drift left out. Needs a gateway/daemon with br-njjt; tested with fakes only, end-to-end unverified (incl. gateway accepting an encoded '/' in the path)."
ticket = "rd5f"
+++

docs/tickets/open/usage-page-external-sessions-in-the-instance-picker-marked-n-rd5f.md

## Thread

### note · external:orchestrator · 2026-10-13T00:58:39.783Z
## Brief (orchestrator, acting planner for bridle-ui)

The ask above is the spec; additions:

- **The id in the URL**: an external session's `agent_id` is its identity, e.g. `external:advisor/product-manager`, with a colon and slashes. Build the series URL with `encodeURIComponent(agent_id)` so it stays one path segment. Add a test that asserts the encoded URL. If the gateway turns out not to accept an encoded `/` (it should: axum decodes `Path` after routing), report it on this ticket rather than working around it; that's a bridle fix.
- **Picker**: group or mark external sessions (e.g. an "external" label, as "removed" is marked) and keep hosted agents first.
- **Null handling**: map `null` to "not measured" at the API boundary (`src/usageSeries.ts`). Never `Number(null)`. Keep `bigint`-typed fields converted with `Number` only when not null.
- **Types**: re-sync with the sync script, never by hand.
- **Files likely**: src/Usage.tsx, src/usageSeries.ts, src/api/, src/api/generated/, tests beside them.
- **Tests**: the null mapping, an external instance in the picker, and the encoded URL; with a mocked fetch.
- **Check**: `npm run check` green.
- **Model**: Sonnet.
- **Out of scope, not yet**: any bridle change; comparing instances.
- **Real-data check**: dalek's daemon and gateway need a build with br-njjt (0.7.0+ plus 100f2e19). Fakes are enough for the worker.
