---
id: ha6m
title: The human can delete a resolved comment thread (kept in git history)
kind: feature
opened: 2026-10-09
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [5zrr, wtr3]
tasks: []
---

## The ask

The human, 2026-10-08 ~9:45 PM ET, verbatim (speech-to-text, to the bridle-ui aide): "I just discovered an interesting issue with the highlighting. If you highlight the markdown text, it stops the formatting, which kind of makes sense, but it's not ideal. Try to work on fixing that. I highlighted Stephen King and the naming ideas, and now I can see the asterisks. Even more impactful is that I highlighted naming schemes.com and asked for the link to be fixed. The link was fixed, but it renders and breaks the link entirely, so I can see the markdown there, which is kind of weird. Same thing with RFC 1178. I don't see any way to resolve the comments, which is fantastic, and I assume that's been committed to git. I don't see a way to entirely dismiss them. I can't avoid it. I know that's an enhancement feature thing, but it gets a little noisy with all the resolved comments. I think there should be a way to dismiss them somehow, or an auto-dismiss. I'm not sure. I think probably a way for the human to just delete it entirely, and then it'll be saved in history if I want it again. That would address part of this highlight problem, but let's try to fix the actual problem itself too. The other thing was, if you expand a comment box, at least a resolved one, there's no way to minimize it again. The little minimize minus button should show up when you expand a comment."

This ticket is the dismiss part. ("I don't see any way to resolve the comments, which is fantastic" is read as: resolved comments are visible and that works; confirm with the human.)

The ask:
1. The human can delete a resolved comment thread from the document: a "Delete" (or "Dismiss") control on a resolved thread removes the thread from the file and saves, so it's committed like any other edit and stays in git history ("it'll be saved in history if I want it again").
2. Only the human, only on resolved threads; ask to confirm (or offer undo) since it removes text.
3. A deleted thread's highlight goes with it.
4. Out of scope unless cheap: auto-dismiss. Note it as a follow-up option for the human (e.g. hide resolved threads behind a "show resolved (n)" toggle).
