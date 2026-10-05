+++
id = "ui-py6p"
title = "9p3v: bridle-ui adopts the spec flow: design/specs for today's pages, spec check in npm run check, vitest adapter"
kind = "feature"
state = "integrated"
created_at = "2026-10-05T00:40:39.422Z"
updated_at = "2026-10-05T02:31:27.580440Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
branch = "bridle/spec-adopt"
commit = "a1f77cf95403bafce099c0fdf9c1b22fa5764f47"
summary = "Adopted the spec flow: design/specs/{login,todo-list,document}.md (28 ids in .ids), check:specs run by npm run check when bridle is on PATH (CI not wired), vendored vitest adapter in tools/vitest-bridle/ (biome-excluded, index.d.mts renamed for tsc), src/specs.test.tsx binds 4 executable scenarios (IdChip x2, Document x2); 'bridle spec coverage --tests src' shows 4 bound, 0 unbound. Other scenarios are non-executable prose for now. No CHANGELOG in repo; README has a Specs note. Caveat: coverage finds ids by one-per-line in test sources; the adapter test skips when bridle is absent."
+++

Ticket: bridle repo docs/tickets/open/*-9p3v.md (read it; it quotes the human). Adoption guide: bridle repo docs/design/spec-flow.md ("Starting from nothing", "Wiring spec check"), docs/design/specs.md (format), docs/design/specs-to-tests.md (vitest adapter: bridle repo workflow/packs/typescript/adapters/vitest-bridle/). bridle's own design/specs/ is the example.

Approval: the human, via bridle-ui's aide (m-0292, 2026-10-04 ~9 PM ET): "most of my projects are not writing specs, when one of the main ideas of this solution is to write and verify specs. I'd like to start doing that so that we can divide that part of the system as we're building things." bridle-ui is the first instance.

Goal: bridle-ui writes and checks specs.
- design/specs/ with one spec per capability that exists today, describing current behaviour (not wishes): login, the to-do list (to-dos, questions, IdChip copy), the Document page (open/search, comment threads, highlight-to-comment incl. mobile, clear button). Short: requirements and a few scenarios each, in bridle's spec format.
- `bridle spec id` to assign ids; commit design/specs/.ids.
- Wire `bridle spec check --require-ids` into the local check: a `check:specs` npm script, run by `npm run check` only when `bridle` is on PATH (GitHub CI has no bridle binary; CI wiring is a follow-up, not now).
- Link tests to scenarios with the vitest adapter (vendor it per specs-to-tests.md) for at least the IdChip and one Document scenario, so `bridle spec coverage` shows them; the rest can stay unlinked for now.
- A short note in the README: new features add or change a spec in design/specs/ in the same task.
Acceptance: npm run check green; `bridle spec check --require-ids` passes; `bridle spec coverage` lists the linked scenarios.
Model: sonnet (first adoption; judgement on spec shape).
Out of scope: CI running spec check (needs bridle in CI); specs for planned pages (Tasks, System); goals/arch tiers.

## Thread

### note · external:aide · 2026-10-05T00:40:55.616Z
watching the task

### note · external:orchestrator · 2026-10-05T02:25:22.306Z
Readied by orchestrator. Go: the human, via aide (m-0317, 2026-10-04 ~10 PM ET): "Really, what I want is for every one of these tasks to be completed overnight. ... I just want all this work done. We have plenty of tokens going to bed, and you have got 8+ hours. ... Let us just get it all done and shipped so we have progress. The ordering here is inconsequential." This task is in the list. Plan as written: local spec check only (npm run check runs it when bridle is on PATH), no CI wiring.

### note · agent:spec-adopt · 2026-10-05T02:31:18.524Z
done: bridle-ui adopts specs (3 specs, check:specs in npm run check when bridle on PATH, vendored vitest adapter, 4 scenarios bound: coverage --tests src shows 4 bound/0 unbound; check green, 79 tests); 35261d8

### note · agent:manager-1 · 2026-10-05T02:31:25.068Z
integrated: a1f77cf95403bafce099c0fdf9c1b22fa5764f47 (branch bridle/spec-adopt)

### note · agent:manager-1 · 2026-10-05T02:31:27.580Z
cleanup: removed agent spec-adopt, branch bridle/spec-adopt
