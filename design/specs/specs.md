# Specs page

Read a project's spec from `design/specs/` through the gateway's document route. Read-only. The gateway has no spec listing yet (ticket 75zr, bridle side), so the human names the capability.

## Requirements

### Requirement: A capability's spec opens by name and shows its IDs  {#r-4d71}

The page `/specs?project=p&capability=name` SHALL read `design/specs/name.md` in project p and show it with each requirement and scenario heading followed by its ID as a copyable chip, without the `{#id}` marker in the title.

#### Scenario: The IDs show as chips  {#s-6e3b}

*Verification*: **executable**

- **GIVEN** the Specs page
- **WHEN** the human opens the capability "demo" in project "p"
- **THEN** the requirement ID "r-1111" is shown as a chip

#### Scenario: A missing capability shows the gateway's error  {#s-b8f0}

*Verification*: **non-executable**

Opening a capability with no file shows the gateway's not-found message.
