---
id: k9a8
title: "The site doesn't resize to the browser window: doesn't fill it, goes tiny with extra space"
kind: bug
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: []
tasks: [ui-k9a8]
---

## The ask

The human, 2026-10-07 ~9:15 PM ET, verbatim (to the bridle-ui aide): "the site doesn't resize properly in a browser at all; doesn't fill it; goes tiny when there is extra space; lots of issues like that"

The human, a minute later, verbatim: "it should flow to fill the browser size on a desktop / laptop large screen"

The ask:
1. Every page fills the browser window and uses the space as the window grows; nothing shrinks or sits in a narrow strip when there is more room.
2. Pages resize smoothly from phone width to a wide desktop window, with no breakage in between.
3. Check every page (to-dos, Tasks, task view, Document, Ticket, Specs, System, Time, Login) at several widths, list what's wrong, and fix it. The human said "lots of issues like that", so this is a survey as well as a fix.
4. Write the layout rule down (in bridle-ui's specs or a rule) so new pages follow it.

Starting points (from the aide's quick look, not a diagnosis):
- `src/App.tsx`: the shell `<main>` is `mx-auto ... max-w-3xl` (768px) unless the page is "wide", so most pages are a narrow centred column on a large window.
- `index.html`: the viewport meta has `maximum-scale=1`, which blocks zooming.

## Findings and fixes (worker resize)

Code survey of every page at 375, 768, 1280 and 1920+ (no browser available, so by reading
the classes, not screenshots):

- Shell `<main>` was `max-w-3xl` on every page but Document: narrow strip on a wide window. Fixed: shell fills the width.
- Nav buttons did not wrap: overflowed at 375. Fixed: `flex-wrap`.
- Document two-column grid had fixed column widths centred (`lg:justify-center`), leaving empty sides. Fixed: text column is `1fr`, margin column keeps 16-22rem.
- Viewport meta had `maximum-scale=1`, blocking zoom. Removed; the 16px input rule stops iOS focus-zoom.
- Other pages (To-dos, Tasks, Task view, Ticket, Specs, System, Time, Login) use wrapping flex rows and only small fixed label widths; nothing else found. Login form stays `max-w-xs` (a form, not a page).

Layout rule: written in CLAUDE.md, Conventions.
