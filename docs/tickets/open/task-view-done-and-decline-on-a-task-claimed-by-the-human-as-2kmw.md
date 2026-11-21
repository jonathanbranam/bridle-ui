---
id: ui-2kmw
title: "Task view: Done and Decline on a task claimed by the human, as on the to-do list"
kind: feature
created: 2026-10-07
created_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: []
tasks: [ui-2kmw]
---

## The ask

The human, 2026-10-07 ~6:40 PM ET, verbatim (to the bridle-ui aide): "Important - I can mark a task Done/Decline from the tasks index, but not while viewing an invidual task. frustrating! Add the same boxes when I'm viewing a task that is claimed-by human."

The ask:
1. On the single-task view (`TaskView` in `src/Tasks.tsx`, routes `/task?id=` and `/tasks/{project}/{id}`), when the task is claimed by the human, show the same Done and Decline… controls the to-do list has (`src/Items.tsx`, which calls `POST /api/v1/projects/{project}/tasks/{id}/{done|drop}`).
2. Reuse the to-do list's component and behaviour (the Decline reason box included) rather than building a second copy.
3. After an action, the view shows the task's new state.

Priority: the human called this important.
