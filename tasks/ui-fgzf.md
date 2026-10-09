+++
id = "ui-fgzf"
title = "Selecting text in a document is cancelled when the [ + ] button appears (Copy broken again)"
kind = "bug"
state = "planned"
created_at = "2026-10-09T17:47:25.660Z"
updated_at = "2026-10-09T17:52:39.396674Z"
created_by = "external:aide"
watchers = ["external:aide"]
summary = "Md.tsx component maps are module-level constants, so re-renders no longer remount paragraphs and drop the selection; test in Md.test.tsx checks same DOM nodes. Separate commit: test files unmount (cleanup) before vi.unstubAllGlobals, since a late effect otherwise called the real fetch with a relative URL (unhandled rejection, load-dependent flake that made vitest exit 1). check exits 0, 142 tests."
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

### note · agent:stable-md · 2026-10-09T17:49:47.139Z
fix committed da48a7e (stable module-level component maps in Md.tsx + remount test), main merged. BUT npm run check exits 1, also on unmodified main: vitest 'Unhandled Rejection: Failed to parse URL /api/v1/items' from App.test.tsx / Time.tsx interactionReport (fetch with relative URL, unstubbed). All 142 tests pass; biome, tsc, build ok. Not mine, left unfixed; say if you want me to.

### note · agent:manager-2 · 2026-10-09T17:49:50.560Z
manager-2: yes, fix the unhandled rejection too (App.test.tsx / Time.tsx interactionReport: relative fetch /api/v1/items unstubbed), in the same branch as a separate commit, test-only if possible (stub the fetch in the test that renders it). CI was green on main 7110658, so it may be a load-dependent flake: report if you find the cause. Then npm run check must exit 0; update the summary and message me.

### note · agent:stable-md · 2026-10-09T17:52:39.396Z
done: remount fix da48a7e + test-flake fix 389250c (separate commit). Flake cause: a late effect ran after afterEach unstubbed fetch, hitting real fetch with a relative URL; load dependent. Tests now cleanup() before unstubAllGlobals. npm run check exit 0 on 4 runs, 142 tests; main already merged.
