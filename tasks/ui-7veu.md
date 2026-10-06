+++
id = "ui-7veu"
title = "nnj2: front matter see/needs/tasks entries (ticket stems, task IDs) aren't linked in the doc view"
kind = "bug"
state = "open"
created_at = "2026-10-06T00:07:44.492Z"
updated_at = "2026-10-06T00:07:44.922788Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
size = "S"
+++

Human's bug, ticket nnj2 in the bridle repo: docs/tickets/open/bridle-ui-front-matter-see-needs-tasks-entries-ticket-stems-nnj2.md. Cause per aide: src/doc/links.ts never makes stems into link candidates; also link IDs in task titles.
