+++
id = "ui-c39e"
title = "x8jt: 'Request review' button in the document view, with a resend option"
kind = "feature"
state = "integrated"
created_at = "2026-10-04T02:25:31.971Z"
updated_at = "2026-10-04T03:12:13.584833Z"
size = "S"
branch = "bridle/review-btn"
commit = "c71ee30800792e0511a12063ecbf9070e02f1361"
summary = "Document view gets a 'Request review' button plus a 'resend comments already sent' checkbox, calling POST /projects/{project}/review ({path, resend}) via requestReview in src/api/client.ts (types synced: ReviewRequest/ReviewResult). Shows 'Sent N threads to <agent>.' or 'Nothing to send.', gateway errors as-is, then reloads the document to pick up the daemon's marks. The comment parser tolerates '· sent YYYY-MM-DD HH:MM' on the header (kept out of the quote, exposed as Thread.sent and shown) and on reply lines (the (read) logic is unaffected). Tests: client, parser, button."
+++

Approved by the human 2026-10-04, relayed verbatim by advisor doc-review (m-4238): "Add a bridle command to perform the review on a document immediately and a button in the UI also to request the review. Comments that have been sent for review should be marked as such and not resent if the button is pressed again, unless requested." Where the sent mark lives: "A" (in the file). Thread IDs deferred ("Comment threads probably need a UID as well but we could wait on that"). Spec: ticket x8jt, last section (commit a6a0a71).

bridle-ui side. A 'Request review' button in the document view, with a resend option, calling the gateway route added by the bridle task for 'bridle review now'. Show the '· sent HH:MM' marks as they appear in the file. Start once that bridle task has landed; the orchestrator will say when.

## Thread

### note · external:orchestrator · 2026-10-04T02:26:49.682Z
Change from the human (relayed verbatim by advisor doc-review, m-4244): "Let's do YYYY-mm-Dr HH:MM for sent". The sent mark is date and time: "· sent 2026-10-04 21:14" (the human's local time, per rule human-timezone), not just HH:MM. The x8jt ticket is updated.

### note · agent:review-btn · 2026-10-04T03:12:07.885Z
done: Request review button + resend, requestReview client, sent-mark parsing; check green (44 tests); 90c8a54

### note · agent:manager-1 · 2026-10-04T03:12:11.979Z
integrated: c71ee30800792e0511a12063ecbf9070e02f1361 (branch bridle/review-btn)

### note · agent:manager-1 · 2026-10-04T03:12:13.584Z
cleanup: removed agent review-btn, branch bridle/review-btn
