---
id: 5zrr
title: "Comment highlights break markdown: bold shows asterisks, links show raw markdown and stop working"
kind: bug
opened: 2026-10-09
filed_by: external:aide
repos: [bridle-ui]
changes: []
specs: []
needs: []
see: [ha6m, wtr3]
tasks: [ui-5zrr]
---

## The ask

The human, 2026-10-08 ~9:45 PM ET, verbatim (speech-to-text, to the bridle-ui aide): "I just discovered an interesting issue with the highlighting. If you highlight the markdown text, it stops the formatting, which kind of makes sense, but it's not ideal. Try to work on fixing that. I highlighted Stephen King and the naming ideas, and now I can see the asterisks. Even more impactful is that I highlighted naming schemes.com and asked for the link to be fixed. The link was fixed, but it renders and breaks the link entirely, so I can see the markdown there, which is kind of weird. Same thing with RFC 1178. I don't see any way to resolve the comments, which is fantastic, and I assume that's been committed to git. I don't see a way to entirely dismiss them. I can't avoid it. I know that's an enhancement feature thing, but it gets a little noisy with all the resolved comments. I think there should be a way to dismiss them somehow, or an auto-dismiss. I'm not sure. I think probably a way for the human to just delete it entirely, and then it'll be saved in history if I want it again. That would address part of this highlight problem, but let's try to fix the actual problem itself too. The other thing was, if you expand a comment box, at least a resolved one, there's no way to minimize it again. The little minimize minus button should show up when you expand a comment."

This ticket is the highlight part ("let's try to fix the actual problem itself too").

The ask:
1. A comment's highlight never changes how the text renders: bold, italics, code and links inside or across the highlighted text render exactly as without it. The human's cases: a highlight over bold text (the "Stephen King" naming ideas) showed the asterisks; highlights over the namingschemes.com and RFC 1178 links showed the raw markdown and broke the links.
2. Cause, from the code: `Marked` in `src/Document.tsx` splits a block's *source* text at the quote and renders each piece with its own `<Md>`, so markup spanning a highlight edge is cut in two (the comment above it says so). The quote is rendered text, so highlight in the rendered output instead: render the block's markdown once, then wrap the matching rendered text in `<mark>` (e.g. a small rehype plugin over text nodes, splitting across element boundaries), so links and emphasis stay intact.
3. A link inside a highlight still works when tapped.
4. Tests with bold, a link and inline code partly and wholly inside a quote.
5. The human tests on the namingschemes.com/RFC 1178 document on phone and desktop.
