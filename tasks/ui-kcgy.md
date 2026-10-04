+++
id = "ui-kcgy"
title = "ehv6 UI: comment threads with c<n> IDs, pending/sent/read marks, Eastern ASCII stamps, Resolve, human via <agent>"
kind = "feature"
state = "planned"
created_at = "2026-10-04T19:42:45.117Z"
updated_at = "2026-10-04T19:42:57.018966Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
+++

UI half of bridle task br-ehv6 (comment threads). The human approved ehv6, 2026-10-04, via advisor doc-review: "With those caveats, I approve this." (caveats folded into the ticket: ASCII only, a short US zone abbreviation on stamps, agent names in via, thread IDs, read-by-the-agent). Spec: bridle ticket ehv6 in /Volumes/Data/work/bridle/bridle/docs/tickets/open/ (ls *ehv6.md); read it and the br-ehv6 thread (bridle --project bridle task show br-ehv6). The Rust side is on bridle branch bridle/comment-threads (tip 5dc72866): match its parser and writer exactly (crates/bridle-daemon/src/doc_watch.rs and the review code), and the new rules ascii-in-editable-text and human-via-agent in workflow/base/rules/. It needs no daemon or gateway change.

The worker's proposal for this half:
Proposed UI-side task for bridle-ui (Document.tsx, comments.ts), no daemon/gateway change needed:
- Write the new format with the existing document save: new thread header `> [!comment] c<n> human, YYYY-MM-DD HH:MM EDT, on "..." [pending YYYY-MM-DD HH:MM EDT]` (n = highest c<n> in the file + 1); replies `> **human, <stamp>:** text [pending <stamp>]`. Stamp = US Eastern with EST/EDT, ASCII only.
- Parse marks `[pending|sent|read <stamp>]` at the end of an entry's first line (and the legacy ` U+00B7 sent <stamp>`); show the state and time on each entry.
- Agent entries are `**<agent name>, <stamp>:**`; when the human opens a thread in the UI, append `[read <stamp>]` to the agent's unmarked entries. Drop the old `@human (read)` tag suffix.
- Resolve button: appends `>` and `> **resolved by human, <stamp>**` to the thread (same as `bridle review resolve`); resolved threads (any `> **resolved by` line) render collapsed.
- Human entries by an agent read `human via <agent>`; only `human` / `human via ...` are the human.
Not built: deleting resolved threads (cleanup); the ticket leaves its shape open.

Builds on ui-nprk (just landed). Acceptance: the repo checks pass. Model: Sonnet.
