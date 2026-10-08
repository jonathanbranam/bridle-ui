# Remote documents and replies to any task (plan)

Planning for tasks ui-9hq8 (tickets 9hq8) and ui-u2df (u2df). No code yet. The bridle repo is
`/Volumes/Data/work/bridle/bridle`; the gateway is `crates/bridle-gateway`.

## 1. What is there today (verified in the bridle repo)

- Every document route (`documents.rs`: read, write, search, link resolve; and `specs.rs`) starts
  with `repo_of(project)`, which needs a local working-tree path. A project on another machine
  has none (discovery `Target.repo = None`), so it answers 503 "remote documents aren't
  supported yet". The files live on the NUC; the daemon there knows its repo, the gateway here
  does not.
- A remote project's daemon address is known (`MachineMap::remote`: `http://{host}:{port}` from
  `[machines]` and `[projects]` in `~/.bridle/config.toml`). What is missing is the human's token
  for that daemon: `actions::resolve` also refuses a remote project ("remote actions aren't
  supported yet"), and the token comes from the local workspace. The planned fix is br-8b98
  (`[human.<machine>]` token fallback, `bridle-api/src/discovery.rs`) plus gateway task 9
  (`docs/design/human-web-ui.md` section 5, "Multi-machine"). I could not look up br-8b98 from
  this project's task list, so its state is unverified.
- The daemon API has no document endpoints at all (`bridle-api` client). The gateway reads files
  directly. A comment on a document is an edit of the file (the whole file goes back on a PUT,
  with the hash it read), plus `review_add` to the project's daemon, which already works over a
  URL and token.
- The daemon API has `note_task(id, body)` (what `bridle task comment` uses). The gateway never
  calls it; its task actions are done, drop, answer only (`actions.rs`).

So both asks are blocked on the same prerequisite: **a human token for the NUC daemons**. Remote
documents additionally need a way to touch files on the NUC.

## 2. Decision: documents go through the NUC's daemon

Add document endpoints to the daemon (`bridle-daemon`) and have the gateway call them with the
human's remote token when a project is remote. The file logic stays in one place and is shared
(local projects keep reading the tree directly).

Why this one: the daemon is already reachable over the network, already authenticates the human
(token), already owns the repo path, and already receives `review_add`. No new listener, no new
credential kind.

### Rejected alternatives

- **A gateway on the NUC, dalek's gateway proxies to it.** A second login/session surface and a
  gateway-to-gateway credential; the daemon already has the auth we need.
- **Open the NUC gateway directly in the browser.** Two origins, two logins, no single document
  picker; breaks "the browser talks to one gateway".
- **ssh/rsync or git fetch from dalek.** git shows only committed files and a comment (a write)
  needs a push; ssh adds a dependency, key handling and a second write path. Rejected.
- **Cache remote docs in the gateway.** Stale reads, and a write needs the live hash. Not now.

## 3. Bridle-side briefs (ready to file, in order)

### B1. Human token for remote daemons (prerequisite; gateway task 9)

If br-8b98 / task 9 is already planned or filed, do not file again; point at it. Goal: `resolve()`
in `actions.rs` returns `(url, token)` for a remote project from `[human.<machine>]`, so every
gateway route that calls `resolve` (tasks, items, system, messages, review, actions) works for
projects on the NUC. Files: `actions.rs` (`resolve`), `discovery.rs` (carry `machine` to the
token lookup), `bridle-api/src/discovery.rs` if not landed. Acceptance: a fake remote daemon with
its own token receives `GET tasks/{id}` and `done` through the gateway; a missing `[human.nuc]`
entry gives the existing clear error. Size: S-M (it is mostly written; the design is in
human-web-ui.md section 4).

### B2. Document endpoints on the daemon

Goal: the daemon serves its own repo's documents to a human-token caller. Routes (daemon, under
`/v1/`, human principal only; names follow the gateway's): `GET /v1/documents?q=`,
`GET /v1/documents/{*path}`, `PUT /v1/documents/{*path}`, `POST /v1/links/resolve`,
`GET /v1/specs`. Bodies and errors are the gateway's existing types (`Document`, `DocumentWrite`,
`DocumentSaved`, `DocumentMatches`, `ResolvedLinks`, `ProjectSpecs`; 404 / 400 / 415 / 409 / 403).
Files: move the pure functions of `crates/bridle-gateway/src/documents.rs` (`read_document`,
`write_document`, `search_documents`, `resolve`, `resolve_links`, hashing, the git commit on the
checked-out branch) and `specs.rs` (`load`, `path_for`) into a module both crates use (put it in
`bridle-api` or a small new crate; pick whichever avoids a gateway-to-daemon dependency), add the
routes in `crates/bridle-daemon`, and the client methods in `bridle-api/src/client/mod.rs`. The
write must keep every safety rule in the module header (plain repo-relative names, hash check,
checked-out branch only, never detached HEAD, 2 MB cap). Tests: the existing documents tests
move with the code; add daemon route tests (read, stale hash 409, `..` path 400, no token 401,
agent token refused). Acceptance: `curl` with the human token reads and edits a doc on a test
daemon. Size: M. Split if large: (a) move the code, no behaviour change; (b) daemon routes and
client.

