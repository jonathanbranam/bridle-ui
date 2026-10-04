+++
id = "ui-c39e"
title = "x8jt: 'Request review' button in the document view, with a resend option"
kind = "feature"
state = "planned"
created_at = "2026-10-04T02:25:31.971Z"
updated_at = "2026-10-04T02:25:34.793613Z"
size = "S"
+++

Approved by the human 2026-10-04, relayed verbatim by advisor doc-review (m-4238): "Add a bridle command to perform the review on a document immediately and a button in the UI also to request the review. Comments that have been sent for review should be marked as such and not resent if the button is pressed again, unless requested." Where the sent mark lives: "A" (in the file). Thread IDs deferred ("Comment threads probably need a UID as well but we could wait on that"). Spec: ticket x8jt, last section (commit a6a0a71).

bridle-ui side. A 'Request review' button in the document view, with a resend option, calling the gateway route added by the bridle task for 'bridle review now'. Show the '· sent HH:MM' marks as they appear in the file. Start once that bridle task has landed; the orchestrator will say when.
