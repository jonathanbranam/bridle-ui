---
id: ui-rd5f
title: "Usage page: external sessions in the instance picker, marked, nulls shown as not measured (follow-up to ui-mxkj, br-njjt)"
kind: feature
created: 2026-10-13
created_by: external:advisor/product-manager
repos: [bridle-ui]
changes: []
specs: []
blocked_by: []
related: [ui-mxkj, br-njjt]
theme: performance
parent: br-rdkn
---

Follow-up to ui-mxkj ("later the external sessions too", left out of its brief) now that br-njjt landed (bridle 100f2e19).

The human, 2026-10-12 ~6:50 PM ET (to advisor product-manager), verbatim: "When this is done I want to be able to choose a specific agent instance and chart its usage". Epic br-rdkn done-when item 4 covers the external sessions (orchestrator, advisors, aide, the human's own).

## The ask

1. The instance picker on the Usage page lists external sessions too (br-njjt returns them in `usage/agents` with `external: true`, identity as name), marked as external so the human can tell them from hosted agents.
2. Picking one charts it like any instance (same series route).
3. Shape change from br-njjt: `UsageInstanceView.turns` and `UsageSeriesBucket.turns` / `busy_seconds` are now `number | null` (null for external sessions). Null means "not measured": show it as such, never as zero. Today `src/usageSeries.ts` does `Number(b.turns)`, which turns null into 0; fix that. Hide or mark the turns and busy-time charts for an external session.
4. Re-sync the generated types from bridle's `crates/bridle-gateway/bindings/`.

Done when: from the Usage page the human picks an external session (e.g. the orchestrator) and sees its token and cost chart, with turns and busy time shown as not measured, not zero; hosted agents chart as before.
