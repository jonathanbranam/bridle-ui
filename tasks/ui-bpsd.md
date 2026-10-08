+++
id = "ui-bpsd"
title = "Commenting: selection stays native (copy works); a [ + ] button beside it opens the comment box"
kind = "bug"
state = "planned"
created_at = "2026-10-08T23:08:47.856Z"
updated_at = "2026-10-08T23:24:02.975731Z"
created_by = "external:aide"
watchers = ["external:aide"]
summary = "Asks 1-5 built in src/Document.tsx: selection is no longer acted on (onMouseUp and the auto-open removed). A debounced selectionchange captures quote, block and a position, and shows an absolutely positioned [ + ] button below the selection's right end (outside the text flow, clear of the iOS callout). Pointer-down on it is preventDefault'd and flags a tap so a selection cleared by the tap does not drop the capture. Tapping opens the comment box with the quote, and only then does the highlight appear. Button disappears when the selection clears. Spec design/specs/document.md and tests updated. Not built: fallback toolbar (ask 6). Human must test: laptop - select text, Copy works, [ + ] appears below the selection's end, click opens the box and highlights; clearing the selection removes it. Phone (iOS and Android) - long-press select, handles and system Copy menu still work, [ + ] stays clear of the callout and does not move the page, tap opens the box (check iOS tap clearing the selection), button position after scrolling. Unverified in jsdom: real rect positioning."
ticket = "bpsd"
+++

docs/tickets/open/commenting-selection-stays-native-copy-works-a-button-beside-bpsd.md

## Thread

### note · agent:plus-button · 2026-10-08T23:24:02.975Z
done: [ + ] button beside native selection, box+highlight only on tap; check exit 0, 131 tests; 3279892
