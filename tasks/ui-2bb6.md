+++
id = "ui-2bb6"
title = "Time page: re-sync interaction types and verify client against gateway report.rs"
kind = "chore"
state = "planned"
created_at = "2026-10-03T22:14:41.027Z"
updated_at = "2026-10-03T22:15:00.870378Z"
size = "S"
+++

Run npm run sync-types (bridle main 9bd4587 has the handlers). Check the query params, paths and response shapes of interactionReport/Day/Hours in src/api/client.ts and src/Time.tsx against crates/bridle-gateway/src/report.rs in /Volumes/Data/work/bridle/bridle and its tests; fix mismatches and update fixtures/tests. No live gateway yet.

## Thread

### note · external:orchestrator · 2026-10-03T22:15:00.870Z
settle skipped by external:orchestrator: human wants u6w9 done today; follow-up re-sync of an already-approved task
