# Tasks page

Open tasks by project, and a page per task, from the gateway's read-only task routes (`GET /api/v1/projects/{project}/tasks` and `.../tasks/{id}`).

## Requirements

### Requirement: The list shows open tasks by project, grouped by state  {#r-7a30}

The page `/tasks` SHALL list each reachable project's open tasks grouped by state in one vertical column, each row showing title, ID, state, priority and who works it (the agent name, else the claimant). A "Show closed" toggle SHALL add closed tasks, and a task ID box SHALL open any task by ID.

#### Scenario: Open tasks are grouped by state  {#s-1c94}

*Verification*: **non-executable**

A project with one working and one planned task lists two state groups, each with its task and the worker's name.

#### Scenario: Show closed adds closed tasks  {#s-5be2}

*Verification*: **non-executable**

Ticking "Show closed" refetches with state=all and the integrated tasks appear.

### Requirement: A task page opens from /tasks/{project}/{id} or /task?id=  {#r-2e58}

The task page SHALL show title, ID, state, claimant, branch, watchers, body and thread, in any task state. `/task?id=<id>` SHALL find the project by asking each reachable project for the ID, and an ID no project has SHALL show "No task <id>".

#### Scenario: A closed task opens by ID alone  {#s-9d17}

*Verification*: **non-executable**

Visiting /task?id=x-1111 for an integrated task in project p shows its title and thread.

### Requirement: Edges and task IDs are links  {#r-c4b6}

A task's "Blocks" and "Blocked by" IDs SHALL link to their task pages, and a task ID in any rendered markdown SHALL link to `/task?id=`.

#### Scenario: An edge opens the other task  {#s-f063}

*Verification*: **non-executable**

A task blocked by x-2222 shows x-2222 as a link to /tasks/p/x-2222.
