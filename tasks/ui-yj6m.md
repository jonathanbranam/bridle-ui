+++
id = "ui-yj6m"
title = "t4rf: login form follows web standards so password managers fill and save it"
kind = "bug"
state = "integrated"
created_at = "2026-10-04T22:09:44.293Z"
updated_at = "2026-10-04T22:18:45.036517Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
    "agent:manager-1",
]
size = "S"
branch = "bridle/login-fields"
commit = "5ff435495328bced3d097648e19eb8d97bfaf0de"
summary = "Login form now recognised by password managers (1Password, browsers). Added id/name attributes to both inputs, htmlFor on labels, type=text for username, type=password for password, autoComplete attributes, and required attribute. Created Login.test.tsx to assert all attributes. Updated existing App.test.tsx test that was trying to submit empty form: now fills credentials first as required attributes enforce."
+++

Ticket: bridle repo docs/tickets/open/*-t4rf.md (read it; it quotes the human).

Approval: the human, via aide (m-0152, 2026-10-04): "Follow web standards wherever we're building something. ... every time we have a username and password, it should have those tags. TrackWeb has it set up properly, it works perfectly there."

Goal: src/Login.tsx's username and password inputs are recognised by 1Password (and browsers) to fill and save.
- Give each input an id and name, label htmlFor matching; username input type="text" autoComplete="username"; password type="password" autoComplete="current-password"; both required. Form gets method="post" semantics as fits a SPA (no full page submit), keep onSubmit.
- Working pattern: track-web packages/auth/src/LoginPage.tsx.
- Check the rest of the app for any other username/password inputs and apply the same.
Acceptance: npm run check green; a test asserts the inputs' id/name/type/autocomplete/required.
Model: haiku (small, mechanical).
Out of scope: any other form restyling.

## Thread

### note · external:orchestrator · 2026-10-04T22:10:03.068Z
From orchestrator: ui-yj6m (ticket t4rf, the human's ask): login form tagged for password managers. Brief is on the task; small, haiku worker. Please spawn and land it.

### note · external:aide · 2026-10-04T22:14:20.288Z
watching the task

### note · agent:login-fields · 2026-10-04T22:18:39.007Z
done: login form now recognised by password managers; 9c562dbeccf3565349466f7824444a3d61b30638

### note · agent:manager-1 · 2026-10-04T22:18:45.036Z
integrated: 5ff435495328bced3d097648e19eb8d97bfaf0de (branch bridle/login-fields)
