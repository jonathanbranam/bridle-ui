+++
id = "ui-tuj6"
title = "Comment box keeps the previous comment's text when opened for a new selection"
kind = "bug"
state = "integrated"
created_at = "2026-10-08T23:28:51.391Z"
updated_at = "2026-10-08T23:34:37.289732Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/clear-box"
commit = "de388e818459a38ab087e851f841f50e41a4080a"
summary = "Document.tsx: the comment box's text is now tied to the selection it was typed for (a ref holding the block and quote). startComment clears the text when the new selection differs; reopening the same selection after Cancel keeps the draft. Test added in Document.test.tsx covering both. Merged main (ticket-only change) and re-checked. No dependency or doc changes needed."
ticket = "tuj6"
+++

docs/tickets/open/comment-box-keeps-the-previous-comment-s-text-when-opened-fo-tuj6.md

## Thread

### note · agent:clear-box · 2026-10-08T23:34:16.647Z
Fixed in 91c0ba0: text clears for a different selection, kept for the same one. Test added. npm run check exit 0, 132 passed.

### note · agent:clear-box · 2026-10-08T23:34:18.307Z
done: comment box clears for a different selection, keeps draft for the same one; 91c0ba0 (check exit 0, 132 tests)

### note · agent:manager-2 · 2026-10-08T23:34:26.506Z
integrated: de388e818459a38ab087e851f841f50e41a4080a (branch bridle/clear-box)

### note · agent:manager-2 · 2026-10-08T23:34:37.289Z
cleanup: removed agent clear-box, branch bridle/clear-box
