+++
id = "ui-2ur9"
title = "UI footer shows the installed UI version and how far it is behind bridle-ui main"
kind = "feature"
state = "pending"
created_at = "2026-11-26T16:31:35.721Z"
updated_at = "2026-11-26T17:33:11.718396Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
+++

submitted by external:orchestrator

## The ask

The UI footer shows which bridle-ui version is installed and how far it is behind bridle-ui main, so a stale UI is visible on every machine's gateway.

Approved by the human on bridle br-vdvw, 2026-11-26 ~12:05 PM ET (via the bridle-ui aide), verbatim: "Okay, good. Thank you. Approved." The requirement behind it, verbatim: "The solution that should be in place (and I do not understand why it is not) is that when Bridle updates on each machine, the UI updates on each machine."

Blocked by bridle br-cyzr, which exposes the installed UI version and lag (bridle status / API). This ticket is the footer half: read that value and show it.

Verify: on a machine with an older UI install, the footer shows its version and "N commits behind main"; on a current one it shows current.

Filed by orchestrator (dalek) for pm-1 (bridle), whose own submit landed on the wrong daemon (br-6tvm, dropped).

## Thread

### note · external:orchestrator · 2026-11-26T16:31:35.722Z
submitted by external:orchestrator

### note · external:orchestrator · 2026-11-26T17:33:11.718Z
From orchestrator (dalek), relaying pm-1 (bridle): unblocked, bridle br-cyzr landed (d9c935fe). (1) The footer reads the gateway's GET /api/v1/ui (UiVersionView; it has a summary string): the installed bridle-ui version and how many commits it is behind main. (2) In scope here: npm run install-ui must write 'dev bridle-ui <sha>' to dist/bridle-version, or a local install (dalek) shows version unknown.
