+++
id = "ui-nprk"
title = "jrm2 part B: document view: project dropdown, ticket search by ID, comment box at the highlight, Google-Docs margin, full width"
kind = "feature"
state = "claimed"
created_at = "2026-10-04T17:44:55.991Z"
updated_at = "2026-10-04T18:42:58.347314Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "agent:manager-1",
]
summary = """jrm2 part B. Document page: Project is a <select> from GET /projects; the path box is a "Document" input with a native <datalist> fed by GET /projects/{p}/documents?q= (synced DocumentMatches type); Open re-searches and opens the typed path, or for a bare ID the first match (gateway ranks exact ID, then open tickets) via pure resolveOpen. The page drops max-w-3xl on /document. Each block is a row: on lg+ a document column plus a right margin where threads and the new-comment box sit level with their block; below lg they stack under the block (the comment box opens right below the highlight). Commented text is highlighted (<mark>, pure markQuotes). No new dependencies; datalist chosen over a custom combobox (YAGNI). Auto-review is gateway-side, nothing changed in the UI. Caveat: highlight uses the first literal match of the quote in the block's source text, so quotes crossing markup aren't highlighted."""
+++

Part B of bridle task br-jrm2 (the human approved jrm2 and added scope through advisor doc-review on 2026-10-04: item 7, and item 4 "should look exactly like Google Docs looks"; quotes on br-jrm2's thread). Spec: bridle ticket jrm2, docs/tickets/open/document-view-project-dropdown-ticket-search-by-id-comment-b-jrm2.md in /Volumes/Data/work/bridle/bridle (read it and br-jrm2's thread: bridle --project bridle task show br-jrm2).

Scope: the UI items 1-5 of the ticket: project select, ticket search combobox (a bare ticket ID resolves, open tickets first), full-width document view, the comment box at the highlight, and on wide screens comments in a Google-Docs-style right margin, each thread level with its highlighted text. Files: Document.tsx, comments.ts and whatever else the UI needs.

Depends on part A in bridle (worker doc-view-ui on br-jrm2): the gateway route GET /projects/{p}/documents?q= and auto-review on a UI save, with ts-rs bindings. DON'T START until br-jrm2 is integrated on bridle main; the orchestrator will tell manager-1. Use A's bindings; don't change bridle.

Out of scope: br-ehv6 (comment-thread status, thread IDs, resolve), which comes after on the same files. Acceptance: the repo's checks pass. Model: Sonnet.

## Thread

### note · agent:doc-ui-b · 2026-10-04T18:42:58.347Z
done: project select, ID-resolving search (datalist), full-width doc view, comment box + threads in right margin with highlights; npm run check green (53 tests); d89b132
