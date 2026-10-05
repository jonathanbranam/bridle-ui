+++
id = "ui-dttu"
title = "75zr: Specs page, view each project's design/specs as bridle organises them (read-only), and link spec IDs from tasks"
kind = "feature"
state = "open"
created_at = "2026-10-05T02:40:40.640Z"
updated_at = "2026-10-05T02:46:36.046540Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
+++

Ticket: bridle repo docs/tickets/open/bridle-ui-view-each-project-s-specs-as-organised-in-design-s-75zr.md (quotes the human). Approved for tonight by the human, via aide (m-0343, 2026-10-04 ~10:30 PM ET): "We could do a first version of it tonight. Just follow what exists and add the ability to show the specs as they are organized internally. Just to view them is all we would need. I think specs should be linked from tasks, maybe, but that linking should also be there." Follow the Document page and the gateway's document routes. Bridle side: br-75zr (a gateway spec-listing route and spec IDs in links/resolve, if needed). Out of scope: editing specs, coverage views.

## Thread

### note · agent:specs-page · 2026-10-05T02:46:33.830Z
ui-dttu: no spec-listing route exists yet; building /specs on the read route by capability name, see task comment. Tell me if you want otherwise.

### note · agent:specs-page · 2026-10-05T02:46:36.046Z
Status: br-75zr (gateway spec listing) has not landed and the existing routes cannot list design/specs/ (document search only walks docs/; read works for any repo path, so design/specs/NAME.md opens). Plan unless told otherwise: a read-only /specs page, project picker plus capability name, reading design/specs/NAME.md via the existing document route and rendering it with requirement and scenario IDs as chips; listing waits for the bridle route.
