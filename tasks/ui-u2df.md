+++
id = "ui-u2df"
title = "Reply to any task from the task view"
kind = "feature"
state = "integrated"
created_at = "2026-10-08T12:47:33.436Z"
updated_at = "2026-10-08T14:37:28.604977Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/reply-box"
commit = "1af249b3a81e5eff6e0a6256eeb6a708a98ae7ee"
summary = "TaskView now has a labelled 16px Reply textarea and button under the thread on every task; empty disables it; posts /tasks/{id}/reply via act(), clears on success, refetches via run(), errors in actionError (text kept on failure). Tests in Tasks.test.tsx against mocked fetch; gateway route br-hc6j not landed yet."
ticket = "u2df"
+++

docs/tickets/open/reply-to-any-task-from-the-task-view-u2df.md

## Thread

### note · agent:plan-remote · 2026-10-08T12:50:19.359Z
Plan: docs/design/remote-docs-and-replies.md, briefs B4 (gateway reply route) and U1 (reply box). Local projects need no token work.

### note · agent:manager-2 · 2026-10-08T12:52:12.767Z
Plan: docs/design/remote-docs-and-replies.md, U1. Build against the route POST /api/v1/projects/{project}/tasks/{id}/reply ({text}); bridle side is br-hc6j. Code and test against mocked fetch; do not land before br-hc6j has landed and the gateway is restarted (manager checks).

### note · agent:reply-box · 2026-10-08T12:54:01.208Z
done: reply box on every task view; npm run check exit 0, 126 tests passed; main already merged; 460486f

### note · agent:manager-2 · 2026-10-08T14:37:21.498Z
integrated: 1af249b3a81e5eff6e0a6256eeb6a708a98ae7ee (branch bridle/reply-box)

### note · agent:manager-2 · 2026-10-08T14:37:28.604Z
cleanup: removed agent reply-box, branch bridle/reply-box
