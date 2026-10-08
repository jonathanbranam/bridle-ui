+++
id = "ui-mbhk"
title = "Fixes from incident wdp3: aide checks the task list before saying work hasn't started; the manager installs the UI after each landing"
kind = "chore"
state = "integrated"
created_at = "2026-10-08T02:13:04.743Z"
updated_at = "2026-10-08T02:20:00.602879Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
branch = "bridle/wdp3-fixes"
commit = "50e4017cd1ef3b7a709b6f3c25efdd70b0025458"
summary = """
Postmortem (ui-mbhk, wdp3-fixes). Times US Eastern, 2026-10-04.

What happened: the human's routing ask (ticket k3qx) reached the orchestrator at 11:46 AM, became ui-n6cu, and landed on main as 7af2f59 at 11:56 AM (main red at 11:58, green again at 12:04 PM with 68e953a). The aide never heard of it, and told the human twice (about 3 h and 4.5 h later) that the orchestrator had not acted. Both statements were wrong. Separately, at 5:25 PM the human loaded the site and saw no change: "landed" meant merged, not deployed. ~/.bridle/ui/ was last installed at 8:41 AM and the gateway was older than the bridle binary.

Cause: (1) the aide judged "not started" from its inbox, the human's to-dos and status pending_tasks (0, since the task was already integrated). It did not check bridle task list, git log or the orchestrator's message trail. (2) Nothing told the aide about merges, though its role says merge summaries arrive there. (3) No role owned `npm run install-ui` (or a gateway restart) after a landing, so merged work was invisible to the human. (4) k3qx was never linked to ui-n6cu or resolved, so the ticket still read tasks: [] in open/, which looked like no work.

Fixes:
- Manager runs `npm run install-ui` after each landing on main once CI is green, and says so in the landing note. Written into bridle-ui CLAUDE.md (Conventions). A gateway restart, when a landing needs a newer bridle binary, is still not owned; raise it with the orchestrator.
- Aide role (bridle repo, to be filed by the orchestrator): before telling the human work has not started or was not acted on, check `bridle task list`, `git log` on main, and the orchestrator's message trail, not only the inbox, to-dos and pending_tasks. Say "I could not find it" with what was checked, rather than "it hasn't started".
- Ticket k3qx lives in the bridle repo; this worktree cannot reach it. It needs `bridle ticket set k3qx tasks ui-n6cu` and `bridle ticket resolve k3qx` there (the ask is done: ui-n6cu, 7af2f59). Not done from here."""
parent = "ui-wdp3"
+++

From incident ui-wdp3 (readied on the human's go, 2026-10-07 ~10:15 PM ET: "Be sure the bridle-ui work gets done tonight."). (1) bridle-ui's manager runs 'npm run install-ui' after each landing on main once CI is green, and says so in its landing note; write it into bridle-ui's CLAUDE.md or the manager's project role notes (tonight the orchestrator did it by hand after ui-2kmw and ui-k9a8). (2) Link ui-n6cu to ticket k3qx (bridle ticket set / the ticket's tasks field) and resolve k3qx if its ask is done. (3) Write the postmortem into the incident's thread: what happened, cause, the fixes. The aide role lives in the bridle repo: describe the aide change needed (check bridle task list, git log and the orchestrator's trail before telling the human something hasn't started) in the summary; the orchestrator files it there. Model: Sonnet (Haiku would do for (2)). Done: changes landed, summary on this thread.

## Thread

### note · agent:wdp3-fixes · 2026-10-08T02:19:46.842Z
done: CLAUDE.md install-ui rule + postmortem on ui-wdp3; k3qx link/resolve NOT done (ticket is in the bridle repo, unreachable here: needs 'bridle ticket set k3qx tasks ui-n6cu' + resolve there); aide-role change described in summary; doc-only so no check; 8aba19a

### note · agent:manager-2 · 2026-10-08T02:19:56.601Z
integrated: 50e4017cd1ef3b7a709b6f3c25efdd70b0025458 (branch bridle/wdp3-fixes)

### note · agent:manager-2 · 2026-10-08T02:20:00.602Z
cleanup: removed agent wdp3-fixes, branch bridle/wdp3-fixes
