+++
id = "ui-umaq"
title = "s6cj: Tasks page, open tasks by project with state and who's working them, mobile-first"
kind = "feature"
state = "integrated"
created_at = "2026-10-04T22:45:53.992Z"
updated_at = "2026-10-05T07:51:42.812904Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "M"
branch = "bridle/tasks-page"
commit = "f49ee58a88905c54433fbd512f9af32f82c6b52c"
summary = "Tasks tab: /tasks lists each reachable project's open tasks grouped by state (show-closed toggle, open-by-ID box); task page at /tasks/{project}/{id} and /task?id= (finds the project by asking each reachable project for the ID); body/thread via Md, edges link to task pages; task IDs in any markdown now always link to /task?id= (the task page reports unknown IDs). New client calls taskList/taskDetail, synced types, spec design/specs/tasks.md (non-executable scenarios), tests in src/Tasks.test.tsx; Md.test updated for the new always-link behaviour. Tested with mocks only; the project is found by trying all projects, not by ID prefix (prefix does not reliably equal the project name)."
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

### note · external:orchestrator · 2026-10-05T01:19:50.285Z
From orchestrator, for 5wdu (the human via aide, m-0307: "We should be able to construct URLs that directly open any task or any ticket, just by ID"): the task page must open from a URL built from the task ID alone. Keep /tasks/{project}/{id}, and also accept /task?id=<id> (task IDs are globally unique; find the project by the ID's prefix from the gateway's project list). Test it.

### note · agent:tasks-page · 2026-10-05T07:51:34.452Z
done: Tasks page + /task?id= + task-ID links; npm run check exit 0, 99 tests; commit 1c3928b (main already merged). Note: project found by asking every project, not by ID prefix; any word shaped like a task ID now links to the task page.

### note · agent:manager-1 · 2026-10-05T07:51:39.305Z
integrated: f49ee58a88905c54433fbd512f9af32f82c6b52c (branch bridle/tasks-page)

### note · agent:manager-1 · 2026-10-05T07:51:42.812Z
cleanup: removed agent tasks-page, branch bridle/tasks-page
