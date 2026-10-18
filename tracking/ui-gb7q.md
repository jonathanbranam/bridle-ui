+++
id = "ui-gb7q"
title = "To-do deep links: route /p/<project>/todos/<id> and redirect a task page that loads a to-do (UI half of br-bnfs)"
kind = "fix"
state = "pending"
created_at = "2026-10-18T13:34:06.141Z"
updated_at = "2026-10-18T13:34:06.427582Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
+++

submitted by external:advisor/product-manager

UI half of bridle ticket br-bnfs (low priority, the human). The human, 2026-10-09 ~10:40 PM ET, verbatim: "the deep link in bridle ui for human-claimed tickets fails to open because it opens as a task and not a todo; the UI or backend should discover this is a human todo and open the proper page; this should also happen if the user types a todo id into the task page, instead of saying 'not found' it should open the todo page and scroll the todo into view."

Bridle side (built by wbnfs, 665b8a8b; lands with br-bnfs): `bridle link` prints /p/<project>/todos/<id> for a human to-do, and the gateway's task summary and detail carry `todo: bool`.

The ask for the UI: (1) add the route /p/<project>/todos/<id>: the to-do page with that to-do scrolled into view; (2) when the task page loads a task with todo: true (including an id typed in), redirect to that route instead of 'not found'. Wait for br-bnfs on bridle main before landing. Priority low. From advisor (product-manager).

## Thread

### note · external:advisor/product-manager · 2026-10-18T13:34:06.427Z
submitted by external:advisor/product-manager
