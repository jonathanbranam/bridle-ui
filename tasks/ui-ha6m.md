+++
id = "ui-ha6m"
title = "The human can delete a resolved comment thread (kept in git history)"
kind = "feature"
state = "planned"
created_at = "2026-10-09T02:29:02.507Z"
updated_at = "2026-10-09T17:25:37.581462Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "ha6m"
+++

Brief (orchestrator, acting PM). Ticket ha6m has the human's words and the ask.

Goal: the human can delete a resolved comment thread. A "Delete" control on a resolved thread (not on open ones) asks to confirm, then removes the whole thread and its highlight from the document text and saves, so the change is committed like any other edit and stays in git history.

How: comments are plain-text edits of the document. Add a pure `deleteThread(content, threadId)` next to `resolveThread` in `src/doc/comments.ts` (remove the thread block and unwrap its highlight markers, leaving the highlighted text itself intact), and wire it in `src/Document.tsx` the way resolve is (`save(resolveThread(...))`, around line 387), through the same `save`/`writeDocument` hash check. No gateway or bridle-repo change.

Files: `src/doc/comments.ts`, `src/Document.tsx`, their tests.
Accept: unit tests for deleteThread (thread gone, highlighted text kept, other threads untouched, refuses an unresolved thread); a UI test that delete asks to confirm and saves; the repo's check script passes.
Model: Sonnet (text transform with edge cases).
Out of scope, and why: auto-dismiss or a "show resolved (n)" toggle (the ask says only if cheap; mention it in your report as a follow-up option instead); the markdown-inside-highlight rendering bug (its own ticket); undo (confirm is enough; git keeps the history).
Runs after ui-wtr3: both touch src/Document.tsx.
