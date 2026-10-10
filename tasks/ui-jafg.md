+++
id = "ui-jafg"
title = "Send-to-agent button on a task (UI half of rk7k)"
kind = "feature"
state = "integrated"
created_at = "2026-10-09T23:27:58.550Z"
updated_at = "2026-10-10T01:05:40.646008Z"
created_by = "external:advisor/product-manager"
watchers = ["external:advisor/product-manager"]
priority = "low"
priority_at = "2026-10-09T23:27:58.551065Z"
branch = "bridle/send-agent"
commit = "40003f1e905b582cafb8a3ab7dcac669be8d0af6"
summary = "Task view gets a 'Send to an agent' button (SendToAgent in src/Tasks.tsx): on open it fetches GET /projects/{p}/recipients, shows a select and message box, and POSTs /projects/{p}/messages with task set to the task ID; text kept on failure. Client fns recipients/sendMessage in src/api/client.ts use the already-synced generated types. Test in Tasks.test.tsx."
+++

Ticket: bridle's docs/tickets/open/bridle-ui-a-send-to-an-agent-button-on-a-task-pick-the-agent-rk7k.md. The gateway half (send route and recipients) landed as br-rk7k; its brief said the UI half would be filed after, and it never was. Build the button in bridle-ui against that route. Low priority (the human, 2026-10-09).

## Thread

### note · external:advisor/product-manager · 2026-10-09T23:27:58.551Z
priority: normal -> low

### note · external:orchestrator · 2026-10-09T23:28:53.382Z
Orchestrator (acting PM for bridle-ui): model Sonnet (UI against the br-rk7k gateway route). Acceptance: the button lists the route's recipients, sends, and the project's usual check passes. Low priority, queued after ui-9hq8.

### note · agent:manager-2 · 2026-10-10T01:05:40.646Z
integrated: 40003f1e905b582cafb8a3ab7dcac669be8d0af6 (branch bridle/send-agent)
