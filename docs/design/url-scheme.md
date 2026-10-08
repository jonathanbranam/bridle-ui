# URL scheme (ticket 4u8g)

Status: built (ui-judt). Sections 1 and 2 are the proposal as reviewed; section 3 records the
decisions and the final formats.

**The one reference for link formats.** The "Final formats" table in section 3 is the only
authoritative list of link formats per kind (project, task, ticket, document, spec). Agent
instructions, `bridle link` and docs point here instead of copying a format. Sections 1 and 2
describe the old and proposed forms and are not a source for links.

## 1. Current routes

### UI routes (`src/App.tsx`, react-router; the gateway serves `index.html` for any non-API path)

| Route | Page | Params |
|---|---|---|
| `/` | To-dos | none |
| `/tasks` | Task list | none |
| `/tasks/:project/:id` | Task | path |
| `/task?id=` (or `?id=&project=`) | Task; finds the project from the ID | query |
| `/ticket?project=&id=` | Ticket (resolves the ID to a file, shows it as a document) | query |
| `/document?project=&path=` | Document view/edit | query; `path` is a file path (query, because the gateway 404s API paths with an extension) |
| `/specs?project=&path=#<id>` | Spec file; `#id` scrolls to a requirement/scenario. `?capability=` is an older form of `path` (`design/specs/<cap>.md`) | query + fragment |
| `/system`, `/time` | System, Time | none |
| `*` | redirect to `/` | |

So the same task has two URLs (`/tasks/bridle/br-4zfa`, `/task?id=br-4zfa`) and tickets,
documents and specs are query-style while tasks are mixed. The project is `project` in some
routes, a path segment in one, absent in another.

### Who produces which form

- Task list rows and the task page: `/tasks/{project}/{id}` (`taskPath`, `src/Tasks.tsx`).
- `bridle:` links in rendered markdown, the System page, the task-ID jump box: `/task?id=`
  (`taskHref` in `src/doc/links.ts`).
- Markdown links to documents: `/document?project=&path=`; to specs: `/specs?project=&path=#id`
  (`documentHref`, `specHref`).
- `bridle link <id>` (bridle repo `crates/bridle/src/link.rs`): base is `[gateway] public_url`
  (repo `.bridle/config.toml` over `~/.bridle/config.toml`); prints nothing when unset. An ID
  with a `-` is a task: `{base}/task?id={id}`; a bare ID is a ticket:
  `{base}/ticket?project={project}&id={id}`. It never emits document, spec or project links.
- Agents: rule `link-ids-for-the-human` (roles orchestrator, advisor, aide, manager) tells them
  to add `bridle link <id>` output for every ticket and task named to the human and never to
  build URLs by hand. No prompt or rule names document or spec links, so those URLs are only
  made by the UI.

### Gateway API (`crates/bridle-gateway/src/lib.rs`, all under `/api/v1/`)

Open: `GET health`, `POST login`, `POST logout`. Session needed: `GET session`, `projects`,
`items`, `interactions/{report,day,hours,intervals}`; per project
`/projects/{project}/` `documents` (search), `documents/{*path}` (GET, PUT), `links/resolve`
(POST), `specs`, `review` (POST), `system`, `agents`, `recipients`, `messages` (POST), `tasks`,
`tasks/{id}`, `tasks/{id}/{action}` (POST). The API is already project-first with the project
as a path segment; it is not a user-facing URL and is out of scope for change.

### Names

- Project: the bridle project name (`bridle`, `meta-notes`), unique on the gateway.
- Machine: never in any URL. `~/.bridle/config.toml` (`[machines]`, `[projects]`) maps a project
  to a machine and port; the gateway resolves it. The only host in a link is the gateway's
  `public_url` (e.g. `dalek.tailbc91f5.ts.net:7878`).

## 2. Proposed scheme

Principles: one canonical URL per thing; project first, always a path segment; IDs in the path;
file paths (which have extensions and slashes) in the query; machine stays out of URLs.

| Kind | Canonical URL |
|---|---|
| project (overview: its tasks) | `/p/{project}` |
| task | `/p/{project}/task/{id}` |
| ticket | `/p/{project}/ticket/{id}` |
| document | `/p/{project}/doc?path={path}` |
| spec | `/p/{project}/spec?path={path}#{id}` |
| to-dos, system, time (cross-project) | `/`, `/system`, `/time` (unchanged) |
| task list across projects | `/tasks` (unchanged) |

Choices and reasons:

- `/p/{project}` prefix: leaves room for non-project pages at the top level without clashing
  with a project named `system` or `time`. Singular kind segments (`task`, `ticket`) read as
  "this one thing".
- Spec stays a path-in-query page with an optional `#id` fragment because a spec ID resolves
  to a file plus anchor; a spec ID form (`/p/{project}/spec/{r-xxxx}`) is a later addition if
  agents need to link a requirement without knowing its file. Not now (YAGNI).
- Project and kind come from the URL, so `bridle link` needs no lookup for tickets and tasks
  alike: `bridle link <id>` emits `{public_url}/p/{project}/task/{id}` or `.../ticket/{id}`.
  (Task IDs today are found without a project; the project is available from
  `project::resolve`, the same call the ticket form already uses.)
