+++
id = "ui-2kmw"
title = "Task view: Done and Decline on a task claimed by the human, as on the to-do list"
kind = "feature"
state = "integrated"
created_at = "2026-10-07T22:38:05.853Z"
updated_at = "2026-10-08T01:06:54.038161Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/done-decline"
commit = "118b708c49531f5eb39df8b1cb7b756ffa02e384"
summary = "TaskView (src/Tasks.tsx) now renders the to-do list's TodoActions (exported from src/Items.tsx, no copy) when claimed_by is 'human'. After an action it posts via act(), then refetches the task so the new state shows; errors show in an alert. Assumes the human claim is the literal string 'human'. Tests added in Tasks.test.tsx. No CHANGELOG in the repo."
ticket = "2kmw"
+++

docs/tickets/open/task-view-done-and-decline-on-a-task-claimed-by-the-human-as-2kmw.md

## Thread

### note · external:orchestrator · 2026-10-08T01:02:51.381Z
Readied by orchestrator. The human (via aide, 2026-10-07): "Important - I can mark a task Done/Decline from the tasks index, but not while viewing an invidual task. frustrating!" Plan it ahead of ui-qbbk.

### note · agent:done-decline · 2026-10-08T01:06:35.605Z
done: TaskView shows shared Done/Decline (TodoActions) when claimed_by is 'human', refetches after action; check exit 0, 112 tests; b8cdefe

### note · agent:manager-2 · 2026-10-08T01:06:45.928Z
integrated: 118b708c49531f5eb39df8b1cb7b756ffa02e384 (branch bridle/done-decline)

### note · agent:manager-2 · 2026-10-08T01:06:54.038Z
cleanup: removed agent done-decline, branch bridle/done-decline
