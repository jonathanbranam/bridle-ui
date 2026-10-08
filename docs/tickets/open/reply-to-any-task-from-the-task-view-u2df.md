---
id: u2df
title: Reply to any task from the task view
kind: feature
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui, bridle]
changes: []
specs: []
needs: []
see: [9hq8]
tasks: []
---

## The ask

The human, 2026-10-08, verbatim (same relay as ticket 9hq8, m-0787): "I should be able to also reply to tasks. I'm not sure if I should be able to comment on tasks or not, but I definitely should be able to reply to any task."

What exists: the task view (`/p/{project}/tasks/{id}`) shows the task's thread, and has Done/Decline for the human's own to-dos (ui-2kmw) and Answer for a question. There is no way to reply to an arbitrary task: the gateway's task actions are only `done`, `drop` and `answer`.

The ask:
1. A reply box on every task view: the human writes a reply, it lands on the task's thread as the human's message, and the task's agents (claimer, watchers) are told, as a task comment is today.
2. The gateway route for it (bridle repo), same session cookie as the other actions.
3. Undecided by the human: whether "comment" differs from "reply" on tasks. Build reply only; don't add a separate comment kind.
