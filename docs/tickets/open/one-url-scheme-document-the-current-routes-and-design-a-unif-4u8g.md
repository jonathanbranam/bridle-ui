---
id: 4u8g
title: "One URL scheme: document the current routes and design a unified, forward-looking deep-link scheme (for the human's review)"
kind: arch-revision
opened: 2026-10-06
repos: [bridle-ui, bridle]
changes: []
specs: []
needs: []
see: []
tasks: [ui-4u8g]
---

## The ask

The human, 2026-10-06 ~8:30 AM ET, verbatim (to bridle's aide): "Also I see multiple possible formats; we shouldn't have two different URL schemes. file a ticket on bridle-ui to document the current URL scheme, propose a unified and forward-looking approach using a design agents, and then assign to me for review"

URLs the human has seen:
- http://dalek.tailbc91f5.ts.net:7878/task?id=br-4zfa
- http://dalek.tailbc91f5.ts.net:7878/document?project=bridle&path=docs%2Ftickets%2Fopen%2Fa-box-manager-for-many-projects-m6qs.md
- http://dalek.tailbc91f5.ts.net:7878/ticket?project=bridle&id=vk3y
- http://dalek.tailbc91f5.ts.net:7878/tasks/bridle/br-4zfa
- http://dalek.tailbc91f5.ts.net:7878/specs?project=bridle&path=design%2Fspecs%2Fproject-resolution.md

The ask (design only; no build until the human approves):
1. Document the current URL scheme: every route and deep link the UI and gateway serve, and which ones agents and `bridle link` produce.
2. A designer agent proposes one unified, forward-looking scheme (one form per kind of thing: task, ticket, document, spec, project; how project and machine are named; what happens to old URLs).
3. Assign it to the human for review.
