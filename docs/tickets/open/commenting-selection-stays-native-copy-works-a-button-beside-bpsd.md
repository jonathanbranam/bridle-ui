---
id: bpsd
title: "Commenting: selection stays native (copy works); a [ + ] button beside it opens the comment box"
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

The human, 2026-10-08 ~7:30 PM ET, verbatim (to the bridle-ui aide): "There are some issues with the commenting. I think I thought of a fix. There are two issues:

1. Browser - works well, but I can no longer copy and paste!
2. Mobile - interaaction is still off, the popup tends to dismiss the selection

So, here's a proposal - please consider this and give your feedback:

Instead of immediately opening the comment box, instead, allow the select to happen normally per the system rules, but open a [ + ] button to the side. Don't dismiss the selection or highlight the text in yellow; I'll test it, but the button appearing shouldn't cancel the selection. Then I need to still be able to copy. Then, if I want to comment, I click/tap the plus and the comment is added with the highlighted text.

If that doesn't test well, then we'll add a toolbar button for "Add comment" that doesn't modify the DOM and is always there then it doesn't interrupt the copy/paste or reflow the document while selecting."

Today (aide, from `src/Document.tsx`): a `selectionchange` listener (300 ms debounce) calls `select()`, which sets `pending`, and that opens the comment box with its textarea right away. Opening the box changes the page (reflow, focus moves to the box), which is what loses the selection: copy breaks on desktop, and on a phone the box dismisses the native selection.

The ask (the human's proposal, with the aide's implementation notes):
1. Selecting text changes nothing in the document: no yellow highlight, no box, no focus change, no reflow. Native selection, handles and the system's Copy menu work as usual.
2. While there's a non-empty selection inside the document, show a small `[ + ]` button beside it, in the margin at the selection's line, as an overlay (absolute/fixed, outside the text flow) so nothing reflows. On a phone, keep it clear of the system's Copy/Look up callout, which iOS puts above the selection: the right margin or below the selection.
3. Capture the quote and its block (`data-last`) when the selection settles, so tapping `[ + ]` works even if the tap itself clears the selection (iOS does this). The button shouldn't take focus on pointer-down.
4. Tapping `[ + ]` opens the comment box with the captured quote; only then does the passage get its highlight.
5. The button goes away when the selection is cleared.
6. Fallback, only if the human's test of the above goes badly: an always-present "Add comment" toolbar button that uses the current selection, with no DOM change during selection. Item 3's capture makes this a small change.
7. The human tests on a laptop browser and on their phone before it's called done.
