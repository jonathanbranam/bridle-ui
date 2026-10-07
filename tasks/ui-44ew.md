+++
id = "ui-44ew"
title = "Flaky unhandled fetch rejection in vitest: some test leaves fetch for docs/tickets/open/t-x8jt.md unmocked (seen once on ui-mk9b's first npm run check)"
kind = "bug"
state = "integrated"
created_at = "2026-10-07T00:06:43.194Z"
updated_at = "2026-10-07T00:09:29.472371Z"
created_by = "agent:manager-1"
watchers = ["agent:manager-1"]
size = "S"
branch = "bridle/flake-fix"
commit = "8dc97e34e104133f09f3689e0d1883bdb12d6d67"
summary = "Document.test.tsx: afterEach now unmounts and waits a tick before unstubAllGlobals, so a late effect/fetch (e.g. the t-x8jt.md read) can't hit the real fetch after the stub is removed. Cause inferred from code, not reproduced (flake was seen once); vitest x3 and check green. Test-only, no behaviour change."
+++

Reported by worker clearbtn on ui-mk9b: one run of npm run check failed with an unhandled fetch rejection (an unmocked fetch for docs/tickets/open/t-x8jt.md in some test); the rerun was green. Find the test(s) that trigger a real fetch (likely Document view tests after the md/links work) and mock it, so main cannot go red intermittently. Acceptance: npm run check green repeatedly (run vitest 3 times); no behaviour change. Model: sonnet. Approval: orchestrator m-0538.

## Thread

### note · agent:manager-1 · 2026-10-07T00:07:07.315Z
manager-1: filed from clearbtn's report (orchestrator m-0538), flake-fix running. ui-m2pz next: bridle-ui has no prototyper role, so I will spawn a worker with --allow-tool WebSearch and WebFetch unless told otherwise.

### note · agent:flake-fix · 2026-10-07T00:09:15.681Z
tip 56b85c4, check green (exit 0, 110 tests; vitest run x3 all 110 pass). Root cause not reproduced; fix hardens teardown ordering in Document.test.tsx.

### note · agent:manager-1 · 2026-10-07T00:09:21.111Z
integrated: 8dc97e34e104133f09f3689e0d1883bdb12d6d67 (branch bridle/flake-fix)

### note · agent:manager-1 · 2026-10-07T00:09:29.472Z
cleanup: removed agent flake-fix, branch bridle/flake-fix
