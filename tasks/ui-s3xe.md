+++
id = "ui-s3xe"
title = "c2xn: highlight-to-comment on mobile: open the comment box from a touch selection, not only mouseup"
kind = "bug"
state = "integrated"
created_at = "2026-10-04T23:21:36.449Z"
updated_at = "2026-10-04T23:38:56.006185Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
    "agent:manager-1",
]
branch = "bridle/touch-select"
commit = "c5c0a0abd8c8519b912b4ba5b090d320cf6ed588"
summary = "Document.tsx: a document-level selectionchange listener (debounced 300 ms, removed on unmount) calls the same select path as onMouseUp, which stays for desktop. select is now a stable useCallback; it ignores collapsed selections and ones outside [data-last] body blocks, and never touches the selection. A repeat fires setPending with the same value, so no second box. Test added in Document.test.tsx. No docs needed updating."
+++

Ticket: bridle repo docs/tickets/open/bridle-ui-highlight-to-comment-doesn-t-trigger-on-mobile-onl-c2xn.md (read it; it quotes the human).

Approval: the human, via aide (m-0203, 2026-10-04): "Highlighting does work on mobile. The native highlight probably doesn't trigger the same as on desktop." / "Right doesn't work on mobile". Mobile was part of the original ask (jrm2): "supporting both is essential".

Goal: selecting text in the Document page's body opens the comment box on phones (iOS Safari, Android Chrome), as mouseup does on desktop.
- src/Document.tsx opens the box only from onMouseUp={select} on the body (~line 385); `select` reads window.getSelection() (~line 281). A native long-press-and-drag selection on touch fires no mouseup.
- Fix: also react to touch selections. Recommended: a document-level `selectionchange` listener (debounced, ~300 ms, or acted on at touchend/pointerup) that calls the same `select` path when the selection is non-empty and inside the document body; keep onMouseUp for desktop. Don't open the box twice for one selection, and don't fight the OS selection menu (don't clear or move the selection).
- Clean up the listener on unmount.
Acceptance: npm run check green; a test that fires selectionchange (and/or touchend) with a selection inside the body opens the comment box, and one outside the body doesn't.
Model: sonnet (event handling with a debounce; small).
Out of scope: rendering changes; ui-pmkd reworks the body afterwards and builds on this, so keep the change local to the selection handling.

## Thread

### note · external:orchestrator · 2026-10-04T23:21:47.987Z
From orchestrator: ui-s3xe (bridle ticket c2xn, the human's bug via aide): highlight-to-comment doesn't open the comment box on mobile. Brief is on the task; small, sonnet worker. Please spawn and land it now, one worker. ui-pmkd stays held (it builds on this, after br-bnhn and br-a3yd land on bridle main).

### note · external:aide · 2026-10-04T23:21:55.826Z
watching the task

### note · agent:touch-select · 2026-10-04T23:38:42.437Z
done: touch selections open the comment box via debounced selectionchange; cb40f68

### note · agent:manager-1 · 2026-10-04T23:38:54.161Z
integrated: c5c0a0abd8c8519b912b4ba5b090d320cf6ed588 (branch bridle/touch-select)

### note · agent:manager-1 · 2026-10-04T23:38:56.006Z
cleanup: removed agent touch-select, branch bridle/touch-select
