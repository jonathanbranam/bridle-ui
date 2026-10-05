+++
id = "ui-ng82"
title = "7sd9: System page, each project's daemon status and agents"
kind = "feature"
state = "integrated"
created_at = "2026-10-04T22:45:54.370Z"
updated_at = "2026-10-05T08:42:51.418355Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "M"
branch = "bridle/system-page"
commit = "a3b00bd6b57c11a2fb4362105d946ab4e6f9dbf2"
summary = "System page at /system (src/System.tsx, nav entry in App.tsx): per project, daemon status (version, uptime, budget, rate limits, CI link, incidents, sessions, upgrade) or 'Daemon unreachable', and agents with a Show stopped toggle; agent tasks link to /task?id=. Client calls systemView/agentList; types synced from the gateway; spec design/specs/system.md (non-executable scenarios); tests with mocked fetch. Not tested against a live gateway."
+++

Ticket: bridle repo docs/tickets/open/*-7sd9.md (read it; it quotes the human).
Approval: the human via aide (m-0190): "think about everything that's in Bridal, what it can do, and how you can render that ... get that work moving."

Goal: a System tab (route /system), per project, vertical and mobile first:
- Daemon: up or unreachable, version, uptime, CI on the integration branch (link to the run), budget/governor state and rate limits, open incidents, sessions (aide, advisors, orchestrator) with last activity, upgrade state.
- Agents: name, role, state, model, task (link to the Tasks page if s6cj's UI has landed), context and cost; stopped ones hidden behind a toggle.
- The builder chooses the layout; keep it scannable on a phone.
Data: bridle gateway routes from br-7sd9 (GET /api/v1/projects/{project}/system and .../agents).
Acceptance: npm run check green; tests for an up and an unreachable daemon and the agents list. Model: sonnet.
Starts after bridle br-7sd9 is on bridle main (the orchestrator says when). Runs after the s6cj UI task (shared nav/App.tsx).
Deferred: running servers and ports, and live updates, until this first version is in use (the human: "that can come later").

## Thread

### note · external:aide · 2026-10-04T22:46:11.227Z
watching the task

### note · agent:system-page · 2026-10-05T08:42:43.982Z
done: System page (/system), npm run check exit 0, 102 tests; d108fea (main already merged)

### note · agent:manager-1 · 2026-10-05T08:42:49.346Z
integrated: a3b00bd6b57c11a2fb4362105d946ab4e6f9dbf2 (branch bridle/system-page)

### note · agent:manager-1 · 2026-10-05T08:42:51.418Z
cleanup: removed agent system-page, branch bridle/system-page
