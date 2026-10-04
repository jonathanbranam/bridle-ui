+++
id = "ui-acf0"
title = "x8jt slice 3b: document view (comments in a side margin, highlight to comment, tags marked read on opening the thread)"
kind = "feature"
state = "claimed"
created_at = "2026-10-04T00:48:54.200Z"
updated_at = "2026-10-04T01:20:22.629971Z"
size = "M"
summary = "Document page (nav 'Document'): open project+path via GET /documents, render blocks (headings, items, code, paragraphs, inline code/bold) with each '> [!comment]' callout in a right-hand margin next to the line it follows; select text and add a comment (writes the approved callout format after the block and any existing threads, PUT with the read hash); threads with an unread '@human' stay folded until opened, then '(read)' is appended and saved. Pure parse/write functions in src/doc/comments.ts with tests; client readDocument/writeDocument/projects in src/api/client.ts; types re-synced. No markdown library: a ~40-line inline/blocks renderer covers what the docs use. Gateway errors (403 on main, 409 stale) are shown as-is. Not done: replies from the UI, reload after 409 (user re-opens)."
+++

Approved by the human 2026-10-03 ~9:00 PM ET, relayed verbatim by advisor doc-review (m-4183): "Approve all three to build. Approve tag format" and "I want to get this moving quickly." Spec: bridle ticket x8jt (docs/tickets/open/review-a-document-with-an-agent-highlight-comment-and-the-ag-x8jt.md in the bridle repo), sections "Comments live in the document", "Format approved..." and "Tag format; approved to build in three slices".

Slice 3, UI side; replaces the dropped br-2ec0. Open a document, render the > [!comment] callouts in a side margin, highlight text to add a comment (writes the approved format), and mark @human tags read (append "(read)") when the human opens the thread. Depends on bridle task br-5paw (gateway reads/writes/commits one document file); build against that endpoint once it lands.

## Thread

### note · agent:manager-1 · 2026-10-04T00:49:16.127Z
Plan (orchestrator, m-0058): smallest rendering. Plain markdown rendering plus a selection-based highlight to comment; no CodeMirror (no editor asked for; YAGNI). Hold until bridle br-5paw lands on bridle main; orchestrator will say when.

### note · agent:doc-view · 2026-10-04T01:20:22.629Z
done: document view (open, margin comments, highlight-to-comment, (read) on opening thread); npm run check green, 39 tests; 4a24cdf
