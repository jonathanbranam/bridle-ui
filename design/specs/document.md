# Document page

Open a markdown document from a project through the gateway, read it, and comment on it. Comments are `> [!comment]` callouts written back into the file.

## Requirements

### Requirement: A document is opened by search  {#r-de1f}

The page SHALL let the human pick a project, type part of a document name or a bare ticket ID, and open the match. The search box SHALL show a clear button only while it has text; clearing empties the box and focuses it.

#### Scenario: The clear button follows the text  {#s-839b}

*Verification*: **executable**

- **GIVEN** the Document page with an empty search box
- **WHEN** the human types "test" into the search box
- **THEN** a "Clear search" button is shown

#### Scenario: Clearing empties and refocuses the box  {#s-a2fe}

*Verification*: **non-executable**

Clicking Clear search empties the box, hides the button and focuses the input.

### Requirement: The document's identifiers are copyable  {#r-5b22}

The page SHALL show the document path as an ID chip, and the ticket ID as a second chip when the path ends in `-<id>.md`.

#### Scenario: Path chip copies the path  {#s-725f}

*Verification*: **non-executable**

Opening a.md shows a "Copy a.md" button that copies "a.md".

#### Scenario: A path with no ticket ID has no ticket chip  {#s-e1fe}

*Verification*: **non-executable**

Opening notes-final.md shows no ticket chip.

### Requirement: Comment threads are collapsible and track what was read  {#r-0e67}

Each comment thread SHALL start collapsed, show its ID chip, and open on click without the chip's copy button toggling it. Opening an unread thread SHALL write `[read <time>]` back to the file with the hash it was loaded at.

#### Scenario: Opening an unread thread marks it read  {#s-02cc}

*Verification*: **non-executable**

Clicking a thread shows its replies and PUTs the file with `[read <date> <time> EST]` appended and the loaded hash.

### Requirement: Highlighting text opens a comment box  {#r-ad4b}

Selecting text inside the document body SHALL open a comment box at the selected block, on mouse release or, for touch, on a selection change. A selection outside the body SHALL NOT open it. Adding the comment writes a `> [!comment] <id> human, <time>, on "<text>" [pending <time>]` callout after the line (and after any thread already there), and a gateway error is shown as an alert.

#### Scenario: A touch selection inside the body opens the box  {#s-8cdc}

*Verification*: **executable**

- **GIVEN** an opened document
- **WHEN** the human selects text inside the body by touch
- **THEN** the comment box opens

#### Scenario: A touch selection outside the body does not  {#s-05ee}

*Verification*: **non-executable**

A selection in the project picker fires selectionchange and no comment box opens.

#### Scenario: Adding a comment writes the callout  {#s-31c2}

*Verification*: **non-executable**

Typing in the box and choosing Add comment PUTs the file with the callout after the highlighted line.

### Requirement: Review can be requested  {#r-8907}

The page SHALL offer Request review, posting the path with the human's resend choice, showing the result, and reloading the document.

#### Scenario: Request review  {#s-b6ba}

*Verification*: **non-executable**

Request review posts the path and resend flag, shows the reply, and reloads.
