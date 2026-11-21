---
id: ui-4a7d
title: "Document page picker: build prototype A (omnibox search, results under it), recents only in a small dropdown"
kind: feature
created: 2026-11-21
created_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [ui-sxs3]
resolved: 2026-11-21T19:07:47Z
---

## The ask

The human, 2026-11-21 ~1:50 PM ET, verbatim (to the bridle-ui aide):

> on the dropdown box for picking documents to edit, remind me where that is. I know it's stalled out. We should just pick the one that I liked the best and implement it. What's currently there is just awful, and any change would be better.

The one they liked best is prototype **A (omnibox)** from ui-m2pz. Their words then (2026-10-06, via aide, on ui-m2pz):

> Preference atm is (a) but not with the recents listed. Recents could be in a dropdown, though which would be ok, but not filling the page.

Build it: replace the Document page's picker (`src/Document.tsx`, the `<datalist>` `document-matches` plus the Open button) with prototype A.

- One always-visible search field at the top of the Document page; results scroll under it, filename bold with its folder muted below (as `prototypes/m2pz/a.html` on branch `bridle/picker-proto`, commit 6da8f9d).
- **No recents list filling the page.** Recents, if any, go in a small dropdown off the field (the human: "ok, but not filling the page").
- Picking a result opens the document at once, with no Open click (ui-sxs3's ask, which this supersedes for the new control). Pasting or typing an exact ticket ID opens it too.
- Follow docs/research/m2pz-long-list-picking.md: 4-8 suggestions visible on a phone, finger-sized rows, WAI-ARIA combobox keyboard behaviour, 16px field.
- Check at 375, 768, 1280 and 1920 px, and verify in a browser on a throwaway site (CLAUDE.md).

Approved by asking: the human asked for this to be built, and said "any change would be better".
