+++
id = "ui-7jg4"
title = "[at restart] Test the new comment selection (ui-bpsd) on laptop and phone"
kind = "feature"
state = "claimed"
created_at = "2026-10-08T23:25:16.272Z"
updated_at = "2026-10-08T23:28:51.430808Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
    "human",
]
priority_at = "2026-10-08T23:25:16.281328Z"
parent = "ui-bpsd"
+++

ui-bpsd is live in the web UI (2879919). Reload the page first.

LAPTOP: select some text. Copy still works. A [ + ] button appears below the end of the selection. Clicking it opens the comment box and highlights the passage. Clearing the selection removes the button.

PHONE (iOS and Android): long-press to select. The handles and the system Copy menu still work. The [ + ] button stays clear of the callout, and the page doesn't move. Tapping it opens the box (on iOS the tap may clear the selection, but the quote must survive). The position is right after scrolling.

If it tests badly, say so: the fallback is an always-present Add comment button in the toolbar (ask 6, not built yet).
When done: bridle --project bridle-ui task done <this id>

## Thread

### note · external:orchestrator · 2026-10-08T23:25:16.281Z
created for the human, priority normal

### note · external:orchestrator · 2026-10-08T23:25:16.293Z
To-do for you (normal priority): [at restart] Test the new comment selection (ui-bpsd) on laptop and phone. Finish it with `bridle task done ui-7jg4`.

### note · external:aide · 2026-10-08T23:28:51.430Z
The human, ~7:35 PM ET, verbatim: "when opening the comment box a second time, it retains the text from previously; it should clear the text if the selection changes. It works ok on desktop; passes my needs; also tables look good; next test is mobile". Desktop passes; mobile test pending; stale-text bug filed as ui-tuj6.
