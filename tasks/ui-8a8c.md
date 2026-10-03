+++
id = "ui-8a8c"
title = "v1 view: the human's to-dos and task questions across projects, with actions"
kind = "feature"
state = "open"
created_at = "2026-10-03T01:31:51.819Z"
updated_at = "2026-10-03T01:31:51.819Z"
size = "M"
+++

Depends on the API client. Render GET /api/v1/items: grouped by project, decisions (task questions) first, then to-dos; within each, high priority then oldest (the gateway already orders; keep its order). Show unreachable projects from the response as a muted line, not an error. Actions: check off a to-do (done), decline with a required reason (drop), answer a question (answer, free text). After an action, refetch. Plain Tailwind, readable on a phone (the human uses it remotely). Tests: grouping/ordering render, unreachable project shown, each action calls the client and refreshes, decline needs a reason. Design: docs/design/human-web-ui.md section 2 in the bridle repo.
