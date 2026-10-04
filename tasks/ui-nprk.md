+++
id = "ui-nprk"
title = "jrm2 part B: document view: project dropdown, ticket search by ID, comment box at the highlight, Google-Docs margin, full width"
kind = "feature"
state = "planned"
created_at = "2026-10-04T17:44:55.991Z"
updated_at = "2026-10-04T17:45:05.505159Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
+++

Part B of bridle task br-jrm2 (the human approved jrm2 and added scope through advisor doc-review on 2026-10-04: item 7, and item 4 "should look exactly like Google Docs looks"; quotes on br-jrm2's thread). Spec: bridle ticket jrm2, docs/tickets/open/document-view-project-dropdown-ticket-search-by-id-comment-b-jrm2.md in /Volumes/Data/work/bridle/bridle (read it and br-jrm2's thread: bridle --project bridle task show br-jrm2).

Scope: the UI items 1-5 of the ticket: project select, ticket search combobox (a bare ticket ID resolves, open tickets first), full-width document view, the comment box at the highlight, and on wide screens comments in a Google-Docs-style right margin, each thread level with its highlighted text. Files: Document.tsx, comments.ts and whatever else the UI needs.

Depends on part A in bridle (worker doc-view-ui on br-jrm2): the gateway route GET /projects/{p}/documents?q= and auto-review on a UI save, with ts-rs bindings. DON'T START until br-jrm2 is integrated on bridle main; the orchestrator will tell manager-1. Use A's bindings; don't change bridle.

Out of scope: br-ehv6 (comment-thread status, thread IDs, resolve), which comes after on the same files. Acceptance: the repo's checks pass. Model: Sonnet.
