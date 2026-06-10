---
name: feedback-plan-update
description: Always update PLAN.md, README.md, and CLAUDE.md before committing, include them in the same commit
metadata:
  type: feedback
---

Before every `git commit`, update the relevant docs and include them in the same commit as the code:

- **PLAN.md** — always: mark completed steps, add new ones if scope changed
- **README.md** — when features, setup steps, or project structure change
- **CLAUDE.md** — when architecture, tech stack, or key principles change

**Why:** User wants docs and code to stay in sync in every commit. A separate follow-up doc commit is not acceptable.

**How to apply:** Before staging for commit — update docs first, then `git add` everything together in one commit.
