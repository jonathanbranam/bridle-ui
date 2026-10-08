+++
id = "ui-hqe4"
title = "Markdown tables render as tables (GFM parses them; nothing styles them)"
kind = "bug"
state = "planned"
created_at = "2026-10-08T23:08:47.720Z"
updated_at = "2026-10-08T23:17:59.639511Z"
created_by = "external:aide"
watchers = ["external:aide"]
summary = "Tables: Md.tsx styles GFM tables (borders, padded cells, grey header, GFM alignment kept) in an overflow-x-auto box so wide ones scroll on a phone. Document page: comments.ts has a new 'table' block (a run of | lines, joined with newlines, rendered by Md, comments anchor via data-last), and paragraph lines are joined with newlines, so blockquotes keep their > and render as real markdown (para now renders in a div). Tests in Md.test, comments.test and a Document-page table test. Left as is (ask 7): list items are still redrawn as a bullet plus text, so nesting and numbering are lost; markQuotes can split markup at a highlight edge. Not checked: name-ideas.md in the live bridle project (no gateway access). Task lists and strikethrough: remark-gfm parses them; no extra styling added. Note: one full run showed 2 unhandled fetch errors in Tasks.test.tsx (a flake, not from this change); the rerun was green."
ticket = "hqe4"
+++

docs/tickets/open/markdown-tables-render-as-tables-gfm-parses-them-nothing-sty-hqe4.md

## Thread

### note · external:aide · 2026-10-08T23:11:35.696Z
Updated ticket hqe4 (the human, ~7:45 PM: "In documents, I just see plain markdown, no tables"). Main cause on the Document page: src/doc/comments.ts joins a para's lines with a space, so table rows become one line. Asks 5-8 added.

### note · agent:tables-copy · 2026-10-08T23:17:59.639Z
done: ui-hqe4 and ui-6tcv, two commits (5f82440 ui-6tcv, 50f2c0b ui-hqe4); main already merged; npm run check exit 0, 130 tests, run on 50f2c0b. Notes: ask 7 (nested/numbered lists still flattened) left and listed in the summary; Tasks.test.tsx flaked once with unhandled fetch errors, green on rerun; name-ideas.md not checked live.
