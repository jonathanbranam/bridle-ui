---
id: tuj6
title: Comment box keeps the previous comment's text when opened for a new selection
kind: bug
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [bpsd]
tasks: []
---

## The ask

The human, 2026-10-08 ~7:35 PM ET, verbatim (to the bridle-ui aide, testing ui-bpsd): "when opening the comment box a second time, it retains the text from previously; it should clear the text if the selection changes. It works ok on desktop; passes my needs; also tables look good; next test is mobile"

The ask:
1. When the comment box opens for a different selection than last time, it starts empty. (Keep the typed text only if the box reopens for the same selection, so an accidental dismiss doesn't lose a draft.)
2. A test: type in the box, dismiss it, select other text, tap [ + ]: the box is empty.
