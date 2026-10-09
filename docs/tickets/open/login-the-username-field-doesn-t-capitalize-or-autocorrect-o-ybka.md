---
id: ybka
title: "Login: the username field doesn't capitalize or autocorrect on phones"
kind: bug
opened: 2026-10-09
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: []
tasks: []
---

## The ask

The human, 2026-10-08 ~7:50 PM ET, verbatim (to the bridle-ui aide): "Is there a field hint or something you can put on the username field so that it doesn't auto capitalize the first character? Maybe call it an email or something? that behavior drives me nuts on webpages."

The ask:
1. The login form's Username field (`src/Login.tsx`) gets `autoCapitalize="none"`, `autoCorrect="off"` and `spellCheck={false}`, so phones (iOS Safari especially) don't capitalize the first letter or "correct" the name. Keep `type="text"` and `autoComplete="username"`.
2. Not `type="email"`: the username isn't an email, and browsers would reject it as an invalid address.
3. Check any other field where capitals or autocorrect are wrong (IDs, project names), and give those the same attributes. Leave prose boxes (comments, replies) alone.
4. The human tests on the phone: the first letter of the username stays lowercase.
