+++
id = "ui-sxs3"
title = "Picking a document from the Document page's dropdown opens it (no Open click); a bridle-ui cleanups theme"
kind = "feature"
state = "planned"
created_at = "2026-10-10T17:11:08.806Z"
updated_at = "2026-10-17T11:41:42.649936Z"
created_by = "external:aide"
watchers = ["external:aide"]
priority = "low"
priority_at = "2026-10-10T17:11:44.063770Z"
ticket = "sxs3"
+++


## The ask

The human, 2026-10-10 ~11:10 AM ET, verbatim (speech-to-text, to the bridle-ui aide):

> File a ticket and send it to the product manager. Low priority. Something about how we should have a theme on bridle-ui for enhancements and fixes if we don't have one, and it's just cleanups. When I select a document from the dropdown, it should open the file immediately. I shouldn't have to click Open at all.

Priority: low (the human's word).

## 1. Picking a document opens it

On the Document page, the Document field's suggestions are a native `<datalist>`
(`src/Document.tsx`, `document-matches`). Picking one only fills the field; the human must then
click **Open** (the form's submit). Wanted: picking a suggestion opens the document at once.

Notes for whoever plans it:

- A native datalist pick fires the same `onChange` as typing. One way to tell them apart: open
  when the new value exactly matches one of the current `matches` (and was not typed key by key),
  or use `InputEvent.inputType` (`insertReplacementText` in Chromium and Safari for a datalist pick).
  Check on iOS Safari and desktop.
- Pasting a ticket ID and pressing Enter keeps working; Open can stay for typed paths, or go
  if nothing needs it.
- ui-hu3k (the human's pending choice of document picker prototype A, B or C, ui-m2pz) may
  replace this picker. Whichever picker ships, selecting a document should open it.

## 2. A theme for bridle-ui cleanups

The roadmap (bridle's docs/notes/roadmap.md) has theme `human-ui` ("The human's interface") but
no home for small bridle-ui enhancements and fixes. The human asks for a theme for them
("just cleanups") if there isn't one. This is for the product manager to decide: a new theme, or
an epic or a "cleanups" group under `human-ui`. This ticket would be its first entry.

## Brief (orchestrator, acting PM for bridle-ui, 2026-10-17)

- **Goal:** part 1 only. On the Document page, picking a suggestion from the Document field's
  datalist opens that document at once, as if Open were clicked.
- **Files:** `src/Document.tsx` (the `document-matches` datalist and the form's submit) and its
  tests. Nothing else expected.
- **How:** open when the new value comes from a datalist pick: `InputEvent.inputType ===
  'insertReplacementText'`, or the value exactly equals one of the current `matches` and was not
  typed one key at a time. Typing, pasting a ticket ID and pressing Enter, and the Open button for
  typed paths keep working.
- **Acceptance:** a unit test for pick-opens and type-does-not-open; verified in a browser (rule
  `verify-ui-in-a-browser`, desktop Chromium; note on the ticket if iOS Safari can't be checked).
- **Model:** Sonnet.
- **Out of scope:** part 2 (the cleanups theme) is the product manager's call, not code. ui-hu3k
  may replace this picker later; don't wait for it.

## Thread

### note · external:advisor/product-manager · 2026-10-10T17:11:44.063Z
priority: normal -> low

### note · external:advisor/product-manager · 2026-10-17T02:06:34.606Z
The human, 2026-10-16 ~10:10 PM ET, to advisor (product-manager): "Yes I approve the \"cheap batch\" of tickets mentioned earlier".

### note · system · 2026-10-17T06:07:02.568Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:advisor/product-manager · 2026-10-17T11:41:42.649Z
advisor (product-manager): part 2 is done: the roadmap has had epic `ui-cleanups` (bridle-ui enhancements and fixes) under theme `human-ui` since 2026-10-10 (docs/notes/roadmap.md in bridle); this ticket is in it. Only part 1 is left to build.
