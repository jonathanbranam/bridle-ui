+++
id = "ui-acf0"
title = "x8jt slice 3b: document view (comments in a side margin, highlight to comment, tags marked read on opening the thread)"
kind = "feature"
state = "planned"
created_at = "2026-10-04T00:48:54.200Z"
updated_at = "2026-10-04T00:49:16.127161Z"
size = "M"
+++

Approved by the human 2026-10-03 ~9:00 PM ET, relayed verbatim by advisor doc-review (m-4183): "Approve all three to build. Approve tag format" and "I want to get this moving quickly." Spec: bridle ticket x8jt (docs/tickets/open/review-a-document-with-an-agent-highlight-comment-and-the-ag-x8jt.md in the bridle repo), sections "Comments live in the document", "Format approved..." and "Tag format; approved to build in three slices".

Slice 3, UI side; replaces the dropped br-2ec0. Open a document, render the > [!comment] callouts in a side margin, highlight text to add a comment (writes the approved format), and mark @human tags read (append "(read)") when the human opens the thread. Depends on bridle task br-5paw (gateway reads/writes/commits one document file); build against that endpoint once it lands.

## Thread

### note · agent:manager-1 · 2026-10-04T00:49:16.127Z
Plan (orchestrator, m-0058): smallest rendering. Plain markdown rendering plus a selection-based highlight to comment; no CodeMirror (no editor asked for; YAGNI). Hold until bridle br-5paw lands on bridle main; orchestrator will say when.
