+++
id = "ui-mbhk"
title = "Fixes from incident wdp3: aide checks the task list before saying work hasn't started; the manager installs the UI after each landing"
kind = "chore"
state = "planned"
created_at = "2026-10-08T02:13:04.743Z"
updated_at = "2026-10-08T02:13:07.464529Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
parent = "ui-wdp3"
+++

From incident ui-wdp3 (readied on the human's go, 2026-10-07 ~10:15 PM ET: "Be sure the bridle-ui work gets done tonight."). (1) bridle-ui's manager runs 'npm run install-ui' after each landing on main once CI is green, and says so in its landing note; write it into bridle-ui's CLAUDE.md or the manager's project role notes (tonight the orchestrator did it by hand after ui-2kmw and ui-k9a8). (2) Link ui-n6cu to ticket k3qx (bridle ticket set / the ticket's tasks field) and resolve k3qx if its ask is done. (3) Write the postmortem into the incident's thread: what happened, cause, the fixes. The aide role lives in the bridle repo: describe the aide change needed (check bridle task list, git log and the orchestrator's trail before telling the human something hasn't started) in the summary; the orchestrator files it there. Model: Sonnet (Haiku would do for (2)). Done: changes landed, summary on this thread.
