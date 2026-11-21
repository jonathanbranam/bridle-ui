# Changelog

## Unreleased

### Added

- To-do deep links: `/p/<project>/todos/<id>` shows the to-do page with that to-do scrolled into view and highlighted, and a ticket page (or typed ID) that is a human to-do redirects there instead of failing (ui-gb7q).
- One ticket page: the ticket document (frontmatter hidden) now shows together with its state, thread, reply and send boxes and to-do actions on one scrolling page. A document of 150+ lines gets a collapsible table of contents on the left (collapsed on narrow screens); headings get anchors (ui-fwsx).
- Tickets page: a Project dropdown (All by default) filters tickets to one project; the choice is kept across reloads (ui-9xh2).

### Changed

- Document page: the picker is now an omnibox. An always-visible search field with results in a scrolling list under it (filename bold, folder muted); picking a result, or pressing Enter on a highlighted one, opens it at once. Pasting an ID or path opens it too. The Open button and the browser datalist are gone (ui-4a7d).
