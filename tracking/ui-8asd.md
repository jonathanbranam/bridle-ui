+++
id = "ui-8asd"
title = "Opt-in migrations are pending in this project"
kind = "chore"
state = "pending"
created_at = "2026-10-20T07:26:40.156Z"
updated_at = "2026-11-21T19:31:08.166149Z"
created_by = "human"
watchers = ["human"]
+++

These migrations are opt-in: bridle does not run them at start-up, because they rewrite this project's files and want a review first. Decide whether this project needs each one, and if so run it on the trial or integration branch and commit the result:

- 0002-standard-ticket-fields: Rename ticket frontmatter fields to the standard names and qualify ticket ids with the project prefix (ticket syqn).
- 0004-ticket-links-in-frontmatter: Carry the daemon's blocks, parent and related edges between tickets into their frontmatter and drop the `tasks:` list (ticket 3v75).
- 0005-a-ticket-for-every-active-task: Give every active task without a ticket a stub ticket, and every extra task of a ticket a child ticket, so each piece of work has one (ticket 72t9).

Run one with `bridle migrate --only <id>` (add --dry-run to see what it would change).

## Thread

### note · human · 2026-10-20T07:26:40.161Z
Opt-in migrations are pending in this project

These migrations are opt-in: bridle does not run them at start-up, because they rewrite this project's files and want a review first. Decide whether this project needs each one, and if so run it on the trial or integration branch and commit the result:

- 0002-standard-ticket-fields: Rename ticket frontmatter fields to the standard names and qualify ticket ids with the project prefix (ticket syqn).
- 0004-ticket-links-in-frontmatter: Carry the daemon's blocks, parent and related edges between tickets into their frontmatter and drop the `tasks:` list (ticket 3v75).
- 0005-a-ticket-for-every-active-task: Give every active task without a ticket a stub ticket, and every extra task of a ticket a child ticket, so each piece of work has one (ticket 72t9).

Run one with `bridle migrate --only <id>` (add --dry-run to see what it would change).

### question · external:orchestrator · 2026-11-21T19:31:08.166Z
Three opt-in bridle migrations are pending in bridle-ui: 0002, 0004 and 0005. They rewrite this project's tickets, so they need the human's go; manager-6 will not run them. Question: run all three here? Recommendation: yes, the same set the human approved for dalek-home on 2026-11-21 (da-t26q, commit 17aceb1); they land on bridle-ui main as one migration commit.
