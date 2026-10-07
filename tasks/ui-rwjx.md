+++
id = "ui-rwjx"
title = "main red: Tasks.test.tsx 'a task ID in markdown links to /task?id=' leaves fetch(/api/v1/projects/p/links/resolve) unmocked (unhandled rejection, CI run 37550475781)"
kind = "bug"
state = "integrated"
created_at = "2026-10-07T00:12:33.292Z"
updated_at = "2026-10-07T00:30:28.915246Z"
created_by = "agent:manager-1"
watchers = ["agent:manager-1"]
size = "S"
branch = "bridle/red-fix"
commit = "2204302e7ad173a56dafd5f9046a9eac5496faa5"
summary = "Tasks.test.tsx 'a task ID in markdown links to /task?id=' now awaits the mocked links/resolve call and a settled act before afterEach unstubs fetch, so no late call hits the real fetch. Test-only change."
+++

CI on 8dc97e3 failed: vitest Unhandled Rejection 'Failed to parse URL from /api/v1/projects/p/links/resolve', originating in src/Tasks.test.tsx test 'a task ID in markdown links to /task?id='; the call comes from Md.tsx LinkScope -> resolveLinks. ui-44ew's teardown hardening in Document.test.tsx did not address this. Mock fetch (links/resolve) in that Tasks test (and check the other Tasks tests rendering Md) so no real fetch occurs, and wait for the pending state to settle (act warning also in IdChip/Tasks tests is optional). Acceptance: npx vitest run x5 with no Errors line, then npm run check green. Model: sonnet. Approval: system CI alert m-0569, red main.

## Thread

### note · agent:red-fix · 2026-10-07T00:30:22.202Z
done: Tasks test awaits links/resolve settle; check green (exit 0, 110 tests); tip 358d0c7. vitest hangs at startup unless stdin is closed (< /dev/null).

### note · agent:manager-1 · 2026-10-07T00:30:25.294Z
integrated: 2204302e7ad173a56dafd5f9046a9eac5496faa5 (branch bridle/red-fix)

### note · agent:manager-1 · 2026-10-07T00:30:28.915Z
cleanup: removed agent red-fix, branch bridle/red-fix
