+++
id = "ui-7sag"
title = "75zr follow-up: /specs index from the gateway listing route; spec IDs link everywhere (tasks, markdown)"
kind = "feature"
state = "integrated"
created_at = "2026-10-05T13:36:33.868Z"
updated_at = "2026-10-05T14:26:21.607710Z"
created_by = "agent:manager-1"
watchers = ["agent:manager-1"]
size = "M"
branch = "bridle/specs-index"
commit = "a68a364a462b524c78c549737696c79d6a2a391f"
summary = "Specs page now lists a project's specs from GET /projects/{p}/specs (synced Spec* types); a file opens at /specs?project=&path= (capability= still works), headings carry ids so #r-xxxx scrolls. Spec IDs (r-/s-xxxx) are recognised in src/doc/links.ts, resolved via links/resolve and linked to the Specs page in Md, plain text if unresolved. Updated design/specs/specs.md (new requirement r-7c2a, non-executable scenario s-3f9d bound to unit tests). Note: sync-types also pulled unrelated new types (MessageRequest etc.)."
+++

Approval: orchestrator m-0409 (the human's overnight ask, via aide m-0343): switch the Specs page to the gateway's specs listing route (bridle br-75zr, crates/bridle-gateway; read its source and bindings, sync types with the repo script) so the page lists each project's specs instead of asking for a capability name; and link spec IDs (requirement r-xxxx, scenario s-xxxx) to the Specs page wherever markdown renders (task bodies and threads, documents), resolving them via links/resolve, which now handles spec ids. Keep the id syntax in src/doc/links.ts. Update design/specs/specs.md. Acceptance: npm run check green; tests for the index list, an id link resolved and unresolved. Model: sonnet. Touches src/SpecPage.tsx, src/Md.tsx, src/doc/links.ts, src/api/*.

## Thread

### note · agent:specs-index · 2026-10-05T13:38:44.650Z
Blocker: the gateway's spec listing types (ProjectSpecs, SpecFile, SpecRequirement, SpecScenario, SpecDiagnostic in bridle crates/bridle-gateway/src/specs.rs) derive TS but are not exported by export_all in src/types.rs, so bindings/ has no Spec*.ts and sync-types cannot copy them. CLAUDE.md forbids hand-written API types. Need the bridle side to export them and run just gateway-types, or approval to hand-copy temporarily.

### note · agent:manager-1 · 2026-10-05T14:25:07.764Z
br-jxm5 landed on bridle main: Spec* types are exported. Run 'just gateway-types' in the bridle repo, sync them with the repo script, and continue.

### note · agent:specs-index · 2026-10-05T14:26:15.058Z
done: Specs index + spec ID links; npm run check exit 0, 105 tests; 94bf98e

### note · agent:manager-1 · 2026-10-05T14:26:19.103Z
integrated: a68a364a462b524c78c549737696c79d6a2a391f (branch bridle/specs-index)

### note · agent:manager-1 · 2026-10-05T14:26:21.607Z
cleanup: removed agent specs-index, branch bridle/specs-index
