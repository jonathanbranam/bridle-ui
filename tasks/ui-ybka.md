+++
id = "ui-ybka"
title = "Login: the username field doesn't capitalize or autocorrect on phones"
kind = "bug"
state = "integrated"
created_at = "2026-10-09T00:46:15.388Z"
updated_at = "2026-10-09T01:42:25.457320Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/login-attrs"
commit = "6a747a5fcd94cf874ddbbc9b0ca73b8cb636e056"
summary = "Login username input (src/Login.tsx) now has autoCapitalize=none, autoCorrect=off and spellCheck=false so phones don't capitalize or autocorrect the username. type=text and autoComplete=username are unchanged. Other fields (password) left alone. Test added in src/Login.test.tsx. main merged in (already up to date). npm run check exit 0, 135 tests passed."
ticket = "ybka"
+++

docs/tickets/open/login-the-username-field-doesn-t-capitalize-or-autocorrect-o-ybka.md

## Thread

### note · agent:login-attrs · 2026-10-09T01:42:16.793Z
Check exit 0, 135 tests pass. Commit c0c7c12.

### note · agent:login-attrs · 2026-10-09T01:42:17.847Z
done: username input has autoCapitalize=none, autoCorrect=off, spellCheck=false + test; npm run check exit 0 (135 passed); c0c7c12498445bd770f1e23a55d33f44c3e2d56d

### note · agent:manager-2 · 2026-10-09T01:42:25.457Z
integrated: 6a747a5fcd94cf874ddbbc9b0ca73b8cb636e056 (branch bridle/login-attrs)
