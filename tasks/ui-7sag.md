+++
id = "ui-7sag"
title = "75zr follow-up: /specs index from the gateway listing route; spec IDs link everywhere (tasks, markdown)"
kind = "feature"
state = "open"
created_at = "2026-10-05T13:36:33.868Z"
updated_at = "2026-10-05T13:36:35.276556Z"
created_by = "agent:manager-1"
watchers = ["agent:manager-1"]
size = "M"
+++

Approval: orchestrator m-0409 (the human's overnight ask, via aide m-0343): switch the Specs page to the gateway's specs listing route (bridle br-75zr, crates/bridle-gateway; read its source and bindings, sync types with the repo script) so the page lists each project's specs instead of asking for a capability name; and link spec IDs (requirement r-xxxx, scenario s-xxxx) to the Specs page wherever markdown renders (task bodies and threads, documents), resolving them via links/resolve, which now handles spec ids. Keep the id syntax in src/doc/links.ts. Update design/specs/specs.md. Acceptance: npm run check green; tests for the index list, an id link resolved and unresolved. Model: sonnet. Touches src/SpecPage.tsx, src/Md.tsx, src/doc/links.ts, src/api/*.
