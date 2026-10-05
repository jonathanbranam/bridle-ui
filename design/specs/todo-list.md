# To-do list

The home page: the human's to-dos and task questions across projects, from `GET /api/v1/items`.

## Requirements

### Requirement: Items are grouped by project, decisions first  {#r-71fe}

The list SHALL group items by project, show a project's questions before its to-dos, and keep the gateway's order within each.

#### Scenario: Grouping and order  {#s-b208}

*Verification*: **non-executable**

A project with one question and one to-do lists the question first; two projects appear as two groups.

### Requirement: An unreachable project is a muted line  {#r-6cf7}

A project the gateway cannot reach SHALL appear as a muted "is unreachable" line, not as an alert.

#### Scenario: Unreachable project  {#s-d231}

*Verification*: **non-executable**

The gateway reports project p unreachable; the list shows "p is unreachable" and no alert.

### Requirement: Items can be resolved from the list  {#r-202c}

Each to-do SHALL offer Done and Decline (with a required reason); each question SHALL offer an answer box. Each action calls the gateway, then refetches the list.

#### Scenario: Done, decline and answer refetch  {#s-416c}

*Verification*: **non-executable**

Done posts `done`; Decline asks for a reason then posts `drop`; Answer posts the text; the list reloads after each.

### Requirement: Every ID is selectable and copyable  {#r-8e9b}

Wherever the UI shows an ID (task, ticket, document path, comment thread), it SHALL render the ID as selectable text beside a copy button that writes the ID to the clipboard.

#### Scenario: The ID is text, not part of the button  {#s-cc27}

*Verification*: **executable**

- **GIVEN** an ID chip showing the ID "selectable-id"
- **WHEN** the chip is rendered
- **THEN** the ID is plain selectable text, not inside the button

#### Scenario: The copy button copies the ID  {#s-50c7}

*Verification*: **executable**

- **GIVEN** an ID chip showing the ID "test-id-456"
- **WHEN** the human clicks the button labelled "Copy test-id-456"
- **THEN** the clipboard receives "test-id-456"

#### Scenario: Copying survives a missing clipboard  {#s-2b7d}

*Verification*: **non-executable**

Clicking copy when the clipboard is unavailable throws nothing and leaves the ID selectable.
