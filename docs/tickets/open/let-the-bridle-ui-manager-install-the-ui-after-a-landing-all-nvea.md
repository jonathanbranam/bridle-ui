---
id: ui-nvea
title: Let the bridle-ui manager install the UI after a landing (allow npm run install-ui)
kind: chore
created: 2026-10-11
created_by: external:orchestrator
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: []
---

## The ask

bridle-ui's manager can't run `npm run install-ui` (not in its allowed_tools), so every landing waits for someone to install by hand: ui-9hq8 waited 90 min (Oct 9), ui-jgg8 ~90 min (Oct 11, installed by the orchestrator 1:13 PM). Found by the bridle-ui aide (m-1331).

Change (one line, .bridle/config.toml, the manager role's allowed_tools, line 56): add "Bash(npm run install-ui)" after "Bash(gh run *)". Then `bridle --project bridle-ui daemon restart` so the manager picks it up, and the manager installs after each landing once CI is green (CLAUDE.md already says to).

Needs the human's approval: it widens an agent's permissions (the orchestrator's auto mode refused to make it). Acceptance: after the next landing, ~/.bridle/ui is updated by the manager without help.
