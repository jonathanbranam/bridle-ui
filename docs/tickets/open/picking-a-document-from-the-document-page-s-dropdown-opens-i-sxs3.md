---
id: sxs3
title: Picking a document from the Document page's dropdown opens it (no Open click); a bridle-ui cleanups theme
kind: feature
opened: 2026-10-10
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: []
tasks: [ui-sxs3]
---

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
