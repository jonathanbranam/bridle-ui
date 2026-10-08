+++
id = "ui-wdp3"
title = "bridle-ui aide told the human twice that k3qx routing hadn't started; it had landed in 10 min (ui-n6cu, 7af2f59)"
kind = "incident"
state = "planned"
created_at = "2026-10-04T21:21:33.773Z"
updated_at = "2026-10-08T02:13:04.744889Z"
created_by = "external:aide"
watchers = ["external:aide"]
+++

The human, verbatim (2026-10-04, to the bridle-ui aide): "Okay, what's going on with this work? To describe what happened, we're going to need to file an incident for this."

What happened (times US Eastern, 2026-10-04):
- 11:45 AM: aide relayed the human's routing ask to external:orchestrator (m-0077, ticket k3qx in the bridle repo, commit 4c2dc065). The orchestrator read it at 11:46.
- 11:46 AM: the orchestrator filed ui-n6cu and sent it to the manager (m-0079). 11:56 AM: it landed on main as 7af2f59 (react-router; tabs at /, /time, /document; open document in ?project=&path=), and the manager reported it to the orchestrator (m-0090).
- 11:58 AM: main went red at 7af2f59 (CI run 37214870738, the App tests' /items mock); fixed and green at 12:04 PM (68e953a, run 37215402984).
- Nothing was sent to external:aide: no messages to aide in this daemon, though the aide role says the orchestrator's merge summaries arrive there.
- About 3 h and 4.5 h after the ask, the aide told the human twice that the orchestrator "hasn't acted on k3qx": no reply and no task. Both were wrong. The aide checked only its inbox, the human's to-dos and status `pending_tasks` (0 because the task was already integrated). It didn't look at `bridle task list`, `git log` or the orchestrator's message trail.
- Ticket k3qx still says `tasks: []` and is in open/; ui-n6cu isn't linked to it, and the ticket isn't resolved.
- The manager noted that the routing was "not checked in a browser against the real gateway fallback" (m-0090).

Effect: the human was told twice that finished work hadn't been started.

## Thread

### note · external:aide · 2026-10-04T21:22:06.341Z
Found 2026-10-04 5:25 PM ET, after the human said "I'm just loaded up the site and it doesn't look any different at all to me": 'landed' meant merged to bridle-ui main, not deployed. The gateway serves the static copy in ~/.bridle/ui/, last installed 8:41 AM, with no hot reload. Nobody ran npm run install-ui after ui-n6cu, ui-nprk or ui-kcgy. And the running bridle gateway (pid 71570) started at 8:55 AM; the bridle binary was rebuilt at 5:09 PM, so it also lacks bridle's br-jrm2 part A (d0533a81, gateway /documents?q=), which ui-nprk needs. No role owns installing the UI or restarting the gateway after a landing, and no one told the human either step was needed.

### note · external:orchestrator · 2026-10-08T02:12:57.739Z
orchestrator (acting PM): readied on the human's go, in the orchestrator's session 2026-10-07 ~10:15 PM ET: "Be sure the bridle-ui work gets done tonight." Brief: a postmortem of this incident (what happened is in the body and the aide's note) with fixes: (1) the aide role checks bridle task list / git log / the orchestrator's message trail before telling the human something hasn't started; (2) someone owns 'npm run install-ui' after a UI landing (tonight the orchestrator did it by hand twice: after ui-2kmw and ui-k9a8). Recommend the bridle-ui manager runs it after each landing on main once CI is green, and says so in its landing note; write that into bridle-ui's manager role or CLAUDE.md. (3) link ui-n6cu to ticket k3qx and resolve k3qx if done. Model: Sonnet. Done: changes landed, summary on this thread. Role files in the bridle repo (aide) are out of scope for this repo: if a change there is needed, describe it in the summary and the orchestrator files it.

### note · external:orchestrator · 2026-10-08T02:13:04.744Z
split off ui-mbhk: Fixes from incident wdp3: aide checks the task list before saying work hasn't started; the manager installs the UI after each landing
