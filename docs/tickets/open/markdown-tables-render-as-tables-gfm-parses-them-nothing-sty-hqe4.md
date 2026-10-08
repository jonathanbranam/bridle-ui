---
id: hqe4
title: "Markdown tables render as tables: the Document page joins table rows into one line; nothing styles tables"
kind: bug
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: []
tasks: [ui-hqe4]
---

## The ask

The human, 2026-10-08 ~7:30 PM ET, verbatim (to the bridle-ui aide): "Updates for the UI: do we have markdown rendering with table support? Why not? I asked for that at least a week ago. Tables don't seem to be rendered properly in http://dalek.tailbc91f5.ts.net:7878/p/bridle/docs?path=docs%2Fcontext%2Fname-ideas.md"

Cause (aide, from the code): `src/Md.tsx` already uses `remark-gfm`, so tables parse into `<table>`, but nothing styles them. Tailwind's preflight strips table borders and cell padding, so cells run together and the table looks unrendered.

The ask:
1. Markdown tables render as tables everywhere `<Md>` is used (documents, tickets, tasks, specs): borders, cell padding, a distinct header row, left-aligned text, and the column alignment GFM gives (`:---:`, `---:`).
2. Wide tables scroll sideways inside their own box on a phone instead of widening the page (layout rule from k9a8).
3. A test with a GFM table, and check `docs/context/name-ideas.md` in the bridle project renders right.
4. While there, check the other GFM pieces render visibly too (task lists, strikethrough), since the same preflight issue may hide them.

The human, ~7:45 PM ET, verbatim: "In documents, I just see plain markdown, no tables: http://dalek.tailbc91f5.ts.net:7878/p/bridle/docs?path=docs%2Fcontext%2Fname-ideas.md"

Correction (aide, from the code): on the Document page the main cause is not styling. `src/doc/comments.ts` splits the document into its own blocks (heading, item, code, para, frontmatter) for comment placement, and a "para" joins its lines with a space (`.join(" ")`). A table's rows become one line, `| a | b | |---|---| ...`, which no markdown parser reads as a table, so it shows as raw pipes. Lines starting with `>` lose the marker the same way, and list items are re-drawn as `• text`, so nesting and numbering are lost.

So the Document page needs:
5. The block splitter keeps a table (a run of `|` lines) as one block of its own, lines joined with newlines, rendered by `<Md>`, and comments still anchor to it (`data-last`).
6. Paragraph lines are joined with newlines, not spaces, so markdown spanning lines renders as markdown (blockquotes, hard breaks).
7. Check other kinds the splitter flattens (blockquotes, nested and numbered lists) and keep them as real markdown where it's cheap; list what's left.
8. A test: a document with a table renders a `<table>` on the Document page.
