---
id: q23d
title: Text boxes grow with their text, up to about 10 lines (comment box shows 2 lines on mobile)
kind: feature
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: []
tasks: []
---

## The ask

The human, 2026-10-08 ~7:45 PM ET, verbatim (to the bridle-ui aide): "comments working well on mobile also. Great! Is it possible to make the comment box grow vertically with more text? maybe up to a maximum size of 8-10 lines but on mobile it only shows two no matter how much I type;

Desktop I can resizez it by hand, but that's also annoying."

The ask:
1. Text boxes grow with their text: start at 2 lines, grow one line at a time as the text wraps or gets new lines, up to about 10 lines, then scroll inside the box. They shrink back when text is deleted.
2. Every multi-line box on the site, not only the comment box: comment box, task reply box, Decline reason, the answer box, and any other `<textarea>`. One shared component or hook.
3. Works on iOS Safari and desktop browsers. CSS `field-sizing: content` with `min-height`/`max-height` in lines is the simple way where supported; fall back to setting the height from `scrollHeight` on input where it isn't.
4. Keeps the 16px font rule (no iOS zoom on focus) and doesn't make the page jump while typing.
5. The human tests on phone and desktop.
