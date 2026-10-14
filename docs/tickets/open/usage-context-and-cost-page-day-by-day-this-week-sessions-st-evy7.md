---
id: ui-evy7
title: "Usage: Context and cost page, day by day this week: sessions, startup cost, context growth, renewal-limit comparison"
kind: feature
created: 2026-10-14
created_by: external:advisor/product-manager
repos: [bridle-ui]
changes: []
specs: []
blocked_by: [br-eapt]
related: [ui-h79b, br-ktgd]
parent: br-rdkn
theme: performance
---

UI half of br-eapt (bridle: the sessions routes). Epic br-rdkn; design record br-ktgd decisions 5-7. Sits beside ui-h79b (the Usage dashboard: week, five-hour windows, who used the week) and shares its week picker.

The human, 2026-10-13 ~10:30 PM ET (to advisor product-manager), verbatim: "For the context and cost management go ahead and design and add pages to the UI that shows all of those charts so I can view them day by day this week"

From br-ktgd, the human the same evening: "we should have the ability to tell, if possible, how much context our startup eats up and the dollar amount there" and "I want to be able to track the cost, then make a change, like forcing restarts at 150 or 100, and see if that ends up lowering our costs or not." And: "We want to know what we're spending in restarts."

## The ask

A "Context and cost" page (a tab of Usage), for this week (from the seven_day reset, Wednesday 3 AM ET) with a day picker (each day of the week, or the whole week); past weeks selectable:

1. **Sessions per day**: hosted and external sessions started each day, by role, with how each ended (renewal at N tokens, handover, stop, exit).
2. **Cost per day**: by role, split into startup cost (each session's first turn) and the rest. Shares labelled estimates.
3. **Startup**: per role, the average startup context and cost per session, and first-turn cache read vs cache write (is startup cached across sessions?).
4. **Context growth**: pick a session (role, then name, then session) and see its context per turn, with the renewal limit marked; several sessions of one name overlaid.
5. **Renewal limit comparison**: cost per day and per session grouped by the renewal limit in effect, so a week at one limit can be set against a week at another.

Sessions from before session ids were recorded (NULL) are left out with a note, never shown as zero. Unreachable projects shown as unreachable.

Done when: the human opens the page and steps through this week day by day with real data, clicked through on a throwaway site (rule verify-ui-in-a-browser).
