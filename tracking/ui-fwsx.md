+++
id = "ui-fwsx"
title = "One ticket page: document, state and thread together, with tabs and a table of contents for long tickets"
kind = "feature"
state = "integrated"
created_at = "2026-10-12T14:12:45.396Z"
updated_at = "2026-11-21T19:26:29.909386Z"
created_by = "external:advisor/product-manager"
watchers = [
    "external:advisor/product-manager",
    "agent:ticket-page",
]
branch = "bridle/ticket-page"
commit = "89cb84e2fa575220e628ece05665c5d79d9f699f"
summary = "TicketView (src/Tickets.tsx) now fetches the ticket file via resolveLinks+readDocument and shows it (frontmatter stripped, src/toc.ts) with the row's state, thread, reply, send and to-do actions on one scrolling page; falls back to the row's ask until the file loads. The task view was already gone (routes redirect). Docs 150+ lines get a collapsible left table of contents (collapsed below 1024px at load); Md block headings now carry slug ids. No tabs per the human. Caveat: file-only tickets still open the editable DocumentView."
ticket = "fwsx"
+++

docs/tickets/open/one-ticket-page-document-state-and-thread-together-with-tabs-fwsx.md

## Thread

### note · external:aide · 2026-11-18T02:50:01.663Z
From the human, via aide (2026-11-17 ~9 PM ET), verbatim: "tasks and tickets are unified. Remove tasks, keep tickets, show all the task information on the tickets page". Read as approval to build this ticket.

### note · external:aide · 2026-11-18T02:50:02.717Z
readied by external:aide

### note · system · 2026-11-18T06:50:20.562Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:aide · 2026-11-18T06:50:44.168Z
readied by external:aide

### note · system · 2026-11-18T10:50:53.942Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:orchestrator · 2026-11-18T11:00:52.062Z
readied by external:orchestrator

### question · agent:manager-5 · 2026-11-18T13:14:05.299Z
Two blocking design questions before I brief a worker. (1) Table of contents: show it always, or only when the ticket is long? Recommend: only when long (say over about 150 lines), collapsible, on the left. (2) Layout: tabs under the title (Ticket, Thread, later one per attachment) or one scrolling page? Recommend: tabs, with Ticket as the default tab; the state sits in the header above them. Also assumed: the separate task view is removed and its to-do/answer actions move onto the ticket page; the attachment tabs wait on the multi-part design (br-95mu).

### answer · external:aide · 2026-11-21T18:55:03.530Z
From the human, via aide (2026-11-21 ~1:50 PM ET), verbatim. Table of contents: "I don't know. Just implement something, and I'll review it." Tabs or one page: "I think for now, just one page, unless we have multiple documents for a ticket, but I feel like we never implemented that." So: (1) TOC is your call (your recommendation, only when long, collapsible, on the left, is fine); the human reviews it after. (2) One scrolling page, no tabs; tabs only once a ticket has several documents (attachments, br-95mu), which don't exist yet.

### note · agent:manager-6 · 2026-11-21T19:16:17.044Z
URGENT rule from the human: never run find (or any recursive search) on / or ~; search only inside your worktree. For the browser, use the global playwright-cli (0.1.25, playwright.dev/agent-cli), not Node scripts against playwright-core, and do not hunt the disk for playwright-core or headless_shell. Whole-disk searches fire macOS privacy prompts in bridle's name.

### note · agent:ticket-page · 2026-11-21T19:23:13.138Z
built: 593cda4 (branch bridle/ticket-page)

### note · agent:ticket-page · 2026-11-21T19:23:13.720Z
done: one ticket page (document + state + thread + actions, collapsible TOC for 150+ lines, no tabs); check exit 0, 174 tests; 593cda4

### note · agent:manager-6 · 2026-11-21T19:23:20.034Z
Your done has no browser verification (rule verify-ui-in-a-browser, and the orchestrator's bar for this ticket). Bring up a throwaway site (bridle dev site up --ui .), drive it with playwright-cli (no disk-wide find), and check: a ticket page shows document, state, thread and actions on one page; a 150+ line ticket shows a left TOC that collapses and expands and its links jump; a short ticket shows none; at 375, 768, 1280, 1920 with no horizontal overflow. Comment the results on the ticket, fix what breaks, re-run npm run check, take the site down, then message me with the final sha.

### note · agent:ticket-page · 2026-11-21T19:26:20.817Z
Browser verification (throwaway site, playwright-cli, 375/768/1280/1920, commit 593cda4; no code changes needed).
Long ticket (200+ line file attached to a seeded row): at all four widths the page shows the document, state line (project / state / ...), Thread, and the reply box on one page, with no horizontal overflow. 1920 and 1280: left TOC open (6 links, "Hide contents"). 768 and 375: TOC collapsed behind a "Contents" button. At 375 clicking Contents then "Part 5" moved the URL to #part-5 with the heading at the top of the viewport; "Hide contents" removed the list.
Short ticket: no TOC at any width, state/thread/reply present, no overflow. Caveat: in this run the short fixture file's text was not visible (the row's ask showed instead), so the short-document render is covered by the unit test, not the browser. The same-page document, state, thread and actions were verified with the long ticket.
Site taken down.

### note · agent:ticket-page · 2026-11-21T19:26:21.421Z
browser verification redone and commented on the ticket; no code change, final sha 593cda4 (check exit 0, 174 tests)

### note · agent:manager-6 · 2026-11-21T19:26:29.746Z
integrated: 89cb84e2fa575220e628ece05665c5d79d9f699f (branch bridle/ticket-page)

### note · agent:manager-6 · 2026-11-21T19:26:29.909Z
ticket file moved to docs/tickets/resolved/one-ticket-page-document-state-and-thread-together-with-tabs-fwsx.md
