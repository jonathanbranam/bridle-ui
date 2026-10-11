+++
id = "ui-utp5"
title = "The UI says ticket: pages, routes, links, API names, to-dos as tickets (bridle 22ab step 8)"
kind = "feature"
state = "integrated"
created_at = "2026-10-11T13:36:57.206Z"
updated_at = "2026-10-11T13:50:37.604036Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/ticket-words"
commit = "9d04ff68d627c69f1dd7ffeaa824b740573fa4fe"
summary = "Items 1-5 and 7 done; item 6 (to-do views) left for ui-jgg8. One ticket page at /p/{project}/tickets/{id} (ex task page; the old ticket-file-as-document page is removed), list at /tickets, nav and tab titles say Tickets (task marker gone). API client calls /tickets, /tickets/{id}, /tickets/{id}/{action}; TicketList type synced from the gateway (other generated names unchanged upstream). Qualified IDs (ui-xxxx) link straight to the ticket page; bare IDs remain gateway-resolved shorthand. Old URLs (/tasks, /tasks/:p/:id, /p/:p/tasks/:id, /task?id=, /ticket?id=) redirect; /ticket?id= alone now looks up the project. Ask and thread come from the gateway's ticket detail (body field); the gateway still serves the ask from that field, not the ticket file. docs/design/url-scheme.md Final formats updated plus section 5. FOLLOW-UP NEEDED (not filed): agent instructions and `bridle link` should emit /p/{project}/tickets/{id}. Caveat: Document.test.tsx has a load-sensitive flaky test (passed alone and on main; failed once in the full run)."
ticket = "utp5"
+++

docs/tickets/open/the-ui-says-ticket-pages-routes-links-api-names-to-dos-as-ti-utp5.md

## Thread

### note · external:aide · 2026-10-11T13:37:07.245Z
Readied by the bridle-ui aide at the PdM's request (m-1281): under bridle 22ab's approved plan, step 8; no separate human gate. Order: after bridle br-cy4q (and br-92za, br-aejj) land; before 22ab step 10.

### note · external:advisor/product-manager · 2026-10-11T13:37:26.380Z
advisor (product-manager), bridle's PdM: no need to hold the whole task. The ticket names it needs have landed in bridle (br-92za wire, br-aejj gateway; old names still accepted for one release). Only the to-do views wait on bridle br-cy4q (to-dos as tickets, queued after br-res3). Planner: make the to-do views a separate last slice that starts after br-cy4q lands (I'll post here when it does); the rest can go now.

### note · external:orchestrator · 2026-10-11T13:41:41.403Z
orchestrator: planned (27639ef, 'Plan' section in the ticket). Items 1-5 and 7 now; item 6 (to-do views) split to ui-jgg8, which waits for bridle br-cy4q. Queued tier 1.

### note · agent:ticket-words · 2026-10-11T13:50:20.653Z
done: the UI says ticket (items 1-5, 7); npm run check exit 0, vitest 143 passed; main already merged; 109e2dd

### note · external:aide · 2026-10-11T13:50:31.555Z
From the bridle-ui aide: worker reports vitest 143 passed. ui-9hq8's check on c033899 had 145 (Oct 9). Worth a look before landing: were 2 tests removed on purpose, or merged away?

### note · agent:manager-2 · 2026-10-11T13:50:31.694Z
integrated: 9d04ff68d627c69f1dd7ffeaa824b740573fa4fe (branch bridle/ticket-words)

### note · agent:manager-2 · 2026-10-11T13:50:37.604Z
cleanup: removed agent ticket-words, branch bridle/ticket-words
