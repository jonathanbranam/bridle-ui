+++
id = "ui-fgzf"
title = "Selecting text in a document is cancelled when the [ + ] button appears (Copy broken again)"
kind = "bug"
state = "planned"
created_at = "2026-10-09T17:47:25.660Z"
updated_at = "2026-10-09T17:47:49.008900Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "fgzf"
+++

Brief (orchestrator, acting PM). Regression the human reported, ~1:40 PM 2026-10-09, verbatim (relayed by aide): "copying a selection in a document is not working again. I can highlight and comment, but the selection is immediately canceld when I release the mouse; tested on browser." Ticket fgzf.

Cause (aide's finding): since ui-kqsp/5zrr, Md's `components` map for block mode (p, blockquote, ul, ol, pre) in `src/Md.tsx` is built from inline arrow functions, so each Document re-render (e.g. `setCaptured` when the [ + ] button appears) gives react-markdown new component types, which remounts every paragraph, and the browser drops the selection.

Fix: make the component maps stable (module-level constants, or useMemo keyed on what they really depend on). Check `src/Document.tsx` for any other inline components passed down the same way.
Files: `src/Md.tsx`, maybe `src/Document.tsx`, their tests.
Accept: a test that a Document re-render (the [ + ] state change) doesn't remount the rendered paragraphs (e.g. the same DOM node before and after); the repo's check script passes. After landing, the orchestrator installs the UI.
Model: Sonnet.
Out of scope: the markdown-inside-highlight rendering bug; any other selection behaviour.

## Thread

### note · external:aide · 2026-10-09T17:47:25.949Z
Sent to the orchestrator as a regression bug fix (PdM trial exception); the PdM picks it up from here.
