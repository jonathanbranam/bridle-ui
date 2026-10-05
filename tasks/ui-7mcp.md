+++
id = "ui-7mcp"
title = "wu7r: Document page search box gets a red X clear button (own button, aria-label, phone-sized)"
kind = "feature"
state = "integrated"
created_at = "2026-10-05T00:00:34.316Z"
updated_at = "2026-10-05T00:15:28.634164Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
    "agent:manager-1",
]
branch = "bridle/clear-x"
commit = "44e8faf52711dbc596bc79719cad789172a11f31"
summary = "Added a clear search button next to the search input in Document.tsx. The button appears only when the input has text, shows a red X (✕), has a 44x44 px touch target, and clears the input, search results, and focuses the input on click. The button has aria-label='Clear search' and does not close the document. npm run check passes."
+++

Ticket: bridle repo docs/tickets/open/*-wu7r.md (read it; it quotes the human).

Approval: the human, via aide (m-0223, 2026-10-04): "it needs to have a red X clear button next to it so that it's much easier to just empty that box."

Goal: the Document page's search box (src/Document.tsx, ~line 355, placeholder "Search tickets and docs, or paste a ticket ID") gets a red X clear button, easy to hit on a phone.
- The page's own <button type="button" aria-label="Clear search">, not the native type="search" control (iOS Safari doesn't show one). Red X, inside or right next to the input, touch target at least 44x44 px.
- Shown only when the box has text. Clicking empties the box, clears any search results/state that depend on it, and focuses the input so the human can type at once.
- Doesn't close the open document (the box is filled with its path on open; clearing it is for searching again).
Acceptance: npm run check green; a test: typing shows the button, clicking it empties the box, focuses the input and hides the button; the button has the aria-label.
Model: haiku (small, mechanical).
Out of scope: other search changes or restyling.

## Thread

### note · external:orchestrator · 2026-10-05T00:00:38.619Z
From orchestrator: ui-7mcp (bridle ticket wu7r, the human's ask via aide): a red X clear button on the Document page's search box. Brief on the task; small, haiku. Please spawn and land it once it settles, one worker; tell me when it lands and I'll run install-ui.

### note · external:aide · 2026-10-05T00:00:45.757Z
watching the task

### note · agent:clear-x · 2026-10-05T00:12:57.399Z
done: added clear search button to Document input; a04f9c9

### note · agent:manager-1 · 2026-10-05T00:13:05.266Z
Not accepted yet: the task requires a test and the diff has none. Add one in src/Document.test.tsx: typing in the search box shows the button (aria-label 'Clear search'); clicking it empties the box, focuses the input, and hides the button; the open document stays open. Run npm run check, commit, merge local main, message me the sha.

### note · agent:clear-x · 2026-10-05T00:15:21.133Z
done: added test for clear search button; c1f5885

### note · agent:manager-1 · 2026-10-05T00:15:26.120Z
integrated: 44e8faf52711dbc596bc79719cad789172a11f31 (branch bridle/clear-x)

### note · agent:manager-1 · 2026-10-05T00:15:28.634Z
cleanup: removed agent clear-x, branch bridle/clear-x
