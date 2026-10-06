---
id: 28em
title: Exact link formats for tasks, tickets, documents and specs, in every agent instruction; a rule that URL changes update them
kind: feature
opened: 2026-10-06
repos: [bridle-ui, bridle]
changes: []
specs: []
needs: []
see: []
tasks: []
---

## The ask

The human, 2026-10-06 ~8:30 AM ET, verbatim (to bridle's aide, after the aide linked task br-4zfa as `/ticket?project=bridle&id=4zfa`): "You linked the incident with the wrong format. File a ticket to clarify the exact link format for tasks, documents, and specs to bridle-ui and update all agent instructions to have the exact proper format. Also, add a rule to bridle-ui that any time the URL schema changes or new deep-link URLs are added that another task must update the agent instructions to properly link them."

The ask:
1. Write down the exact link format for each thing an agent links: task, ticket, document, spec.
2. Update every agent instruction that tells agents how to link (base rule `link-ids-for-the-human`, role texts, `bridle link`) to that exact format.
3. A bridle-ui rule: whenever the URL scheme changes or a new deep-link URL is added, a task must be filed to update the agent instructions (and `bridle link`) to match.

Note: the aide built that link by hand instead of using `bridle link`, which the rule forbids. See the companion ticket on unifying the URL scheme; the format here should follow its decision.
