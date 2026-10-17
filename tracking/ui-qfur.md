+++
id = "ui-qfur"
title = "The human edits or deletes their own document comments until another role replies (unresolved threads)"
kind = "feature"
state = "planned"
created_at = "2026-10-09T21:27:28.751Z"
updated_at = "2026-10-17T19:10:57.744386Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
priority = "low"
priority_at = "2026-10-09T21:27:31.271333Z"
summary = "On the Document page, each human entry in an unresolved thread with no other principal's entry after it gets Edit and Delete entry buttons (src/Document.tsx; logic in src/doc/comments.ts: threadEntries, editEntry, deleteEntry). Resolved threads and entries followed by an agent reply stay read-only. Deleting the only entry deletes the thread; deleting the first of several promotes the next entry to the header; next_comment_id is pinned so it never drops. The [sent] question: an edit sets the entry's mark to [pending <stamp>], which the daemon's pending_threads already resends (pending = newest entry unmarked or pending), so no bridle-side change is needed. Noted, not changed: deleteThread (resolved threads) does not pin the counter. Browser check pending: no browser tool in this worktree (asked the manager)."
ticket = "qfur"
+++


## The ask

The human, 2026-10-09 ~4:25 PM ET, verbatim (via the bridle-ui aide to advisor product-manager):

> please sent a low priority ticket request to the advisor/product-manager that the human can edit any previous comments that do not have another role's comment after them. For documents. Situatoin:
>
> 1. human adds a comment
> 2. reads more; realized comment needs amendment
> 3. document has not been reviewed
>
> human would like to edit the previous comment.
>
> Also, the human may have added multiple comments; in that case, they can edit ALL previous comments.
>
> Also - the human should be able to delete comments following these same rules.
>
> The human can edit if the thread is:
>
> c1
> @human do ABC
> @human no do XYZ
>
> human can delete or edit the second comment and also edit or delete the first comment
>
> The human cannot edit comments that have been later comments added to them or resolved comments
>
> c2
> @human we should ABC
> @agent ok, I'm working on it
>
> human cannot edit c2
>
> once a ticket is resolved, the human can delete it, that is a separate ticket

## The rule (the aide's reading, confirmed by advisor product-manager)

- In an **unresolved** thread on the Document page, every human entry with **no other
  principal's entry after it** can be edited or deleted. Deleting every entry of a thread
  deletes the thread.
- Resolved threads, and human entries followed by an agent's reply, are read-only.
- Deleting a resolved thread is ui-ha6m (live since 2026-10-09 1:34 PM).
- Deleting must never lower `next_comment_id` (ui-vnuu, live).

## Open (the PdM's suggestion; the human may overrule)

An entry already marked `[sent]` (handed to the document's agent) but not yet replied to is
editable by the rule. Suggested: an edit resets the mark to pending, so the daemon's document
watcher (bridle `doc_watch`) resends the thread with the new text. That may need a small change
on the bridle side; check before building.

Priority low (the human), and the human set all comment work low and at the end of the queue
(2026-10-09). Theme `human-ui`.

## Brief (orchestrator, acting PM for bridle-ui, 2026-10-17)

- **Goal:** the rule above. In an unresolved Document-page thread, each of the human's entries
  with no other principal's entry after it shows Edit and Delete. Deleting every entry deletes the
  thread. Resolved threads and entries followed by another role's reply stay read-only.
- **Files:** the Document page's comment thread components and the comment write path they use
  (find them from `src/Document.tsx`), plus tests. Respect ui-vnuu: a delete never lowers
  `next_comment_id`.
- **The `[sent]` question:** first check how bridle's `doc_watch` treats an edited entry. If the
  UI can reset an edited entry's mark to pending through its existing write path, do that, so the
  agent sees the new text. If that needs a bridle change, don't make it: leave `[sent]` entries
  read-only, say so on this ticket, and file the bridle side as a ticket for the PdM.
- **Acceptance:** tests for the editable/read-only rule (the human's two example threads), edit,
  delete and delete-last-entry; verified in a browser with `bridle dev site up`.
- **Model:** Sonnet.
- **Out of scope:** deleting resolved threads (ui-ha6m, done); comments on anything other than
  documents.

## Thread

### note · external:advisor/product-manager · 2026-10-09T21:27:31.271Z
priority: normal -> low

### note · external:advisor/product-manager · 2026-10-17T02:06:36.512Z
The human, 2026-10-16 ~10:10 PM ET, to advisor (product-manager): "Yes I approve the \"cheap batch\" of tickets mentioned earlier".

### note · system · 2026-10-17T06:07:02.301Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · agent:editown · 2026-10-17T16:33:43.852Z
Built and committed a1e2edc; npm run check exit 0, 170 tests. Missing tool: no browser automation in this worktree (no playwright in node_modules; only another project's copy at /Volumes/Data/work/ggj24/babylonjs-webpack-es6/node_modules/playwright, not used). Site browser check not done; asked the manager. [sent] answer: edit sets the mark to pending, which the daemon already resends; no bridle change needed.

### note · external:orchestrator · 2026-10-17T19:10:38.200Z
From orchestrator: you were lost in the daemon restart at 19:10Z and are resumed. editown (ui-qfur) shows stopped: check its branch and logs, resume or respawn it, and finish ui-qfur.

### note · agent:manager-4 · 2026-10-17T19:10:47.314Z
manager-4: diff reviewed, scope fine. Still needed from editown: (1) write the ticket summary (bridle ticket summary ui-qfur). The browser click-through is still waiting on the human's answer about borrowing the ggj24 playwright; do not use it until told. Reply when the summary is written.

### note · external:orchestrator · 2026-10-17T19:10:57.353Z
From orchestrator (answering manager-4's question about the browser check): don't borrow the ggj24 copy. playwright-cli is installed globally (/Users/jbranam/.nvm/versions/node/v24.12.0/bin/playwright-cli, chromium-1187 cached): use it with a throwaway site (bridle dev site up / down), per the verify-ui-in-a-browser rule. If the worker's allowed tools refuse playwright-cli, that's a missing tool: say so on this thread with the exact refusal and tell me.

### note · external:orchestrator · 2026-10-17T19:10:57.744Z
ui-qfur: comment added (orchestrator: use the global playwright-cli for the browser check, not ggj24's)
