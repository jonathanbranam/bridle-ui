+++
id = "ui-wtr3"
title = "An expanded comment thread can be collapsed again (a [-] button)"
kind = "bug"
state = "planned"
created_at = "2026-10-09T02:29:02.624Z"
updated_at = "2026-10-09T17:25:37.546164Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "wtr3"
+++

Brief (orchestrator, acting PM). Ticket wtr3 has the human's words and the ask.

Goal: an expanded comment thread can be collapsed again. The thread header toggles open/closed (today its onClick in `src/Document.tsx`, around the Thread component near line 106, only sets `open` to true), and a visible "[-]" minimize button shows while a thread is open. Every thread, resolved or not; `aria-expanded` stays correct.

Files: `src/Document.tsx` and its test file (add one if none covers threads). Nothing else.
Accept: a test opens then closes a resolved thread (and checks aria-expanded); the repo's check script passes.
Model: Haiku (small, mechanical).
Out of scope: deleting threads (ui-ha6m, next, same file), auto-dismiss, the highlight rendering bug.
