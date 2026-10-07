+++
id = "ui-mk9b"
title = "Document page: the search clear button moves outside the field, always shown, finger-sized, disabled when the field is empty"
kind = "bug"
state = "integrated"
created_at = "2026-10-06T01:35:01.516Z"
updated_at = "2026-10-07T00:06:51.164602Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "S"
branch = "bridle/clearbtn"
commit = "40d66e39f07e6f6876dee2f95e2fb8978540e802"
summary = "Document search clear button moved beside the input (flex row, not overlaid), always rendered, w-11 h-11 (44px), disabled when the box is empty. Updated design/specs/document.md (r-de1f, s-839b, s-a2fe), Document.test.tsx and the spec steps in specs.test.tsx. Not yet installed to ~/.bridle/ui; not live. One run of npm run check hit a flaky unhandled fetch rejection (unmocked fetch for docs/tickets/open/t-x8jt.md in some test); the rerun was green."
+++

The human (2026-10-05 late evening, via aide): "the clear button is this tiny X that I cannot hit with my finger on mobile ... Just move it outside the box. It can just always be there ... It can just be disabled if the box is empty, and we can come back to the box later." At least a 44px touch target. Update the spec that says the button hides. Done = installed on the live site; say what's live.

## Thread

### note · external:aide · 2026-10-06T01:35:26.697Z
watching the task

### note · system · 2026-10-06T22:14:01.851Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · agent:clearbtn · 2026-10-07T00:06:24.397Z
tip b601678, check green (110 tests). Not installed to the live site. First check run had a flaky unhandled fetch rejection (unmocked fetch in an existing test); rerun green.

### note · agent:manager-1 · 2026-10-07T00:06:28.568Z
integrated: 40d66e39f07e6f6876dee2f95e2fb8978540e802 (branch bridle/clearbtn)

### note · agent:manager-1 · 2026-10-07T00:06:32.621Z
cleanup: removed agent clearbtn, branch bridle/clearbtn

### note · agent:manager-1 · 2026-10-07T00:06:35.536Z
manager-1: landed as 40d66e3 on main, pushed (includes ui-g49c 60e2819). Orchestrator: please install-ui; that makes g49c and mk9b live. Next: ui-m2pz (prototyper, needs WebSearch/WebFetch); ui-qbbk waits for the human to approve the title format.

### note · external:orchestrator · 2026-10-07T00:06:38.115Z
From orchestrator: clearbtn finished ui-mk9b (tip b601678, check green). Land it. The worker also saw a flaky unhandled fetch rejection on its first check run; please file it as a bridle-ui task so it doesn't turn main red later.

### note · external:orchestrator · 2026-10-07T00:06:51.164Z
orchestrator: installed on the live site (40d66e3).
