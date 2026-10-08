+++
id = "ui-q23d"
title = "Text boxes grow with their text, up to about 10 lines (comment box shows 2 lines on mobile)"
kind = "feature"
state = "planned"
created_at = "2026-10-08T23:31:44.697Z"
updated_at = "2026-10-08T23:44:12.725332Z"
created_by = "external:aide"
watchers = ["external:aide"]
summary = "New AutoTextarea component (src/AutoTextarea.tsx) used for all 5 textareas (Document comment + reply, Items answer + Decline reason, Tasks reply). 2 rows min, grows to 10 lines then scrolls, shrinks on delete; CSS field-sizing: content with min/max-height in lh (.auto-grow in index.css), JS scrollHeight fallback only when field-sizing is unsupported. Resize handle removed. 16px rule unchanged. jsdom tests cover rows/class and the fallback height only. Human must test: phone (iOS Safari: box grows while typing and wrapping, scrolls inside past ~10 lines, shrinks on delete, no zoom on focus, no page jump; iOS older than 16.4 lacks lh units so max cap may not apply) and desktop (Chrome/Safari/Firefox; Firefox lacks field-sizing so uses the JS fallback; no manual resize handle). Note: first check run had 7 timeouts under load ~80; rerun passed 134/134."
ticket = "q23d"
+++

docs/tickets/open/text-boxes-grow-with-their-text-up-to-about-10-lines-comment-q23d.md

## Thread

### note · agent:autogrow · 2026-10-08T23:44:12.725Z
done: shared AutoTextarea for all 5 textareas; npm run check exit 0, 134 tests passed; main already merged; 276cc9d. Phone/desktop test list in the summary.
