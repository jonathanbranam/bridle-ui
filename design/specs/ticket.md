# Ticket URL

A stable URL that opens a ticket by ID and survives the ticket moving from open/ to resolved/.

## Requirements

### Requirement: A ticket opens by bare ID and resolves to its path {#r-f8a2}

The page `/ticket?project=p&id=id` (also accepting `br-id`-style task IDs) SHALL resolve the ID with the gateway's `links/resolve` endpoint and show the Document page for the resolved path, keeping the ticket URL without redirecting.

#### Scenario: An open ticket ID opens its document {#s-a9c1}

*Verification*: **non-executable**

Visiting the ticket URL with a valid project and open ticket ID shows the document under that URL without redirecting to /document.

#### Scenario: A resolved ticket ID also opens its document {#s-b2d7}

*Verification*: **non-executable**

Visiting the ticket URL with a valid project and resolved ticket ID shows the document under that ticket URL.

#### Scenario: An unknown ID shows not found {#s-c3e8}

*Verification*: **non-executable**

Visiting the ticket URL with a valid project and unknown ticket ID shows "No ticket id in project".
