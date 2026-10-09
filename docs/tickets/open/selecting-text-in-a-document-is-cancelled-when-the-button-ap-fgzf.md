---
id: fgzf
title: Selecting text in a document is cancelled when the [ + ] button appears (Copy broken again)
kind: bug
opened: 2026-10-09
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [bpsd, kqsp, 5zrr]
tasks: [ui-fgzf]
---

## The ask

The human, 2026-10-09 ~1:40 PM ET, verbatim (to the bridle-ui aide): "copying a selection in a document is not working again. I can highlight and comment, but the selection is immediately canceld when I release the mouse; tested on browser."

A regression of ui-bpsd (native selection and Copy kept working), introduced by ui-kqsp/ui-5zrr (0e39335) on 2026-10-09 08:24.

## Cause (found by the aide)

`Md` in `src/Md.tsx` builds its `components` map inline on every render, and in block mode (new in kqsp) that includes `p`, `blockquote`, `ul`, `ol` and `pre` as fresh arrow functions. React sees a new component type each render, so it unmounts and remounts those elements. When a selection settles, `select` in `src/Document.tsx` calls `setCaptured(...)` to place the [ + ] button; Document re-renders, every paragraph in the document is replaced with new DOM nodes, and the browser drops the selection. Before kqsp only table/th/td were inline (so it only bit inside tables) and `p` was the stable `Fragment`.

## The ask

1. Selecting text in a document stays selected after the [ + ] button appears: Copy (Cmd/Ctrl+C, right-click Copy, iOS callout) works, and the [ + ] still opens the comment box with the quote. Check paragraphs, list items, quotes, code and tables.
2. Fix: the `components` map (both modes) and the plugin arrays are stable across renders: module-level constants, or `useMemo` keyed on `block`/`quotes`. Same for any other inline component maps in the app (`Md` is used by tickets, specs and tasks too).
3. A regression test: render a document, select text in a paragraph and a list item, trigger the selection handler (state update), and assert the selected DOM nodes are the same nodes afterwards (not remounted).
4. The human tests Copy on desktop and phone.
