+++
id = "ui-hqe4"
title = "Markdown tables render as tables (GFM parses them; nothing styles them)"
kind = "bug"
state = "pending"
created_at = "2026-10-08T23:08:47.720Z"
updated_at = "2026-10-08T23:11:35.696786Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "hqe4"
+++

docs/tickets/open/markdown-tables-render-as-tables-gfm-parses-them-nothing-sty-hqe4.md

## Thread

### note · external:aide · 2026-10-08T23:11:35.696Z
Updated ticket hqe4 (the human, ~7:45 PM: "In documents, I just see plain markdown, no tables"). Main cause on the Document page: src/doc/comments.ts joins a para's lines with a space, so table rows become one line. Asks 5-8 added.
