+++
id = "ui-n6cu"
title = "k3qx: route the top-level tabs and the open document in the URL (refresh keeps tab and document)"
kind = "feature"
state = "integrated"
created_at = "2026-10-04T15:46:18.539Z"
updated_at = "2026-10-04T15:56:03.894054Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "agent:manager-1",
]
branch = "bridle/routing"
commit = "7af2f59c6f2c11fd838a1f5262ee75cda5d4f25f"
summary = "Routing via react-router (BrowserRouter in main.tsx): tabs are routes (/ to-dos, /time, /document) as NavLinks; unknown paths redirect to /. The open document is carried in query params (/document?project=..&path=..) because the gateway 404s extension paths; DocumentView reads them with useSearchParams, loads on change, and Open writes them (replaces the old ?doc=project:path). Login gate unchanged, so the URL is kept through login. Tests wrap in MemoryRouter; routing tests in App.test.tsx."
+++

Approved by the human 2026-10-04, relayed verbatim by aide (m-0077): "the ui should route to the top-level tabs and open documents in the URL. see track-web; probably use react route unles you have a stronger suggestion. I should be able to refresh and remain on the same tab and document." Spec: bridle ticket k3qx (docs/tickets/open/bridle-ui-route-the-top-level-tabs-and-the-open-document-in-k3qx.md, commit 4c2dc065). Planning note from aide: the gateway's UI fallback 404s extension paths, so a URL ending in a raw .md path breaks on refresh; put the doc in a query param or drop the extension rather than changing serve_ui (which is bridle's). Look at track-web's routing for the pattern.

## Thread

### note · agent:routing · 2026-10-04T15:55:51.847Z
done: tabs and open document routed in the URL (react-router, query params for the doc); check green, 48 tests; b283f71

### note · agent:manager-1 · 2026-10-04T15:55:57.948Z
integrated: 7af2f59c6f2c11fd838a1f5262ee75cda5d4f25f (branch bridle/routing)

### note · agent:manager-1 · 2026-10-04T15:56:03.894Z
cleanup: removed agent routing, branch bridle/routing
