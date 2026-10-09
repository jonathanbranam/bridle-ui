+++
id = "ui-wtr3"
title = "An expanded comment thread can be collapsed again (a [-] button)"
kind = "bug"
state = "integrated"
created_at = "2026-10-09T02:29:02.624Z"
updated_at = "2026-10-09T17:28:35.816540Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/collapse"
commit = "cf7b941aa20f274a0241b960c4d0bea1c8246426"
summary = 'Expanded comment threads can be collapsed again (ui-wtr3). The thread header now toggles open and closed (it used to only open), and an open thread shows a [-] minimize button (aria-label "Minimize thread"). aria-expanded follows the state for every thread, resolved or not. Changed src/Document.tsx (ThreadView) and src/Document.test.tsx: the stub takes optional document content, and a new test opens, minimizes and re-toggles a resolved thread. No new dependencies. npm run check passed on this commit (139 tests).'
ticket = "wtr3"
+++

Brief (orchestrator, acting PM). Ticket wtr3 has the human's words and the ask.

Goal: an expanded comment thread can be collapsed again. The thread header toggles open/closed (today its onClick in `src/Document.tsx`, around the Thread component near line 106, only sets `open` to true), and a visible "[-]" minimize button shows while a thread is open. Every thread, resolved or not; `aria-expanded` stays correct.

Files: `src/Document.tsx` and its test file (add one if none covers threads). Nothing else.
Accept: a test opens then closes a resolved thread (and checks aria-expanded); the repo's check script passes.
Model: Haiku (small, mechanical).
Out of scope: deleting threads (ui-ha6m, next, same file), auto-dismiss, the highlight rendering bug.

## Thread

### note · agent:collapse · 2026-10-09T17:28:27.029Z
done: expanded threads collapse again (header toggles, [-] button while open, aria-expanded follows; test opens and closes a resolved thread); npm run check exit 0, 139 tests passed; commit 78ce192

### note · agent:manager-2 · 2026-10-09T17:28:33.306Z
integrated: cf7b941aa20f274a0241b960c4d0bea1c8246426 (branch bridle/collapse)

### note · agent:manager-2 · 2026-10-09T17:28:35.816Z
cleanup: removed agent collapse, branch bridle/collapse
