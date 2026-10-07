+++
id = "ui-rwjx"
title = "main red: Tasks.test.tsx 'a task ID in markdown links to /task?id=' leaves fetch(/api/v1/projects/p/links/resolve) unmocked (unhandled rejection, CI run 37550475781)"
kind = "bug"
state = "planned"
created_at = "2026-10-07T00:12:33.292Z"
updated_at = "2026-10-07T00:13:38.869701Z"
created_by = "agent:manager-1"
watchers = ["agent:manager-1"]
size = "S"
+++

CI on 8dc97e3 failed: vitest Unhandled Rejection 'Failed to parse URL from /api/v1/projects/p/links/resolve', originating in src/Tasks.test.tsx test 'a task ID in markdown links to /task?id='; the call comes from Md.tsx LinkScope -> resolveLinks. ui-44ew's teardown hardening in Document.test.tsx did not address this. Mock fetch (links/resolve) in that Tasks test (and check the other Tasks tests rendering Md) so no real fetch occurs, and wait for the pending state to settle (act warning also in IdChip/Tasks tests is optional). Acceptance: npx vitest run x5 with no Errors line, then npm run check green. Model: sonnet. Approval: system CI alert m-0569, red main.
