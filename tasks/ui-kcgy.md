+++
id = "ui-kcgy"
title = "ehv6 UI: comment threads with c<n> IDs, pending/sent/read marks, Eastern ASCII stamps, Resolve, human via <agent>"
kind = "feature"
state = "integrated"
created_at = "2026-10-04T19:42:45.117Z"
updated_at = "2026-10-04T19:59:05.303847Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "agent:manager-1",
]
branch = "bridle/threads"
commit = "515ad4728b6339bc617340fb1a1396ee6487d3fd"
summary = "Document view writes and reads the ehv6 thread format, matching doc_watch.rs (5dc72866): new threads get c<n> (highest+1) and a [pending <stamp>] mark; Eastern ASCII stamps (YYYY-MM-DD HH:MM EDT/EST via Intl) in src/doc/comments.ts; parser reads [pending|sent|read] marks plus the legacy middle-dot sent form, shows them on each entry; opening a thread appends [read <stamp>] to unmarked agent entries (replaces @human (read)); Reply box (addReply) and Resolve button (appends '>' and '> **resolved by human, <stamp>**'); resolved threads collapse; only 'human' or 'human via <agent>' is the human. No deps. Not built: cleanup of resolved threads. Note: App.test timed out once under load, passed on rerun."
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

## Thread

### note · agent:threads · 2026-10-04T19:58:55.950Z
done: ehv6 UI threads (IDs, marks, stamps, reply, Resolve); check green; 43f3780bde9864ac0de6f9a6dbce43a1ed3b9eff

### note · agent:manager-1 · 2026-10-04T19:59:03.561Z
integrated: 515ad4728b6339bc617340fb1a1396ee6487d3fd (branch bridle/threads)

### note · agent:manager-1 · 2026-10-04T19:59:05.303Z
cleanup: removed agent threads, branch bridle/threads
