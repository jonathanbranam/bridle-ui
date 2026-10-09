---
id: kqsp
title: "Document page: blockquotes and lists render as markdown (no indent, no numbers today)"
kind: bug
opened: 2026-10-09
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [hqe4, 5zrr]
tasks: [ui-kqsp]
---

## The ask

The human, 2026-10-09 ~8:20 AM ET, verbatim (to the bridle-ui aide): "in the docs/notes/product-manager-trial.md on the ui, the markdown rendering does not look correct for the human quote. it isn't indented as i would expect and the ordered list isn't rendered. is the markdown rendering still broken in some way? you mentioned before the tables were broken due to something with joining lines, are we doing some manipulation of the text before passing it to the renderer? please investigate and file a ticket to fix:"

They pasted the source (bridle repo, `docs/notes/product-manager-trial.md`, the quote under "Why this file exists", lines ~10-45): a blockquote holding paragraphs and a numbered list `> 1. a system scheduler` ... `> 9. a design role that writes designs`, with item 8 wrapped onto an indented continuation line. Their screenshot (`/Volumes/Data/screenshots/Screenshot 2026-10-09 at 8.17.47 AM.png`) shows the quote with no indent or quote bar, the paragraphs run together, and the list items as bare lines with no numbers.

## What the aide found (yes, we manipulate the text before rendering)

The Document page doesn't hand the file to the markdown renderer. `parseDocument` in `src/doc/comments.ts` first cuts it into its own blocks (heading, item, code, para, table, frontmatter) so comments can anchor to lines, and each block is rendered on its own by `Md` (`src/Md.tsx`). Four causes, the first two behind this report:

1. **Nothing styles blockquotes or lists.** Tailwind's preflight resets `blockquote` margins and `ol`/`ul` list-style and padding. `Md`'s `components` style only tables (ui-hqe4), so a blockquote renders flush with no bar, and an `<ol>` renders as bare lines with no numbers.
2. **`p: Fragment` in `Md`** drops paragraph breaks inside a block, so a blockquote's paragraphs (and the paragraph before the list) run together.
3. **Top-level list items are redrawn by the splitter** as "• text": the `1.` is replaced by a bullet, wrapped lines are joined with spaces, and nested items are flattened into their parent. ui-hqe4 left this on purpose (its summary: "list items are still redrawn as a bullet plus text, so nesting and numbering are lost").
4. **Highlights split the source text** before rendering (ui-5zrr, filed separately).

## The ask

1. The Document page renders markdown as markdown: blockquotes indented with a quote bar, numbered lists numbered, bullet lists bulleted, nesting kept, paragraphs separated, inside and outside blockquotes. Check the human's case above, plus nested lists, a list inside a blockquote, a code block inside a list item, and a wrapped list item.
2. Prefer one parse over more special cases. Suggested: parse the whole document once (remark, already a dependency via react-markdown) and use each mdast node's `position` (source line numbers) to attach comment threads and the `data-last` anchors, instead of the hand-written line splitter. This also gives ui-5zrr a clean fix (highlight in the rendered tree). The worker may choose another way if it's simpler, but no more line-joining rules.
3. Style the block elements once, where `Md` is configured (or a small `.prose`-like CSS block), so tickets, specs and tasks (which also use `Md`) get the same rendering.
4. Comments keep working: adding a comment on a line inside a list or blockquote, and threads showing under the right block.
5. Tests: the human's blockquote-with-numbered-list case, nested lists, and comment anchoring on list and quote lines.
6. The human checks `docs/notes/product-manager-trial.md` in bridle on desktop and phone.
