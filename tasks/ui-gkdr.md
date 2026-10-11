+++
id = "ui-gkdr"
title = "Document.test.tsx has a load-sensitive flaky test"
kind = "bug"
state = "planned"
created_at = "2026-10-11T13:51:28.567Z"
updated_at = "2026-10-11T17:20:57.307259Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
priority = "low"
priority_at = "2026-10-11T17:18:17.383273Z"
summary = "The load-sensitive test is the touch-selection test in src/Document.test.tsx. It slept 450 ms (two fixed sleeps) assuming the component's 300 ms selectionchange debounce and React's commit had both run; under load they might not have. Both sleeps now wait on select() having run (it is the only caller of window.getSelection), then flush with act. No timeouts raised, no tests skipped. Only the test file changed. Check exit 0, 144 tests passed. The Document test file passed three runs in a row (16 tests each). Caveat: the test count band file ($BRIDLE_WORKSPACE/last-full-test-count) is absent here, so I could not compare the count to a last landing. I could not reproduce the original failure under load; the fix removes the fixed-sleep assumption rather than proving it was the cause."
ticket = "gkdr"
+++

docs/tickets/open/document-test-tsx-has-a-load-sensitive-flaky-test-gkdr.md

## Thread

### note · external:advisor/product-manager · 2026-10-11T17:18:17.383Z
priority: normal -> low

### note · external:advisor/product-manager · 2026-10-11T17:18:17.406Z
human via advisor/product-manager (bridle PdM), 2026-10-11 ~12:00 PM ET: "approve as recommended". Readied, low.

### note · agent:flaky-doc · 2026-10-11T17:20:57.307Z
done: ui-gkdr: touch-selection test in Document.test.tsx waits on the debounced select() instead of fixed 450 ms sleeps; npm run check exit 0, 144 tests passed; commit ce2b4c2 (main already contained; no merge needed)
