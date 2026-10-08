+++
id = "ui-qbbk"
title = "qbbk: browser tab titles name what you're viewing (document, task, system...), updated on every route and selection change"
kind = "feature"
state = "integrated"
created_at = "2026-10-06T21:29:12.691Z"
updated_at = "2026-10-08T10:04:51.035240Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "S"
branch = "bridle/titles"
commit = "8f66426f5d2f028abcaaa8afafd5b1b735b7bacd"
summary = "Tab titles via src/pageTitle.ts (usePageTitle in App, updates on every path/query change): '<marker> <name> - <project>' for tasks, tickets, docs, specs (name = id or file basename); page name otherwise; TaskView refines to '<marker> <id> <title> - <project>' once loaded. Favicon: SVG data-URL tile hue-hashed from the project's machine (from existing /projects 'machine', null -> 'local'); only on /p/{project}/... routes, default icon elsewhere. No gateway change. To-do marker defined but unused (no to-do page). Documented in docs/design/url-scheme.md s4. Check green, 124 tests."
ticket = "qbbk"
+++

The human (2026-10-06 ~4:20 PM ET): "I want nice titles in the browser ... The browser title should be updated when the user has selected something in a route to show the name of what they are viewing. I have 10 tabs that all say 'bridle' - I can't find my document or task or system tab." Ticket qbbk in the bridle repo (docs/tickets/open/browser-tab-titles-name-what-you-re-viewing-a-web-pack-rule-qbbk.md). Format to propose in the brief before building, e.g. '<item name> - <page> - bridle'. Done = installed on the live site.

## Thread

### note · external:aide · 2026-10-06T21:29:52.945Z
watching the task

### note · external:aide · 2026-10-06T23:20:43.544Z
aide: the human added to this (2026-10-06 ~7:20 PM ET), verbatim: "title bar should include lots of info, but we need to plan it carefully to fit on a crowded toolbar things to include: machine project tab filename / that won't all fit; can we indicate machine and/or bridle with favicon? that would help / Prefer the \"name of the open thing\" where possible, maybe an icon / emoji to tell if it's a todo, task, ticket, or spec?" Recorded in ticket qbbk (bridle 2cae148e) with a proposal: '<type marker> <name> · <project>', page name when nothing is selected, favicon tinted per machine. Put the format in the brief for the human to approve before building.

### note · external:orchestrator · 2026-10-06T23:21:00.971Z
From orchestrator: the human added to ui-qbbk (see aide's comment). Don't build it until the human approves the title format in the brief. Do ui-g49c and ui-mk9b first.

### note · external:orchestrator · 2026-10-08T02:23:43.186Z
orchestrator: the human approved the title format in the orchestrator's session, 2026-10-07 ~10:25 PM ET: '<type marker> <name> - <project>' (an emoji or icon per kind: to-do, task, ticket, doc, spec; then the open thing's name), the page name when nothing is selected, favicon tinted per machine. ASCII hyphen as the separator, not a middle dot. Build it after ui-judt (both touch the routes in App.tsx); use ui-judt's new routes. Sonnet.

### note · agent:titles · 2026-10-08T10:04:40.959Z
done: tab titles + per-machine favicon; check exit 0, 124 tests; 55c4979 (main already merged)

### note · agent:manager-2 · 2026-10-08T10:04:48.679Z
integrated: 8f66426f5d2f028abcaaa8afafd5b1b735b7bacd (branch bridle/titles)

### note · agent:manager-2 · 2026-10-08T10:04:51.035Z
cleanup: removed agent titles, branch bridle/titles
