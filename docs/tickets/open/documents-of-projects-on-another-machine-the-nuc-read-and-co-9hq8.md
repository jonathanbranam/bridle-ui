---
id: 9hq8
title: "Documents of projects on another machine (the NUC): read and comment in bridle-ui"
kind: feature
opened: 2026-10-08
filed_by: external:aide
repos: [bridle-ui, bridle]
changes: []
specs: []
needs: []
see: [u2df]
tasks: []
---

## The ask

The human, 2026-10-08, verbatim (to the meta-notes aide on the NUC, relayed by the bridle aide as m-0787; incident br-bbhn kept it in an outbox): "The part of the context here is that I want to be able to view the naming proposal document that the naming advisor has written for me, but I can't see that on my phone without logging in to GitHub. Can I view that on bridle-ui? This is something I really, really want because I think I can only view tickets and tasks. I have said for a while that I want to be able to view documents because I want to be able to read that on my phone and add comments to it (the same way that I can on tickets). Will you ask the aide at bridle-ui if that work can be scheduled and planned so that I can view these? While you're at it, also ask that I need to be able to comment on that. I should be able to also reply to tasks. I'm not sure if I should be able to comment on tasks or not, but I definitely should be able to reply to any task."

What exists: the Document page (`/p/{project}/docs?path=`) already opens any markdown file in a project on dalek and takes comments in the margin. What's missing is projects on another machine: the gateway answers "project '{project}' is on another machine: remote documents aren't supported yet" (`crates/bridle-gateway/src/documents.rs` in bridle). meta-notes, notes and dotfiles-local are on the NUC (`~/.bridle/config.toml`), so their documents (the naming proposal among them) can't be opened.

The ask:
1. The gateway reads, searches and writes documents of projects on another machine (the NUC), so the Document page opens them like dalek's: read on the phone, no GitHub.
2. Comments on those documents work the same as on dalek's documents (margin comments, threads, review requests).
3. The document picker and ticket/doc links work for remote projects too.

Note: the human called this something they "really, really want" and have asked for "for a while".
