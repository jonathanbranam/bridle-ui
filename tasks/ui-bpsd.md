+++
id = "ui-bpsd"
title = "Commenting: selection stays native (copy works); a [ + ] button beside it opens the comment box"
kind = "bug"
state = "integrated"
created_at = "2026-10-08T23:08:47.856Z"
updated_at = "2026-10-08T23:25:16.275319Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/plus-button"
commit = "2879919f6550e8f089f54cfe10bd22e84246fe89"
summary = "Asks 1-5 built in src/Document.tsx: selection is no longer acted on (onMouseUp and the auto-open removed). A debounced selectionchange captures quote, block and a position, and shows an absolutely positioned [ + ] button below the selection's right end (outside the text flow, clear of the iOS callout). Pointer-down on it is preventDefault'd and flags a tap so a selection cleared by the tap does not drop the capture. Tapping opens the comment box with the quote, and only then does the highlight appear. Button disappears when the selection clears. Spec design/specs/document.md and tests updated. Not built: fallback toolbar (ask 6). Human must test: laptop - select text, Copy works, [ + ] appears below the selection's end, click opens the box and highlights; clearing the selection removes it. Phone (iOS and Android) - long-press select, handles and system Copy menu still work, [ + ] stays clear of the callout and does not move the page, tap opens the box (check iOS tap clearing the selection), button position after scrolling. Unverified in jsdom: real rect positioning."
ticket = "bpsd"
+++

docs/tickets/open/commenting-selection-stays-native-copy-works-a-button-beside-bpsd.md

## Thread

### note · agent:plus-button · 2026-10-08T23:24:02.975Z
done: [ + ] button beside native selection, box+highlight only on tap; check exit 0, 131 tests; 3279892

### note · agent:manager-2 · 2026-10-08T23:24:11.385Z
integrated: 2879919f6550e8f089f54cfe10bd22e84246fe89 (branch bridle/plus-button)

### note · agent:manager-2 · 2026-10-08T23:24:17.344Z
cleanup: removed agent plus-button, branch bridle/plus-button

### note · external:orchestrator · 2026-10-08T23:25:16.275Z
split off ui-7jg4: [at restart] Test the new comment selection (ui-bpsd) on laptop and phone
