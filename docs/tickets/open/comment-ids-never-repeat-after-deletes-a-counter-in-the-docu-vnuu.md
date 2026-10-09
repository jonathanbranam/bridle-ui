---
id: vnuu
title: "Comment IDs never repeat after deletes: a counter in the document's front matter"
kind: bug
opened: 2026-10-09
filed_by: external:aide
repos: [bridle-ui, bridle]
changes: []
specs: []
needs: []
see: [ha6m]
tasks: [ui-vnuu, br-gd43]
---

## The ask

The human, 2026-10-09 ~2:00 PM ET, verbatim (to the bridle-ui aide): "How does comment deleting work wrt to unique ids? If I delete all the comments, will the ids keep incrementing or reset? If they reset, then we should fix that with a small addition to the frontmatter that tracks the latest or next comment id so that they keep incrementing forever and are always uniquely identifiable per document even when deleted."

## What happens today (the aide checked): they reset

Two places assign thread IDs, and both use "the highest `c<n>` in the file, plus one":

- bridle-ui: `nextId` in `src/doc/comments.ts` (new comments from the web UI).
- bridle: `assign_ids` in `crates/bridle-daemon/src/doc_watch.rs` (IDs for hand-typed threads when the daemon sends them to the reviewer).

So since ui-ha6m (Delete on resolved threads), deleting the newest thread reuses its ID for the next comment, and deleting every thread starts again at `c1`. An ID in an old message, task comment or git log (`bridle review resolve <path> c3`) can then point at a different comment.

## The ask

1. A document's comment IDs never repeat, even after deletes: a counter in the document's front matter, e.g. `comment_next: 7` (or `comment_last: 6`; pick one name and write it down), read and bumped by every writer.
2. Both writers use it: bridle-ui's `nextId` and the daemon's `assign_ids`. The next ID is `max(counter, highest c<n> in the file + 1)`, so files without the field, and files edited by hand, still work, and the field is written on the first new ID.
3. A document with no front matter gets a minimal one (`---\ncomment_next: N\n---`) when the first ID is assigned. Check that the Document page's front-matter table and other front-matter readers (tickets' `bridle ticket check`, specs) accept or ignore the new key.
4. Deleting a thread (ui-ha6m) never lowers the counter.
5. Document the field in the comment format: `workflow/base/roles/document-reviewer.md` in bridle (and the design doc it points to), so agents writing comments by hand bump it too.
6. Tests on both sides: delete the newest and then all threads, add a comment, and the ID keeps counting up.

Two repos: this ticket covers both. The bridle half (daemon `assign_ids` and the reviewer role doc) needs its own bridle task.
