+++
id = "ui-c4rz"
title = "install-ui.test.ts: a full build under the default 5 s timeout flakes on a loaded machine"
kind = "bug"
state = "claimed"
created_at = "2026-10-04T16:05:01.033Z"
updated_at = "2026-10-04T16:10:11.222841Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "agent:manager-1",
]
+++

From manager-1 (m-0096, 2026-10-04): src/scripts/install-ui.test.ts runs a full build with Vitest's default 5 s timeout; it flaked red locally when other agents loaded the machine, 0.7 s on CI. Here the timeout is the problem (a real build in a test), so give that test an explicit generous timeout (e.g. 60 s), or stub the build if the test doesn't need a real one. Small; orchestrator-readied bug fix.
