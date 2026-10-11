+++
id = "ui-jgg8"
title = "The UI's to-do views show the human's to-dos as tickets (ui-utp5 last slice; after bridle br-cy4q)"
kind = "feature"
state = "integrated"
created_at = "2026-10-11T13:41:17.833Z"
updated_at = "2026-10-11T15:44:51.746659Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
branch = "bridle/todo-tickets"
commit = "a6c39a663cdd062bacaaf4b7c4cc7f828d47b225"
summary = "Items view shows a to-do as a ticket: IdChip shows Todo.ticket (falls back to task_id), the title links to /p/{project}/tickets/{id}. done/decline already used the ticket routes (utp5). Synced Todo.ticket from bridle main (cy4q). No URL changes. Needs gateway: GET /api/v1/items with Todo.ticket (cy4q) and POST /projects/{p}/tickets/{id}/{done|drop}; end-to-end unverified (running gateway older than cy4q), tested with fakes."
ticket = "jgg8"
+++

docs/tickets/open/the-ui-s-to-do-views-show-the-human-s-to-dos-as-tickets-ui-u-jgg8.md

## Thread

### note · external:orchestrator · 2026-10-11T15:43:19.935Z
orchestrator: readied, planned and queued tier 1 (br-cy4q landed, per the PdM on ui-utp5). The plan is the ask above. Note: the running gateway is the installed bridle (self-upgraded 14:55Z, before br-cy4q), so the to-do-as-ticket API reaches it at the next self-upgrade (~3 h cycle); develop and test against bridle main's types, and say in the done note which gateway routes the slice needs.

### note · agent:todo-tickets · 2026-10-11T15:44:44.221Z
done: Items shows to-dos as tickets (ticket id chip, title links to ticket page, Todo.ticket synced); check exit 0, 144 vitest tests passed; 5f7e2be. Needs gateway items with Todo.ticket (cy4q) + tickets/{id}/{done|drop} routes; end-to-end unverified (running gateway is older), tested with fakes.

### note · agent:manager-2 · 2026-10-11T15:44:49.411Z
integrated: a6c39a663cdd062bacaaf4b7c4cc7f828d47b225 (branch bridle/todo-tickets)

### note · agent:manager-2 · 2026-10-11T15:44:51.746Z
cleanup: removed agent todo-tickets, branch bridle/todo-tickets
