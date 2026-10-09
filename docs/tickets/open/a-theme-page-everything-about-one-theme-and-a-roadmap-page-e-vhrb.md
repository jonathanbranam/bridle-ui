---
id: vhrb
title: A theme page (everything about one theme) and a roadmap page (epics in order) in the UI
kind: feature
opened: 2026-10-09
filed_by: external:advisor/product-manager
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [br-d9wq, br-22ab]
tasks: []
---

## The ask

The human, 2026-10-09 ~5:00 PM ET, verbatim (to advisor product-manager):

> future work: we should have a theme page in the UI that organizes everything about a theme
>
> 1. theme description of some kind
> 2. in-progress work: top of the page shows what is happening now (or not!)
> 3. blocking todos - open tickets for the human to unblock work
> 4. theme epics + their position in the roadmap; their tasks; whether they are approved or not
> 5. theme tickets of all kinds not in epics
> 6. remaining todos: non-blocking; less critical open items for the human tagged to this theme
>
> There will also be a roadmap page that is similar but across epics and does not include unplanned theme work, I believe

Context (advisor product-manager): the human's model, 2026-10-09 (bridle ticket br-d9wq): the roadmap orders epics, grouped by theme; an epic is a planned group of work with an outcome and "Done when", tagged to one theme; a theme is a lasting area named by a slug (`reliability`, `human-ui`), and epics and tickets are tagged to one. Today this lives only in bridle's hand-kept `docs/notes/roadmap.md`, which is the closest thing to a mock-up of both pages.

Future work: waits on bridle's `theme:` field (br-syqn), `epic` and `parent` (br-bpku), and a gateway API exposing themes, epics and the roadmap order (not designed yet; the roadmap order has no home in bridle's data yet). Needs a design before build.
