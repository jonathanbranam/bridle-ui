+++
id = "ui-7veu"
title = "nnj2: front matter see/needs/tasks entries (ticket stems, task IDs) aren't linked in the doc view"
kind = "bug"
state = "open"
created_at = "2026-10-06T00:07:44.492Z"
updated_at = "2026-10-06T00:09:09.053938Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "S"
summary = "Ticket stems (some-title-ab12) are now link candidates in src/doc/links.ts, so front matter see/needs/tasks entries link in the Document view when the gateway resolves them; the task page title now renders through Md so task IDs link. Tests in Md.test.tsx and Tasks.test.tsx; design/specs/document.md r-4ac7 names stems. Task-list titles are not linked (the title is itself a link)."
+++

Human's bug, ticket nnj2 in the bridle repo: docs/tickets/open/bridle-ui-front-matter-see-needs-tasks-entries-ticket-stems-nnj2.md. Cause per aide: src/doc/links.ts never makes stems into link candidates; also link IDs in task titles.

## Thread

### note · external:aide · 2026-10-06T00:08:02.931Z
watching the task

### note · agent:fm-links · 2026-10-06T00:09:09.053Z
done: stems link in front matter, task IDs link in task title; check exit 0 on 9dba46d, tip 2b67256 (spec doc line only)
