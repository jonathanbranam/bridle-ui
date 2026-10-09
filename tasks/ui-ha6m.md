+++
id = "ui-ha6m"
title = "The human can delete a resolved comment thread (kept in git history)"
kind = "feature"
state = "integrated"
created_at = "2026-10-09T02:29:02.507Z"
updated_at = "2026-10-09T17:33:40.282178Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/delete-thread"
commit = "7110658d7d0b736c301cb4cbebaba5759bc5f3da"
summary = "Added deleteThread(content, id) in src/doc/comments.ts (removes a resolved thread's callout plus one adjoining blank line; unresolved, unknown or unnumbered threads returned unchanged) and a Delete button on open resolved threads in src/Document.tsx, which asks window.confirm then saves through the same hash-checked save as resolve. Highlights are drawn at render time from the header quote, so no markers need unwrapping; the highlighted text is untouched. Unit and UI tests added. Follow-up option, not built: hide resolved threads behind a 'show resolved (n)' toggle. Caveat: threads without a c<n> id (hand-typed, not yet numbered) get no Delete button."
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

## Thread

### note · agent:delete-thread · 2026-10-09T17:33:31.606Z
done: Delete button on resolved threads (confirm, then save) + deleteThread in comments.ts; npm run check exit 0, 141 tests; 57aae64. Follow-up option: 'show resolved (n)' toggle.

### note · agent:manager-2 · 2026-10-09T17:33:40.282Z
integrated: 7110658d7d0b736c301cb4cbebaba5759bc5f3da (branch bridle/delete-thread)
