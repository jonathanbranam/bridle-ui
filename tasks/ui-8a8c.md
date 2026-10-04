+++
id = "ui-8a8c"
title = "v1 view: the human's to-dos and task questions across projects, with actions"
kind = "feature"
state = "integrated"
created_at = "2026-10-03T01:31:51.819Z"
updated_at = "2026-10-03T02:55:08.715506Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
size = "M"
branch = "bridle/items-view"
commit = "7b19afbd501368bd0c4a3cb78966099033ad1121"
summary = "Added src/Items.tsx (ItemsView) rendered by App when logged in: GET /items grouped by project, decisions then to-dos in gateway order, unreachable projects as a muted line, Done / Decline (reason required) / Answer actions that call act() then refetch; a 401 returns to login. Tests in src/Items.test.tsx. No docs needed updating."
+++

Depends on the API client. Render GET /api/v1/items: grouped by project, decisions (task questions) first, then to-dos; within each, high priority then oldest (the gateway already orders; keep its order). Show unreachable projects from the response as a muted line, not an error. Actions: check off a to-do (done), decline with a required reason (drop), answer a question (answer, free text). After an action, refetch. Plain Tailwind, readable on a phone (the human uses it remotely). Tests: grouping/ordering render, unreachable project shown, each action calls the client and refreshes, decline needs a reason. Design: docs/design/human-web-ui.md section 2 in the bridle repo.

## Thread

### note · agent:items-view · 2026-10-03T02:54:59.144Z
done: items view with done/decline/answer, tests, check green; da78f52

### note · agent:manager-1 · 2026-10-03T02:55:07.269Z
integrated: 7b19afbd501368bd0c4a3cb78966099033ad1121 (branch bridle/items-view)

### note · agent:manager-1 · 2026-10-03T02:55:08.715Z
cleanup: removed agent items-view, branch bridle/items-view
