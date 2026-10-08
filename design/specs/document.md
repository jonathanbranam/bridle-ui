# Document page

Open a markdown document from a project through the gateway, read it, and comment on it. Comments are `> [!comment]` callouts written back into the file.

## Requirements

### Requirement: A document is opened by search  {#r-de1f}

The page SHALL let the human pick a project, type part of a document name or a bare ticket ID, and open the match. The search box SHALL have a clear button beside it (outside the field), always shown, at least 44px square, and disabled while the box is empty; clearing empties the box and focuses it.

#### Scenario: The clear button is disabled when the box is empty  {#s-839b}

*Verification*: **executable**

- **GIVEN** the Document page with an empty search box
- **THEN** a "Clear search" button is shown and disabled
- **WHEN** the human types "test" into the search box
- **THEN** the "Clear search" button is enabled

#### Scenario: Clearing empties and refocuses the box  {#s-a2fe}

*Verification*: **non-executable**

Clicking Clear search empties the box, disables the button and focuses the input.

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

### Requirement: Selected text can be commented on, with a [ + ] button  {#r-ad4b}

Selecting text inside the document body SHALL change nothing in the page (native selection and Copy keep working) and SHALL show a [ + ] button below the selection. Tapping it opens a comment box at the selected block, with the quote captured when the selection settled, and only then highlights the passage. The button goes away when the selection clears. A selection outside the body SHALL NOT show it. Adding the comment writes a `> [!comment] <id> human, <time>, on "<text>" [pending <time>]` callout after the line (and after any thread already there), and a gateway error is shown as an alert.

#### Scenario: A touch selection inside the body shows the [ + ] button  {#s-8cdc}

*Verification*: **executable**

- **GIVEN** an opened document
- **WHEN** the human selects text inside the body by touch
- **THEN** the [ + ] button shows and no comment box opens

#### Scenario: A touch selection outside the body does not  {#s-05ee}

*Verification*: **non-executable**

A selection in the project picker fires selectionchange and no [ + ] button shows.

#### Scenario: Adding a comment writes the callout  {#s-31c2}

*Verification*: **non-executable**

Typing in the box and choosing Add comment PUTs the file with the callout after the highlighted line.

### Requirement: Review can be requested  {#r-8907}

The page SHALL offer Request review, posting the path with the human's resend choice, showing the result, and reloading the document.

#### Scenario: Request review  {#s-b6ba}

*Verification*: **non-executable**

Request review posts the path and resend flag, shows the reply, and reloads.

### Requirement: Documents render as markdown with front matter and links  {#r-4ac7}

The page SHALL render a document's markdown (GFM), show a leading `---` front matter block as a key/value table for any file, and link URLs, `[[wiki links]]` (`target` or `target|label`), `docs/...` paths, ticket IDs, ticket file stems (`some-title-ab12`) and ticket-made task IDs, in the document, its threads and the front matter values. A path, wiki link or ID links to the document only when the gateway's `links/resolve` finds it; otherwise it stays plain text. The same linking applies to to-do and question text on the home page.

#### Scenario: Front matter is a table  {#s-6d3e}

*Verification*: **non-executable**

A document starting with `---`, `title: T`, `see: [ab3d]`, `---` shows a table with the rows "title" and "see", and no raw `---` lines.

#### Scenario: A URL is a link  {#s-7a4b}

*Verification*: **non-executable**

The text "see https://example.com/x" shows a link to that URL.

#### Scenario: A resolved wiki link opens the document  {#s-8c5f}

*Verification*: **non-executable**

`[[docs/design/cli|the CLI]]` resolving to docs/design/cli.md shows a link "the CLI" to `/document?project=p&path=docs%2Fdesign%2Fcli.md`; resolving to null shows plain "the CLI".

#### Scenario: A ticket ID is a link when it resolves  {#s-9e6a}

*Verification*: **non-executable**

The ID ab3d, when resolved, links to its ticket; when unresolved it stays plain text.

#### Scenario: Highlighting still works over a link  {#s-2b7c}

*Verification*: **non-executable**

Selecting text in a list item that contains a link opens the comment box at that item.
