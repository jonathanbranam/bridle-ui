+++
id = "ui-n6cu"
title = "k3qx: route the top-level tabs and the open document in the URL (refresh keeps tab and document)"
kind = "feature"
state = "planned"
created_at = "2026-10-04T15:46:18.539Z"
updated_at = "2026-10-04T15:46:27.389922Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
+++

Approved by the human 2026-10-04, relayed verbatim by aide (m-0077): "the ui should route to the top-level tabs and open documents in the URL. see track-web; probably use react route unles you have a stronger suggestion. I should be able to refresh and remain on the same tab and document." Spec: bridle ticket k3qx (docs/tickets/open/bridle-ui-route-the-top-level-tabs-and-the-open-document-in-k3qx.md, commit 4c2dc065). Planning note from aide: the gateway's UI fallback 404s extension paths, so a URL ending in a raw .md path breaks on refresh; put the doc in a query param or drop the extension rather than changing serve_ui (which is bridle's). Look at track-web's routing for the pattern.
