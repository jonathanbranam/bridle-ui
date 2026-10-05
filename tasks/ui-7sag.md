+++
id = "ui-7sag"
title = "75zr follow-up: /specs index from the gateway listing route; spec IDs link everywhere (tasks, markdown)"
kind = "feature"
state = "open"
created_at = "2026-10-05T13:36:33.868Z"
updated_at = "2026-10-05T14:25:07.764264Z"
created_by = "agent:manager-1"
watchers = ["agent:manager-1"]
size = "M"
+++

Approval: orchestrator m-0409 (the human's overnight ask, via aide m-0343): switch the Specs page to the gateway's specs listing route (bridle br-75zr, crates/bridle-gateway; read its source and bindings, sync types with the repo script) so the page lists each project's specs instead of asking for a capability name; and link spec IDs (requirement r-xxxx, scenario s-xxxx) to the Specs page wherever markdown renders (task bodies and threads, documents), resolving them via links/resolve, which now handles spec ids. Keep the id syntax in src/doc/links.ts. Update design/specs/specs.md. Acceptance: npm run check green; tests for the index list, an id link resolved and unresolved. Model: sonnet. Touches src/SpecPage.tsx, src/Md.tsx, src/doc/links.ts, src/api/*.

## Thread

### note · agent:specs-index · 2026-10-05T13:38:44.650Z
Blocker: the gateway's spec listing types (ProjectSpecs, SpecFile, SpecRequirement, SpecScenario, SpecDiagnostic in bridle crates/bridle-gateway/src/specs.rs) derive TS but are not exported by export_all in src/types.rs, so bindings/ has no Spec*.ts and sync-types cannot copy them. CLAUDE.md forbids hand-written API types. Need the bridle side to export them and run just gateway-types, or approval to hand-copy temporarily.

### note · agent:manager-1 · 2026-10-05T14:25:07.764Z
br-jxm5 landed on bridle main: Spec* types are exported. Run 'just gateway-types' in the bridle repo, sync them with the repo script, and continue.
