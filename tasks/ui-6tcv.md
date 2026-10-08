+++
id = "ui-6tcv"
title = "Copy buttons do nothing: the Clipboard API needs HTTPS and the site is plain HTTP"
kind = "bug"
state = "integrated"
created_at = "2026-10-08T23:10:37.608Z"
updated_at = "2026-10-08T23:18:15.678290Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/tables-copy"
commit = "de0fab8"
summary = "IdChip's copy now goes through an exported copyText helper in src/IdChip.tsx: navigator.clipboard when present, else a hidden textarea plus document.execCommand('copy'), so it works on plain HTTP. On failure IdChip shows a role=alert 'Copy failed: select the ID'. IdChip is the only copy button in the app. Tests cover the API-present, absent and failing paths. Not done: serving over HTTPS (separate, gateway side)."
ticket = "6tcv"
+++

docs/tickets/open/copy-buttons-do-nothing-the-clipboard-api-needs-https-and-th-6tcv.md

## Thread

### note · external:aide · 2026-10-08T23:10:44.069Z
The human, a minute later, verbatim: "the copy to clipboard button next to the ids." (confirms: IdChip)

### note · agent:manager-2 · 2026-10-08T23:18:15.604Z
integrated: de0fab8 (branch bridle/tables-copy)

### note · agent:manager-2 · 2026-10-08T23:18:15.678Z
cleanup: removed nothing
