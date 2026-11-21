+++
id = "ui-4a7d"
title = "Document page picker: build prototype A (omnibox search, results under it), recents only in a small dropdown"
kind = "feature"
state = "integrated"
created_at = "2026-11-21T18:54:42.580Z"
updated_at = "2026-11-21T19:07:47.810578Z"
created_by = "external:aide"
watchers = [
    "external:aide",
    "agent:picker-a",
]
priority = "high"
priority_at = "2026-11-21T18:54:51.683610Z"
branch = "bridle/picker-a"
commit = "05dc582eebdfa030af699d10f6279c349cb2dcff"
summary = "Replaced the Document page datalist+Open with DocPicker (src/DocPicker.tsx): WAI-ARIA combobox/listbox, results scroll under the field (filename bold, folder muted, 48px rows, 16px field), click or Enter on active row opens at once, paste of an ID/path opens, Escape closes then clears. No recents dropdown built: the gateway's empty-query suggestions show on focus (capped to 60vh) and there is no separate recents source (YAGNI). Typed exact ID opens on Enter, not per keystroke (avoids a ticket lookup per key). Created CHANGELOG.md (none existed). Tests updated for the Enter flow."
ticket = "4a7d"
+++

docs/tickets/open/document-picker-a-4a7d.md

## Thread

### note · external:aide · 2026-11-21T18:54:51.596Z
readied by external:aide

### note · external:aide · 2026-11-21T18:54:51.683Z
priority: normal -> high

### note · agent:picker-a · 2026-11-21T19:06:55.963Z
built: 4946153 (branch bridle/picker-a)

### note · agent:picker-a · 2026-11-21T19:06:56.734Z
done: Document omnibox picker (DocPicker.tsx); check exit 0, 171 tests passed, main already merged; 4946153. Browser (throwaway site, Chromium via playwright) at 375/768/1280/1920: focus shows capped suggestion dropdown, typing 'ticket' lists rows (filename bold, folder muted, 16px field, ~48px rows), ArrowDown sets aria-activedescendant, Enter opened the doc, no horizontal overflow. Not done: separate recents (no source; gateway's empty-query list shows on focus), exact ID opens on Enter/paste not per keystroke. CHANGELOG.md did not exist; created.

### note · agent:manager-6 · 2026-11-21T19:07:04.514Z
If you haven't yet, record a ticket summary with 'bridle ticket summary ui-4a7d' (it becomes the landing body). Reply only if you did not already.

### note · agent:manager-6 · 2026-11-21T19:07:47.462Z
integrated: 05dc582eebdfa030af699d10f6279c349cb2dcff (branch bridle/picker-a)

### note · agent:manager-6 · 2026-11-21T19:07:47.810Z
ticket file moved to docs/tickets/resolved/document-picker-a-4a7d.md
