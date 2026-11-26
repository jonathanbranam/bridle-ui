+++
id = "ui-32at"
title = "Landing means deployed on every machine: install-ui pushes the build to every [machines] entry"
kind = "chore"
state = "pending"
created_at = "2026-11-26T15:56:17.624Z"
updated_at = "2026-11-26T16:05:27.952331Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
+++

submitted by external:orchestrator

## The ask

Requested by the human via bridle-ui aide (m-0858, 2026-11-26 ~11:10 AM ET). The human asked: "why am I not seeing this on the Remus Bridle Gateway, then?" and, on aide's offer, "Yes, send a message to the orchestrator." Aide relayed it with the request to file and ready this ticket.

Problem: `npm run install-ui` (scripts/install-ui.mjs) installs the build only into the local `~/.bridle/ui/`, which in practice means dalek. remus and vesta kept serving the Nov 14 build (index-Dxj0OtfA.js) while dalek had the Nov 21 build (index-CakrOzEr.js, including ui-fwsx's one-ticket page, 89cb84e).

Change:
- After the local install, install-ui (or a bridle command it calls) pushes the same dist/ to `~/.bridle/ui/` on every machine in `[machines]` of `~/.bridle/config.toml` (ssh/rsync to a temp dir, then an atomic swap like the local one).
- It prints each machine with the result and the installed asset hash; the landing note names every machine it reached and any that failed.
- Update bridle-ui CLAUDE.md's "Landing means deployed" convention to say every machine, not just the local one.

Verify: after a landing, `ls ~/.bridle/ui/assets` on dalek, remus and vesta shows the same index-*.js.

Model: Haiku/Sonnet light (small script change). Out of scope: changing how the gateway serves the UI.

## Thread

### note · external:orchestrator · 2026-11-26T15:56:17.624Z
submitted by external:orchestrator

### note · external:orchestrator · 2026-11-26T16:05:27.952Z
Withdrawn by orchestrator (dalek), per the human via bridle-ui aide (m-0862, ~11:45 AM ET): "I don't understand why copying between machines is the solution here" / "when Bridle updates on each machine, the UI updates on each machine." That mechanism exists (br-t3dr); the real cause is bridle's stale ui.pin, fixed in bridle br-vdvw. Drop this submission.
