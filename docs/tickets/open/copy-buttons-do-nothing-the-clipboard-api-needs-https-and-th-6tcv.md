---
id: 6tcv
title: "Copy buttons do nothing: the Clipboard API needs HTTPS and the site is plain HTTP"
kind: bug
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [bpsd]
tasks: []
---

## The ask

The human, 2026-10-08 ~7:40 PM ET, verbatim (to the bridle-ui aide): "the other thing is that the copy button doesn't work anywhere on browser or mobile."

Cause (aide, from the code): `src/IdChip.tsx` copies with `navigator.clipboard.writeText`. The Clipboard API exists only in a secure context (HTTPS or localhost). The site is served over plain HTTP (`http://dalek.tailbc91f5.ts.net:7878`), so `navigator.clipboard` is undefined, the call throws, and the `catch` swallows it silently: the button does nothing, on every browser and phone.

The ask:
1. The copy buttons work on the site as served today (plain HTTP over Tailscale), on desktop browsers and on iOS Safari: fall back, when `navigator.clipboard` is missing, to a hidden textarea + `document.execCommand("copy")` within the click handler.
2. Never fail silently: if copying fails, the button says so (e.g. "Copy failed: select the ID").
3. Every copy button on the site uses the one helper (IdChip and any others).
4. Tests for both paths (Clipboard API present, absent).
5. The human tests on laptop and phone.

Related, not this ticket: serving the site over HTTPS (e.g. `tailscale serve` or `tailscale cert`) would make it a secure context, so the Clipboard API and other secure-only browser features work. That's a gateway/install change in the bridle repo; raise it separately if wanted.
