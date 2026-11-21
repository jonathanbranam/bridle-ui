+++
id = "ui-gb7q"
title = "To-do deep links: route /p/<project>/todos/<id> and redirect a task page that loads a to-do (UI half of br-bnfs)"
kind = "fix"
state = "integrated"
created_at = "2026-10-18T13:34:06.141Z"
updated_at = "2026-11-21T19:43:28.650287Z"
created_by = "external:advisor/product-manager"
watchers = [
    "external:advisor/product-manager",
    "agent:todo-links",
]
branch = "bridle/todo-links"
commit = "02cac9d0ec69f70f76a08f63fb63fd51a9da90d7"
summary = "Added route /p/<project>/todos/<id> (ItemsView; the matching to-do, by task id or ticket id, gets data-wanted-todo, a ring and scrollIntoView after load). TicketView redirects to it when the loaded detail has todo: true (covers typed-in IDs and the jump box). todoHref in src/doc/links.ts; synced generated types (TaskDetail/TaskSummary gained todo; the sync also added unrelated new Account*/Session* types). url-scheme.md Final formats and redirects updated. bridle link already prints this form, so no bridle-repo task needed. Verified in a browser at 375 and 1280 wide (redirect from /tickets/ad-n3pc and from the typed ID on /tickets; highlighted item in view). Side finding NOT fixed: file-only ticket URL shows 'No ticket X' in the fixture; the fixture's ticket files have ids (ad-1a2b) not matching their file-name suffix (ad1a), so the gateway link resolve finds nothing; likely a fixture issue, not investigated further. Note: the to-do title link on the to-do list still points at the ticket URL, which now bounces back to the to-do page."
ticket = "gb7q"
+++

docs/tickets/open/todo-deep-links-gb7q.md

submitted by external:advisor/product-manager

UI half of bridle ticket br-bnfs (low priority, the human). The human, 2026-10-09 ~10:40 PM ET, verbatim: "the deep link in bridle ui for human-claimed tickets fails to open because it opens as a task and not a todo; the UI or backend should discover this is a human todo and open the proper page; this should also happen if the user types a todo id into the task page, instead of saying 'not found' it should open the todo page and scroll the todo into view."

Bridle side (built by wbnfs, 665b8a8b; lands with br-bnfs): `bridle link` prints /p/<project>/todos/<id> for a human to-do, and the gateway's task summary and detail carry `todo: bool`.

The ask for the UI: (1) add the route /p/<project>/todos/<id>: the to-do page with that to-do scrolled into view; (2) when the task page loads a task with todo: true (including an id typed in), redirect to that route instead of 'not found'. Wait for br-bnfs on bridle main before landing. Priority low. From advisor (product-manager).

## Thread

### note · external:advisor/product-manager · 2026-10-18T13:34:06.427Z
submitted by external:advisor/product-manager

### note · external:orchestrator · 2026-11-21T19:30:57.858Z
readied by external:orchestrator

### note · agent:todo-links · 2026-11-21T19:43:12.106Z
Added route /p/<project>/todos/<id> (ItemsView; the matching to-do, by task id or ticket id, gets data-wanted-todo, a ring and scrollIntoView after load). TicketView redirects to it when the loaded detail has todo: true (covers typed-in IDs and the jump box). todoHref in src/doc/links.ts; synced generated types (TaskDetail/TaskSummary gained todo; the sync also added unrelated new Account*/Session* types). url-scheme.md Final formats and redirects updated. bridle link already prints this form, so no bridle-repo task needed. Verified in a browser at 375 and 1280 wide (redirect from /tickets/ad-n3pc and from the typed ID on /tickets; highlighted item in view). Side finding NOT fixed: file-only ticket URL shows 'No ticket X' in the fixture; the fixture's ticket files have ids (ad-1a2b) not matching their file-name suffix (ad1a), so the gateway link resolve finds nothing; likely a fixture issue, not investigated further. Note: the to-do title link on the to-do list still points at the ticket URL, which now bounces back to the to-do page.

### note · agent:todo-links · 2026-11-21T19:43:12.138Z
built: 0eee8ce (branch bridle/todo-links)

### note · agent:todo-links · 2026-11-21T19:43:12.985Z
done: to-do route + redirect, checked at 375/1280 in browser; check exit 0, 175 tests; 0eee8ce

### note · agent:manager-6 · 2026-11-21T19:43:22.368Z
integrated: 02cac9d0ec69f70f76a08f63fb63fd51a9da90d7 (branch bridle/todo-links)

### note · agent:manager-6 · 2026-11-21T19:43:22.614Z
ticket file moved to docs/tickets/resolved/todo-deep-links-gb7q.md

### note · agent:manager-6 · 2026-11-21T19:43:28.650Z
cleanup: removed agent todo-links, origin branch bridle/todo-links, branch bridle/todo-links
