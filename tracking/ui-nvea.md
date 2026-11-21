+++
id = "ui-nvea"
title = "Let the bridle-ui manager install the UI after a landing (allow npm run install-ui)"
kind = "chore"
state = "integrated"
created_at = "2026-10-11T17:14:08.998Z"
updated_at = "2026-11-21T20:54:24.868705Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
branch = "main"
commit = "f281140"
summary = "The human's commit f281140 added Bash(npm run install-ui) to the bridle-ui manager's allowed_tools. Closed on the human's go."
ticket = "nvea"
+++

docs/tickets/open/let-the-bridle-ui-manager-install-the-ui-after-a-landing-all-nvea.md

## Thread

### note · external:orchestrator · 2026-10-17T17:45:30.852Z
From orchestrator: readied under br-mhjn by mistake: the ask says it needs the human's approval (widens the manager's allowed_tools). Not planned; holding until the human says yes (asked via aide).

### note · system · 2026-10-17T21:45:46.759Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:aide · 2026-10-18T02:14:11.178Z
From the human, via aide (2026-10-17 ~10:15 PM ET), replying to my list that recommended "yes" on ui-nvea: "Agree. Fix later". Read as ui-nvea YES: add Bash(npm run install-ui) to the bridle-ui manager's allowed_tools (that permission only).

### note · external:orchestrator · 2026-10-18T02:14:24.687Z
Approved by the human, via aide (m-0180, 2026-10-17 ~10:15 PM ET): "Agree. Fix later", replying to aide's list recommending yes here. Scope: add Bash(npm run install-ui) to the bridle-ui manager's allowed_tools, that permission only. Readied by orchestrator.

### note · external:advisor/product-manager · 2026-10-18T02:14:30.684Z
advisor product-manager: readied on the human's yes (via aide, 2026-10-17 ~10:15 PM ET). Scope: add Bash(npm run install-ui) to the bridle-ui manager's allowed_tools, that permission only. Brief as a proposal (problem, approach, scope).

### note · external:aide · 2026-10-18T02:20:15.886Z
Confirmed by the human, via aide (2026-10-17 ~10:20 PM ET), asked whether "Agree. Fix later" approved ui-nvea and br-9s8u P1: "Those are good".

### note · system · 2026-10-18T06:20:41.259Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:aide · 2026-11-17T13:21:22.202Z
readied by external:aide

### note · external:aide · 2026-11-17T13:21:22.799Z
aide: readied under rule ready-without-asking. The human approved this on 2026-10-17 (quote above); this grants only Bash(npm run install-ui).

### note · system · 2026-11-17T17:21:37.367Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:orchestrator · 2026-11-17T22:39:49.074Z
Orchestrator, 2026-11-17: tried the one-line edit; Claude Code auto mode refused it as widening an agent's permissions. Planning won't help (no bridle-ui manager runs, and a worker would hit the same refusal). Steps sent to the human via aide (m-0755): add "Bash(npm run install-ui)" after "Bash(gh run *)" in .bridle/config.toml line 56, commit only that file, push, bridle --project bridle-ui daemon restart.

### note · external:aide · 2026-11-18T06:04:59.034Z
aide: the human made the change themselves: commit f281140 'Adds install-ui permissions.' (now on origin/main), daemon restarted after. Acceptance still to see: the manager installs after the next landing on its own. Ready to close once that happens.

### note · external:aide · 2026-11-21T14:57:58.840Z
Done by the human's own commit f281140 (2026-11-17 9:47 PM ET, 'Adds install-ui permissions'): .bridle/config.toml line 56 now allows Bash(npm run install-ui) for the manager. Nothing left to build; the orchestrator can close it.

### note · external:aide · 2026-11-21T20:53:24.330Z
From the human, via aide (2026-11-21 ~3:55 PM ET), verbatim: "Good close it."

### note · external:orchestrator · 2026-11-21T20:54:10.842Z
Closed by orchestrator on the human's go (human via aide, m-0845, 2026-11-21 ~3:55 PM ET): "Good close it."

### note · external:orchestrator · 2026-11-21T20:54:20.647Z
integrated: f281140 (branch main)

### note · external:orchestrator · 2026-11-21T20:54:21.042Z
cleanup: removed nothing; failed: branch main: git ["branch", "-D", "main"] failed: error: Cannot delete branch 'main' checked out at '/Volumes/Data/work/bridle-ui-workspace/bridle-ui'
