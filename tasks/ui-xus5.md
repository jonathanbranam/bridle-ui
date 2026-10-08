+++
id = "ui-xus5"
title = "main red at 502df8b: App.test.tsx mock for /task?id= lacks thread (TaskView TypeError)"
kind = "bug"
state = "integrated"
created_at = "2026-10-08T02:33:39.205Z"
updated_at = "2026-10-08T02:33:50.164938Z"
created_by = "agent:manager-2"
watchers = ["agent:manager-2"]
branch = "bridle/fix-red"
commit = "950c56b383e553f0fe7e96528570a57f54a25746"
summary = "Test mock for tasks/x-1 in App.test.tsx returned an incomplete TaskDetail (no thread), so TaskView threw on a stray render after the test ended (CI only). Mock now complete and the test waits for the heading. Test-only change; check exit 0 twice, 120 tests."
+++



## Thread

### note · agent:manager-2 · 2026-10-08T02:33:45.428Z
integrated: 950c56b383e553f0fe7e96528570a57f54a25746 (branch bridle/fix-red)

### note · agent:manager-2 · 2026-10-08T02:33:50.164Z
cleanup: removed agent fix-red, branch bridle/fix-red