### B3. Gateway routes remote documents through the daemon

Goal: `repo_of` becomes `target_of(project) -> Local(PathBuf) | Remote(Client)`. The six routes
in `documents.rs` and `specs.rs` call the shared code for `Local` and the B2 client for `Remote`.
API route shapes do not change (so the generated types do not change). `add_to_review` already
uses `resolve()`, so with B1 it reaches the NUC; remote writes also go through
`PUT /v1/documents/...` and the same review call. Map a daemon 404/409/415 to the same
`DocError` variants; an unreachable NUC is 503 with the existing "reason" wording (name the
machine). Acceptance: tests with a fake remote daemon: read, search, write with stale hash,
resolve-links, write adds to review. Size: S-M. Depends on B1, B2.

### B4. Reply to any task (gateway)

Goal: `POST /api/v1/projects/{project}/tasks/{id}/reply` with the existing `ActionRequest`
(`{ text }`). Add `Action::Reply` in `actions.rs`: trims, rejects empty (`MissingText("reply")`),
calls `client.note_task(id, text)` with the human token, so the thread entry is authored `human`.
Works for any task state. Returns the existing `ActionResult` with `action: "reply"`. Check, and
fix in the daemon only if it fails, that a human note on a task notifies the claimer and watchers
the way an agent's `task comment` does. Reply only; no `comment` kind. Files: `actions.rs`,
`lib.rs` (route accepts the new action word), tests in `actions.rs`. Acceptance: a fake daemon
receives the note with the human token; empty text is refused; a remote project works once B1 is
in. Size: S. Depends on nothing for local projects; remote needs B1.

## 4. bridle-ui side

### U1 (ui-u2df): reply box on every task view

- `src/api/client.ts`: add `"reply"` to `Action`; `act()` already posts
  `/projects/{p}/tasks/{id}/{action}` with `text`.
- `src/Tasks.tsx`: below the thread of `TaskView`, a labelled textarea (16px, label per the web
  rules) and a Reply button, shown for every state and every task, not only the human's own.
  Empty text disables the button. On success clear the box; reuse `run()`'s refetch so the new
  message shows. Error text goes in the existing `actionError` alert. Keep Done/Decline/Answer as
  they are.
- Tests (`src/Tasks.test.tsx`): box present on an open task, a closed task and a question; submit
  posts `.../reply` with the text; the thread refetches; an error shows.
- Size: S. Can be built once B4's route exists (or against a mocked fetch first). It adds no
  generated types.

### U2 (ui-9hq8): remote documents

The page already works if the gateway answers; the picker, links and comments all go through
`src/api/client.ts` routes that do not change. Work to check and do:

- `src/Document.tsx` and the project picker: show the machine name next to a remote project, and
  show a 503 as "NUC is unreachable" (the gateway's `reason`), not a generic error.
- `src/Project.tsx` overview and the document picker: confirm remote projects are listed from
  `GET /projects` (no filter on local); fix if one exists.
- Tests: `Document.test.tsx` with a project whose `machine` is `nuc`: opens, comments, 503 text.
- Size: S. Needs B3 for any real check, but can be coded against mocks earlier.

## 5. Order and dependencies

1. B1 (token; may already be filed as br-8b98 / gateway task 9). Blocks every remote thing.
2. B4 and B2 in parallel (independent). B4 then U1 can ship for local projects before the NUC works.
3. B3 after B1 and B2. Then U2.
4. Deploy: each ui landing is followed by `npm run install-ui`; the gateway needs a restart after
   B3/B4 (manager's landing note).

Fastest path to the human's reply ask (u2df): B4 + U1, no wait. The documents ask (9hq8) needs
B1 + B2 + B3 + U2.

## 6. Open questions (blocking ones only)

1. **Is the NUC human token (br-8b98 / task 9) landed or scheduled, and where does the human put
   it (`[human.nuc]` in dalek's `~/.bridle/config.toml`)?** Blocks B1 and everything remote.
   Recommendation: treat B1 as step 1, ask the bridle manager for its state; if it is not
   scheduled, it comes first.
2. **Does the NUC daemon listen on an address dalek can reach, on a fixed port?** The ticket says
   meta-notes, notes and dotfiles-local have `[projects]` entries; if their daemons bind to
   loopback only, B3 cannot reach them. Recommendation: confirm with `curl http://nuc:{port}/v1/health`
   from dalek before B3; the fix is config, not code.

Not blocking, decided: the gateway commits a remote comment on the branch checked out on the
NUC, same as dalek's (an agent or the human working in that tree sees an extra commit). Task
"comment" vs "reply": reply only, as the human said.
