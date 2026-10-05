# Specs page

Lists a project's specs from the gateway's specs route (`GET /projects/{p}/specs`) and opens one through the document route. Read-only. Requirement (`r-xxxx`) and scenario (`s-xxxx`) IDs written in markdown elsewhere (task bodies and threads, documents) link here when the gateway's `links/resolve` finds them, and stay plain text when not; the ID syntax is in `src/doc/links.ts`.

## Requirements

### Requirement: A spec opens from the index and shows its IDs  {#r-4d71}

The page `/specs?project=p` SHALL list the spec files of project p, each linking to `/specs?project=p&path=design/specs/name.md`. That page SHALL read the file (`?capability=name` still works)  and show it with each requirement and scenario heading followed by its ID as a copyable chip, without the `{#id}` marker in the title.

#### Scenario: The IDs show as chips  {#s-6e3b}

*Verification*: **executable**

- **GIVEN** the Specs page
- **WHEN** the human opens the capability "demo" in project "p"
- **THEN** the requirement ID "r-1111" is shown as a chip

#### Scenario: A missing capability shows the gateway's error  {#s-b8f0}

*Verification*: **non-executable**

Opening a file that does not exist shows the gateway's not-found message.

### Requirement: Spec IDs in markdown link to the Specs page  {#r-7c2a}

A requirement or scenario ID in rendered markdown SHALL link to `/specs?project=p&path=<file>#<id>` when `links/resolve` returns a spec path for it, and SHALL stay plain text when it returns none.

#### Scenario: A resolved ID links, an unresolved one does not  {#s-3f9d}

*Verification*: **non-executable**

Covered by `src/Md.test.tsx` (the spec ID tests), which are unit tests not bound to this scenario.
