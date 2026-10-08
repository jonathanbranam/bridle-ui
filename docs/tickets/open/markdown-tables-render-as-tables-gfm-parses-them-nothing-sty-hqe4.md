---
id: hqe4
title: Markdown tables render as tables (GFM parses them; nothing styles them)
kind: bug
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: []
tasks: []
---

## The ask

The human, 2026-10-08 ~7:30 PM ET, verbatim (to the bridle-ui aide): "Updates for the UI: do we have markdown rendering with table support? Why not? I asked for that at least a week ago. Tables don't seem to be rendered properly in http://dalek.tailbc91f5.ts.net:7878/p/bridle/docs?path=docs%2Fcontext%2Fname-ideas.md"

Cause (aide, from the code): `src/Md.tsx` already uses `remark-gfm`, so tables parse into `<table>`, but nothing styles them. Tailwind's preflight strips table borders and cell padding, so cells run together and the table looks unrendered.

The ask:
1. Markdown tables render as tables everywhere `<Md>` is used (documents, tickets, tasks, specs): borders, cell padding, a distinct header row, left-aligned text, and the column alignment GFM gives (`:---:`, `---:`).
2. Wide tables scroll sideways inside their own box on a phone instead of widening the page (layout rule from k9a8).
3. A test with a GFM table, and check `docs/context/name-ideas.md` in the bridle project renders right.
4. While there, check the other GFM pieces render visibly too (task lists, strikethrough), since the same preflight issue may hide them.
