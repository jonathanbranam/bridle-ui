---
id: qfur
title: The human edits or deletes their own document comments until another role replies (unresolved threads)
kind: feature
opened: 2026-10-09
filed_by: external:advisor/product-manager
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [ha6m, vnuu]
tasks: [ui-qfur]
---

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
