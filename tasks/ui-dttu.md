+++
id = "ui-dttu"
title = "75zr: Specs page, view each project's design/specs as bridle organises them (read-only), and link spec IDs from tasks"
kind = "feature"
state = "integrated"
created_at = "2026-10-05T02:40:40.640Z"
updated_at = "2026-10-05T02:52:06.898313Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
branch = "bridle/specs-page"
commit = "bb584be6422e43c478b0768200f4b75258f11d0e"
summary = "Added a read-only Specs page (/specs?project=&capability=, nav tab Specs; src/SpecPage.tsx) that reads design/specs/<capability>.md through the existing document route and shows requirement and scenario headings with their IDs as copyable chips, body through Md. Spec design/specs/specs.md (s-6e3b executable, bound in src/specs.test.tsx). Caveats: no gateway listing route exists (br-75zr not landed; document search only walks docs/), so the human types the capability name; linking specs from tasks and spec IDs in links/resolve need the bridle side. Component is in SpecPage.tsx because Specs.tsx collides with specs.test.tsx on the case-insensitive filesystem. No CHANGELOG or docs in this repo to update."
+++

Ticket: bridle repo docs/tickets/open/bridle-ui-view-each-project-s-specs-as-organised-in-design-s-75zr.md (quotes the human). Approved for tonight by the human, via aide (m-0343, 2026-10-04 ~10:30 PM ET): "We could do a first version of it tonight. Just follow what exists and add the ability to show the specs as they are organized internally. Just to view them is all we would need. I think specs should be linked from tasks, maybe, but that linking should also be there." Follow the Document page and the gateway's document routes. Bridle side: br-75zr (a gateway spec-listing route and spec IDs in links/resolve, if needed). Out of scope: editing specs, coverage views.

## Thread

### note · agent:specs-page · 2026-10-05T02:46:33.830Z
ui-dttu: no spec-listing route exists yet; building /specs on the read route by capability name, see task comment. Tell me if you want otherwise.

### note · agent:specs-page · 2026-10-05T02:46:36.046Z
Status: br-75zr (gateway spec listing) has not landed and the existing routes cannot list design/specs/ (document search only walks docs/; read works for any repo path, so design/specs/NAME.md opens). Plan unless told otherwise: a read-only /specs page, project picker plus capability name, reading design/specs/NAME.md via the existing document route and rendering it with requirement and scenario IDs as chips; listing waits for the bridle route.

### note · external:orchestrator · 2026-10-05T02:46:53.496Z
From orchestrator: fine as an interim: ship /specs on the read route now. When br-75zr lands (gateway spec listing), switch the index to it; manager-1 can file that as a small follow-up.

### note · agent:specs-page · 2026-10-05T02:51:56.309Z
done: read-only /specs page (capability by name, IDs as chips) + design/specs/specs.md; no listing route or task links yet (need br-75zr); check green (93 tests); d23836a

### note · agent:manager-1 · 2026-10-05T02:52:03.039Z
integrated: bb584be6422e43c478b0768200f4b75258f11d0e (branch bridle/specs-page)

### note · agent:manager-1 · 2026-10-05T02:52:06.898Z
cleanup: removed agent specs-page, branch bridle/specs-page
