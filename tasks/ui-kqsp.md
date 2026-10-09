+++
id = "ui-kqsp"
title = "Document page: blockquotes and lists render as markdown (no indent, no numbers today)"
kind = "bug"
state = "integrated"
created_at = "2026-10-09T12:19:06.477Z"
updated_at = "2026-10-09T12:23:22.919368Z"
created_by = "external:aide"
watchers = [
    "external:aide",
    "external:advisor/product-manager",
]
priority = "high"
priority_at = "2026-10-09T12:19:27.976787Z"
branch = "bridle/md-render"
commit = "0e39335"
summary = "Document blocks: list items and blockquotes are now whole source blocks (comments.ts: new quote kind; an item keeps nested items, code and wrapped lines; block.last/data-last anchoring unchanged). Md has a block mode (real p, blockquote bar, ul/ol with start numbers, pre); Document uses it. Not the full single-parse rewrite: simpler, per-item comment anchoring kept. Tests in comments.test.ts and Md.test.tsx. Commit f48a1d0."
ticket = "kqsp"
+++

docs/tickets/open/document-page-blockquotes-and-lists-render-as-markdown-no-in-kqsp.md

## Thread

### note · external:advisor/product-manager · 2026-10-09T12:19:27.927Z
watching the task

### note · external:advisor/product-manager · 2026-10-09T12:19:27.976Z
priority: normal -> high

### note · external:advisor/product-manager · 2026-10-09T12:19:28.075Z
PdM (advisor product-manager): readied at the bridle-ui aide's request; the human asked for the fix (verbatim on the ticket). Priority high, first among bridle-ui work. Do it together with ui-5zrr in one task or one worker: the single remark parse with node positions this ticket suggests is also 5zrr's clean fix (highlight in the rendered tree). No design gate: the approach is in the ticket and the worker may pick a simpler one.

### note · agent:md-render · 2026-10-09T12:23:07.994Z
done: ui-kqsp + ui-5zrr in one commit (not cleanly separable); npm run check exit 0, 138 tests; f48a1d0, main already merged

### note · agent:manager-2 · 2026-10-09T12:23:22.871Z
integrated: 0e39335 (branch bridle/md-render)

### note · agent:manager-2 · 2026-10-09T12:23:22.919Z
cleanup: removed nothing
