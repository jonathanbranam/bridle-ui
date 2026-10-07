# System page

Each project's daemon status and agents, from the gateway's `GET /api/v1/projects/{project}/system` and `.../agents`.

## Requirements

### Requirement: The page shows each project's daemon status  {#r-3f8a}

The page `/system` SHALL show, per reachable project in one vertical column, the daemon's version, uptime, budget state, rate limits, CI on the integration branch (linked to the run), open incidents, sessions with last activity, and a waiting upgrade. A daemon the gateway cannot reach SHALL show "Daemon unreachable" with the error.

#### Scenario: An up daemon shows its status  {#s-a2d4}

*Verification*: **non-executable**

A daemon at version 1.2 with budget "holding" and a green CI run shows the version, "holding" and a link to the run.

#### Scenario: An unreachable daemon is said so  {#s-7c19}

*Verification*: **non-executable**

A project whose view has reachable=false shows "Daemon unreachable" and no agents.

### Requirement: Agents are listed, stopped ones behind a toggle  {#r-5e60}

Under each reachable project the page SHALL list agents with name, role, state, model, context, cost and the task they hold, the task linking to `/task?id=`. Stopped agents SHALL be hidden until "Show stopped" is ticked.

#### Scenario: Stopped agents are hidden by default  {#s-d3b8}

*Verification*: **non-executable**

With one working and one stopped agent only the working one shows; ticking "Show stopped" adds the other.

### Requirement: Form fields do not make mobile browsers zoom  {#r-16f1}

Every input, textarea and select SHALL have a font size of at least 16px, and the page SHALL set the viewport meta (`maximum-scale=1`, `viewport-fit=cover`) and `touch-action: manipulation` on the body, so iOS Safari does not zoom on focus.

#### Scenario: The CSS and viewport hold the floor  {#s-16f2}

*Verification*: **non-executable**

`src/mobile-inputs.test.ts` reads `src/index.css` and `index.html` and fails if the field rule drops under 16px, or a field in the source sets its own smaller size.