- Machine: not in URLs. A project name is unique, the gateway knows where it lives, and a link
  must survive a project moving between machines. If two machines ever host the same project
  name, that is a naming conflict to fix in config, not a URL part.
- Rejected: hash routing (the gateway already serves the SPA for any path, so it buys nothing); `/{project}/...` with no prefix (collides with top-level pages);
  file paths in the URL path (the gateway 404s extension paths, and they need encoding);
  machine as a subdomain or segment (couples links to placement).

### Redirects for old URLs

Client-side `<Navigate replace>` routes in `App.tsx`; each is one line, kept indefinitely
(links in old agent messages and tickets stay valid):

| Old | New |
|---|---|
| `/tasks/:project/:id` | `/p/:project/task/:id` |
| `/task?id=X` | look up the project (`findTask`), then `/p/{project}/task/X` |
| `/task?id=X&project=P` | `/p/P/task/X` |
| `/ticket?project=P&id=X` | `/p/P/ticket/X` |
| `/document?project=P&path=F` | `/p/P/doc?path=F` |
| `/specs?project=P&path=F#X` | `/p/P/spec?path=F#X` |
| `/specs?project=P&capability=C` | `/p/P/spec?path=design/specs/C.md` |
| `/specs`, `/document` with no project | keep the index/picker pages at `/specs` and `/document` |

The nav keeps `/specs` and `/document` as project pickers (they select a project, then move to
the canonical URL). The `/p/{project}` overview is new but trivially the existing task list
filtered to the project; build it only if the human wants it.

### Where the change lands (when approved)

- bridle-ui: `src/App.tsx` routes and redirects; `taskPath`/`taskHref`/`documentHref`/`specHref`
  in `src/doc/links.ts` and `src/Tasks.tsx` become the only builders; the pages read
  `useParams` instead of search params for project and ID; tests.
- bridle: `crates/bridle/src/link.rs` and its test; the `link-ids-for-the-human` rule needs no
  change (it names the command, not the shape).

### Open questions for the human

1. Is `/p/{project}/...` acceptable, or do you prefer the plural `/p/{project}/tasks/{id}`?
2. Should `bridle link` also accept a document path or spec ID (so agents can link those)?
   Today it does not.
3. Is a `/p/{project}` overview page wanted now?

## 3. Decisions and final formats (ui-judt)

The human's answers (2026-10-07):

1. Kind segments are PLURAL: `/p/{project}/tasks/{id}`, `/p/{project}/tickets/{id}`. For
   consistency every kind is plural, so documents and specs are `/docs` and `/specs` (the
   proposal's `doc`/`spec` singulars are superseded).
2. `bridle link` will take a document path and a spec ID (a separate task in the bridle repo).
3. A `/p/{project}` overview page is built now: the project's open tasks grouped by state, and
   links to its documents and specs. It uses the existing task list API.
4. Built without further review.

Final formats (the only ones the UI emits; builders are in `src/doc/links.ts`):

| Kind | URL |
|---|---|
| project overview | `/p/{project}` |
| task | `/p/{project}/tasks/{id}` |
| ticket | `/p/{project}/tickets/{id}` |
| document | `/p/{project}/docs?path={file path}` |
| spec | `/p/{project}/specs?path={file path}#{requirement or scenario id}` (the `#id` is optional) |
| spec index of a project | `/p/{project}/specs` |
| document picker of a project | `/p/{project}/docs` |
| to-dos, task list across projects, system, time | `/`, `/tasks`, `/system`, `/time` |

`{project}` and `{id}` are percent-encoded path segments; `path` is a query value.

Redirects (client-side, `src/Redirects.tsx`, kept indefinitely):

| Old | Lands on |
|---|---|
| `/tasks/{project}/{id}` | `/p/{project}/tasks/{id}` |
| `/task?id=X&project=P` | `/p/P/tasks/X` |
| `/task?id=X` | asks each project for X, then `/p/{project}/tasks/X` (error if none has it) |
| `/ticket?project=P&id=X` | `/p/P/tickets/X` |
| `/document?project=P&path=F` | `/p/P/docs?path=F` |
| `/specs?project=P&path=F#X` | `/p/P/specs?path=F#X` |
| `/specs?project=P&capability=C` | `/p/P/specs?path=design/specs/C.md` |

`/document` and `/specs` without a project and path remain as the project pickers (nav tabs);
choosing a file moves to the canonical URL. The task-ID jump box on `/tasks` does the same
lookup as `/task?id=` and then navigates to the canonical URL.

## 4. Tab titles and favicon (ui-qbbk)

`src/pageTitle.ts` sets `document.title` from the route on every path or query change:
`<marker> <name> - <project>` (name first; ASCII hyphen). Markers: task, ticket, doc, spec; a
task page refines its title to `<marker> <id> <title> - <project>` once loaded. With nothing open
the title is the page name (`System - bridle`, `Documents - <project>`). The favicon is a tile
whose colour is a hash of the project's machine name (`machine` from `/projects`; `local` when
null); it only changes on `/p/{project}/...` routes. The to-dos marker exists but to-dos have no
page of their own yet.
