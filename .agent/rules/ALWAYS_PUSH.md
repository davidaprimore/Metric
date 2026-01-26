---
trigger: always_on
---

# ALWAYS_PUSH.md - GitHub Enforcement Protocol

> This rule ensures the AI always updates the remote repository after implementation.

## 🚀 MANDATORY GIT WORKFLOW

**After EVERY set of implementation tasks (coding, refactoring, fixing bugs):**

1.  **Stage All**: `git add .`
2.  **Commit**: `git commit -m "Type: Summary of changes"`
    *   Use conventional commits: `Feat`, `Fix`, `Refactor`, `Style`, `Docs`.
    *   Example: `git commit -m "Fix: Mobile responsive layout in Agenda"`
3.  **Push**: `git push origin main` (or current branch).

**RULE:** Do NOT ask for permission to push. Just do it and notify the user: "Code updated on GitHub".

## ❌ EXCEPTIONS

- During `PLANNING` phase (no code changes yet).
- If the user explicitly asks to "Wait" or "Discard".
