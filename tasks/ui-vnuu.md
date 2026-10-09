+++
id = "ui-vnuu"
title = "Comment IDs never repeat after deletes: a counter in the document's front matter"
kind = "bug"
state = "planned"
created_at = "2026-10-09T18:09:06.050Z"
updated_at = "2026-10-09T19:04:45.985233Z"
created_by = "external:aide"
watchers = [
    "external:aide",
    "external:advisor/product-manager",
]
priority = "high"
priority_at = "2026-10-09T18:09:53.598680Z"
ticket = "vnuu"
+++

Brief (orchestrator, acting PM). Ticket vnuu has the human's words (2026-10-09 ~2:00 PM ET) and the full ask; this task is the bridle-ui half. Field (the human, via the bridle-ui aide, 2026-10-09 ~2:15 PM ET: "the front-matter field is `next_comment_id: c<n>` (the ID the next comment gets; e.g. `next_comment_id: c7`) ... use exactly this name and form"): `next_comment_id`, a string `c<n>`. The next ID is c(max(n from next_comment_id, highest existing c<n> + 1)); after assigning c<k>, write `next_comment_id: c<k+1>`. Same field in bridle (br-gd43) and bridle-ui (ui-vnuu). This supersedes the earlier `comment_next` integer.
Files: src/doc/comments.ts (nextId and every writer that assigns an ID; deleteThread never lowers the counter), the front-matter writer it needs (create a minimal front matter when none), the Document page's front-matter table if it chokes on the key, tests.
Accept: tests: delete the newest thread, then all threads, add a comment, the ID keeps counting up; a file without the field still works and gets it on the first new ID; the repo's check script passes.
Model: Sonnet. Out of scope: the bridle half (br-gd43: daemon assign_ids and the reviewer role doc).

## Thread

### note · external:advisor/product-manager · 2026-10-09T18:09:53.598Z
priority: normal -> high

### note · external:advisor/product-manager · 2026-10-09T18:09:53.642Z
watching the task

### note · external:advisor/product-manager · 2026-10-09T18:09:58.091Z
From advisor (product-manager): readied, high (live since ui-ha6m landed). No design review: the human proposed the shape. The bridle half is br-gd43 (assign_ids, front-matter readers, document-reviewer role doc); agree the field name on this thread so both halves match.

### note · external:aide · 2026-10-09T19:03:59.352Z
From the human, via aide, 2026-10-09 ~2:15 PM ET: the field name is decided by the human, not a worker ("we should decide if possible not a worker"). Chosen: `next_comment_id: c7` style, i.e. `next_comment_id: c<n>`, the ID the next comment gets. Both halves (this task and bridle br-gd43) use exactly this; the ticket is updated.

### note · external:orchestrator · 2026-10-09T19:04:45.985Z
orchestrator: brief updated: field is next_comment_id: c<n> (the human's choice, ~2:15 PM ET), superseding comment_next.
