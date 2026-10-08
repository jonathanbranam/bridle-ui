+++
id = "ui-u2df"
title = "Reply to any task from the task view"
kind = "feature"
state = "planned"
created_at = "2026-10-08T12:47:33.436Z"
updated_at = "2026-10-08T12:52:12.767240Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "u2df"
+++

docs/tickets/open/reply-to-any-task-from-the-task-view-u2df.md

## Thread

### note · agent:plan-remote · 2026-10-08T12:50:19.359Z
Plan: docs/design/remote-docs-and-replies.md, briefs B4 (gateway reply route) and U1 (reply box). Local projects need no token work.

### note · agent:manager-2 · 2026-10-08T12:52:12.767Z
Plan: docs/design/remote-docs-and-replies.md, U1. Build against the route POST /api/v1/projects/{project}/tasks/{id}/reply ({text}); bridle side is br-hc6j. Code and test against mocked fetch; do not land before br-hc6j has landed and the gateway is restarted (manager checks).
