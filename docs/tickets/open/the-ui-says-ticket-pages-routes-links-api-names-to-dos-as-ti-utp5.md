---
id: ui-utp5
title: "The UI says ticket: pages, routes, links, API names, to-dos as tickets (bridle 22ab step 8)"
kind: feature
created: 2026-10-11
created_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [ui-tecf]
---

## The ask

The human, 2026-10-11 ~9:25 AM ET, verbatim (relayed by advisor product-manager, m-1281):

> do we have tickets for updating the bridle-ui to account for the task -> ticket change? I don't remember seeing that. Feels like a miss on our part when planning. Various linking implementations and parts of the UI have to change.

and

> human todos ... also they're in the UI

This is step 8 of bridle's "everything is a ticket" plan (bridle ticket 22ab, section "Gaps found
2026-10-11"). That plan is approved, so this ticket has no separate human gate (the PdM).

## Scope

The UI says **ticket** where it says task today, and follows bridle's renames:

1. **Pages, labels, routes and links.** The Tasks page, the Project page, page titles, the
   `/task?id=` route and its redirects, and every link the UI builds or recognises
   (`src/Tasks.tsx`, `src/Project.tsx`, `src/pageTitle.ts`, `src/App.tsx`, `src/Redirects.tsx`,
   `src/doc/links.ts`, `src/Md.tsx`, `src/Items.tsx`, `src/System.tsx`, `src/api/client.ts` and
   their tests: about 16 files). Old `/task?id=` links keep working (redirect).
2. **IDs are project-qualified** (22ab section 8): the written ID is always `ui-xxxx`/`br-xxxx`,
   in links, threads and the UI. A bare `xxxx` is input shorthand only.
3. **API calls and generated types** move to the ticket names: bridle br-92za (wire) and br-aejj
   (gateway). Re-sync `src/api/generated/` with the sync script. The old names work for one
   release only, so this must land before 22ab's step 10 drops them.
4. **The ask and the thread** are read from the ticket (the ticket file and its thread), not
   from the task row's body.
5. **Link resolution**: ticket and task IDs resolve to the one ticket page.
6. **The human's to-dos are tickets** (bridle br-cy4q, 22ab step 7b, after br-res3): the to-do
   views (Items) show and act on them as tickets.
7. Any URL format change updates the "Final formats" table in bridle's url-scheme design and
   files the task for the agent instructions and `bridle link` (CLAUDE.md, "Link formats").

## Order

After bridle's br-cy4q lands (and br-92za and br-aejj, whose names it consumes). Before 22ab
step 10.

## Related

- tecf (open by ticket or task ID from any project): do it in this change or right after.
- bridle tickets 22ab (the plan), cy4q (to-dos as tickets), enx3 (URL scheme). Named here
  because related: takes only this repo's tickets.

## Plan (orchestrator, 2026-10-11)

Build items 1-5 and 7 now; the names they need have landed in bridle (br-92za wire, br-aejj gateway;
old names still accepted for one release). Item 6 (to-do views) is split out to ui-jgg8, which starts
after bridle br-cy4q lands (the PdM's call, on this thread).

- Files: those listed in item 1 and their tests, plus `src/api/generated/` (re-sync with the sync
  script against the current bridle gateway). Not `src/Items.tsx`'s to-do actions (ui-jgg8).
- Acceptance: `npm run check` passes; the UI says ticket, not task, on every page and title; the API
  client calls the ticket routes; an old `/task?id=<id>` link redirects to the ticket page; written
  IDs are project-qualified (`ui-xxxx`, `br-xxxx`); ticket and task IDs open the same ticket page.
- If a URL format changes (item 7): update bridle's url-scheme "Final formats" table in the same
  change set and file the bridle ticket for agent instructions and `bridle link`.
- Model: Sonnet. If context nears 150K, land pages/routes/links first and say what remains.
- Out of scope: the to-do views (ui-jgg8); tecf (open by ID from any project), unless it falls out
  naturally; removing old-name support (bridle 22ab step 10).
