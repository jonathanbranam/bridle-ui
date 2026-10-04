+++
id = "ui-umaq"
title = "s6cj: Tasks page, open tasks by project with state and who's working them, mobile-first"
kind = "feature"
state = "planned"
created_at = "2026-10-04T22:45:53.992Z"
updated_at = "2026-10-04T22:46:11.206973Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "M"
+++

Ticket: bridle repo docs/tickets/open/*-s6cj.md (read it; it quotes the human).
Approval: the human via aide (m-0190): "Try to resolve any questions and get that work moving. And queued up for after this other work lands."

Goal: a Tasks tab (route /tasks, a task at /tasks/{project}/{id}, in the URL like k3qx).
- List: per project, open tasks only, grouped by state in a vertical scroll (mobile first; no sideways Kanban). Each row: id, title, state, priority, and who works it (manager or worker name).
- A way to find closed tasks: a 'show closed' toggle or search by ID; a closed task's page still opens from any link.
- Task page: body (rendered with ui-pmkd's renderer if it has landed, plain otherwise), thread, watchers, claimed by, branch, and its edges (blocks / blocked by) as followable links.
- Task IDs elsewhere in the UI link here once this lands (extend ui-pmkd's ID linking for non-ticket task IDs, if ui-pmkd has landed).
Data: bridle gateway routes from br-s6cj (GET /api/v1/projects/{project}/tasks, .../tasks/{id}); see docs/design/human-web-ui.md after it lands.
Acceptance: npm run check green; tests for the list filter, closed-task page and edge links. Model: sonnet.
Starts after bridle br-s6cj is on bridle main (the orchestrator says when).
Deferred: live updates, until the static page is in use (the human: static first).

## Thread

### note · external:aide · 2026-10-04T22:46:11.206Z
watching the task
