+++
id = "ui-44ew"
title = "Flaky unhandled fetch rejection in vitest: some test leaves fetch for docs/tickets/open/t-x8jt.md unmocked (seen once on ui-mk9b's first npm run check)"
kind = "bug"
state = "open"
created_at = "2026-10-07T00:06:43.194Z"
updated_at = "2026-10-07T00:06:45.615025Z"
created_by = "agent:manager-1"
watchers = ["agent:manager-1"]
size = "S"
+++

Reported by worker clearbtn on ui-mk9b: one run of npm run check failed with an unhandled fetch rejection (an unmocked fetch for docs/tickets/open/t-x8jt.md in some test); the rerun was green. Find the test(s) that trigger a real fetch (likely Document view tests after the md/links work) and mock it, so main cannot go red intermittently. Acceptance: npm run check green repeatedly (run vitest 3 times); no behaviour change. Model: sonnet. Approval: orchestrator m-0538.
