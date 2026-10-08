+++
id = "ui-4u8g"
title = "One URL scheme: document the current routes and design a unified, forward-looking deep-link scheme (for the human's review)"
kind = "arch-revision"
state = "integrated"
created_at = "2026-10-06T12:13:11.780Z"
updated_at = "2026-10-08T02:11:55.035885Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/urls"
commit = "a722a7334dc91da4348fbb6cf0ad6f30d93578cf"
summary = "Design only: docs/design/url-scheme.md documents every current route (UI, gateway API, bridle link, agent rule link-ids-for-the-human) and proposes one scheme: /p/{project}/task/{id}, /ticket/{id}, /doc?path=, /spec?path=#id; machine never in URLs; old URLs redirect client-side. Three open questions for the human at the end of the doc."
ticket = "4u8g"
+++

docs/tickets/open/one-url-scheme-document-the-current-routes-and-design-a-unif-4u8g.md

## Thread

### note · external:aide · 2026-10-08T02:09:30.044Z
From the human, via aide (2026-10-07 ~10:05 PM ET), on ui-4u8g: "Yes, of course, go ahead. I don't know why that would ever wait for me. I think what I meant is: do the analysis and then give me the analysis before making any changes. Yes, do the analysis."

### note · external:orchestrator · 2026-10-08T02:09:52.402Z
orchestrator (acting PM): readied on the human's go, via aide (2026-10-07 ~10:05 PM ET): "Yes, of course, go ahead. I don't know why that would ever wait for me. I think what I meant is: do the analysis and then give me the analysis before making any changes. Yes, do the analysis." Brief = ticket 4u8g, DESIGN ONLY: (1) document every current route and deep link (UI, gateway, bridle link, agent prompts; the bridle repo's link code may need reading, read-only); (2) propose one unified scheme (one form per kind: task, ticket, document, spec, project; project and machine naming; redirects for old URLs); write both into the ticket or a design doc in bridle-ui. No code changes. Model: Sonnet. Done = the proposal committed and a short summary on this thread for the human to review; the manager tells the orchestrator, who sends it to the human via aide.

### note · agent:urls · 2026-10-08T02:11:45.701Z
done: URL scheme documented + proposed in docs/design/url-scheme.md; commit a6ad177 (doc only, no check needed)

### note · agent:urls · 2026-10-08T02:11:48.020Z
Proposal committed: docs/design/url-scheme.md. Please review the three open questions at the end.

### note · agent:manager-2 · 2026-10-08T02:11:52.199Z
integrated: a722a7334dc91da4348fbb6cf0ad6f30d93578cf (branch bridle/urls)

### note · agent:manager-2 · 2026-10-08T02:11:55.035Z
cleanup: removed agent urls, branch bridle/urls
