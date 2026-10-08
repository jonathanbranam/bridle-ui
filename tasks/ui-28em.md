+++
id = "ui-28em"
title = "Exact link formats for tasks, tickets, documents and specs, in every agent instruction; a rule that URL changes update them"
kind = "feature"
state = "integrated"
created_at = "2026-10-06T12:13:11.706Z"
updated_at = "2026-10-08T10:05:42.911876Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/linkrule"
commit = "664f00ba4f77f1a3e231f716d9a2531f35daeccb"
summary = "ui-28em (parts 1 and 3; part 2 is the bridle-repo task) is done in docs/design/url-scheme.md and CLAUDE.md. The section 3 'Final formats' table is now declared the one link-format reference at the top of url-scheme.md. CLAUDE.md Conventions gets a rule: a URL scheme change or new deep link files a task to update agent instructions and bridle link, and updates that table in the same change. Doc-only; no npm check run (not needed per task). Main merge was already up to date. Choice: the rule links the table with the wiki form [[docs/design/url-scheme]] (doc-links rule). Pre-existing non-ASCII em dash at CLAUDE.md line 65 sits in the bridle-managed block, not touched."
ticket = "28em"
+++

docs/tickets/open/exact-link-formats-for-tasks-tickets-documents-and-specs-in-28em.md

## Thread

### note · external:orchestrator · 2026-10-08T02:21:50.293Z
orchestrator (acting PM): readied on the human's go in the orchestrator's session 2026-10-07 ~10:20 PM ET ("Be sure the bridle-ui work gets done tonight"; URL answers in ui-judt). This repo's part, after ui-judt lands: (1) the exact link format per kind is the table ui-judt writes in docs/design/url-scheme.md; make it the one reference; (3) add the rule to bridle-ui's CLAUDE.md: any change to the URL scheme or a new deep link files a task to update the agent instructions and 'bridle link' (in the bridle repo). Part (2), the agent instructions and 'bridle link' themselves, is a bridle-repo task the orchestrator files. Model: Haiku.

### note · agent:linkrule · 2026-10-08T10:05:32.786Z
Done in 168c66a: url-scheme.md top note names the section 3 Final formats table as the one reference; CLAUDE.md Conventions rule added (link to the table, bridle link task on URL changes). Part 2 stays with the orchestrator's bridle-repo task.

### note · agent:linkrule · 2026-10-08T10:05:33.417Z
done: ui-28em parts 1 and 3 (docs only); 168c66ae648a357980e82e5146003cf67b298e67; npm check not run (doc-only)

### note · agent:manager-2 · 2026-10-08T10:05:41.174Z
integrated: 664f00ba4f77f1a3e231f716d9a2531f35daeccb (branch bridle/linkrule)

### note · agent:manager-2 · 2026-10-08T10:05:42.911Z
cleanup: removed agent linkrule, branch bridle/linkrule
