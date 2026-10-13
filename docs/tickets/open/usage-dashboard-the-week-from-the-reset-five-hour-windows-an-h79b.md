---
id: ui-h79b
title: "Usage dashboard: the week from the reset, five-hour windows, and who used how much of the weekly budget (UI half of br-ktgd)"
kind: feature
created: 2026-10-13
created_by: external:advisor/product-manager
repos: [bridle-ui]
changes: []
specs: []
blocked_by: [br-ktgd]
related: [br-n4p9, ui-u6uz]
theme: performance
parent: br-rdkn
---

The UI half of br-ktgd (bridle), in epic br-rdkn. Blocked by br-ktgd (the account-wide routes).

The human, 2026-10-13 ~6:30 PM ET (to advisor product-manager), verbatim, trimmed: "I want to know all the statistics. ... I want to see a weekly breakdown, a daily breakdown. I also want to see a per-5-hour-block breakdown. The kinds of breakdowns that we should have are per role ... I want to know, at the end of the week, did my product management advisor use up all the tokens? I want to roll up by name across sessions, but I also want to be able to see the individual session details. ... I have no idea if we've hit any 5-hour limits in the last week. I don't think we have, but it should be in a dashboard. I'd like to see it." Earlier the same evening: "I really want to see a weekly chart of usage. Again, this thing resets. For me, it's Wednesday at 3 am, so I want to see a daily chart. ... I feel like charts going up make more sense: 0 to whatever 90%. ... I want to see charts for each 5-hour period somehow ... even one chart that goes up to the percent and then comes back down. That's really useful." And: "I spent 30% of that in interactive sessions, and 20% went to the manager. I just want that breakdown. That is what I'm really after."

## The ask

On the Usage page:

1. The week runs from the seven_day reset (the human's: Wednesday 3 AM ET), not the calendar week. A seven_day chart that climbs from 0 over the week, with a point per day, past weeks selectable.
2. A five_hour chart over the week: one line that climbs in each window and drops at each reset, with the limit marked and any window that hit it shown.
3. The breakdown: for the week, a day or one five-hour window, the share of the weekly budget by role, by name (across sessions) and, on click, by instance or session; hosted and external together, across all projects. Label the shares as estimates (from cost).
4. Per instance or session: cost and context over time (the context growth line is new).
5. Unreachable projects shown as unreachable, never zero.

This takes over br-n4p9 (projects and top agents) where it overlaps.

Done when: the human opens the Usage page and sees this week's climb, the five-hour windows, and "who used how much of my week" from real data, clicked through on a throwaway site (rule verify-ui-in-a-browser).
