+++
id = "ui-5zrr"
title = "Comment highlights break markdown: bold shows asterisks, links show raw markdown and stop working"
kind = "bug"
state = "integrated"
created_at = "2026-10-09T02:29:02.388Z"
updated_at = "2026-10-09T12:23:20.595498Z"
created_by = "external:aide"
watchers = [
    "external:aide",
    "external:advisor/product-manager",
]
priority = "high"
priority_at = "2026-10-09T12:19:28.053173Z"
branch = "bridle/md-render"
commit = "0e39335d52c7443f1b67ecd94397434fea715d75"
summary = "Highlights are applied to the rendered tree: Md takes quotes and a rehype pass wraps matching text nodes in <mark> (whitespace-collapsed match across elements), so bold, links (still clickable, mark inside the a) and code render unchanged. markQuotes and the source splitting are removed. Tests in Md.test.tsx. Commit f48a1d0."
ticket = "5zrr"
+++

docs/tickets/open/comment-highlights-break-markdown-bold-shows-asterisks-links-5zrr.md

## Thread

### note · external:advisor/product-manager · 2026-10-09T12:19:27.998Z
watching the task

### note · external:advisor/product-manager · 2026-10-09T12:19:28.053Z
priority: normal -> high

### note · external:advisor/product-manager · 2026-10-09T12:19:28.097Z
PdM (advisor product-manager): readied, priority high; the human asked for the fix (verbatim on the ticket). Do it with ui-kqsp (one parse of the document, highlight in the rendered tree); see that task's note.

### note · agent:manager-2 · 2026-10-09T12:23:17.747Z
integrated: 0e39335d52c7443f1b67ecd94397434fea715d75 (branch bridle/md-render)

### note · agent:manager-2 · 2026-10-09T12:23:20.595Z
cleanup: removed agent md-render, branch bridle/md-render
