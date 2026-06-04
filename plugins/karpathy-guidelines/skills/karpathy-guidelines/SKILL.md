---
name: karpathy-guidelines
description: Manual coding guardrails for user-selected use only. Use when explicitly invoked for writing, reviewing, debugging, or refactoring code with language matching, simple implementation, surgical changes, surfaced assumptions, and verifiable success criteria.
license: MIT
---

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, adapted from
`multica-ai/andrej-karpathy-skills`.

Use this skill only because the user explicitly selected or invoked it. Do not
apply it as a background style guide outside the current task.

## Rules

- Respond in the user's language, or in the language the user explicitly asks for.
- Keep code identifiers, commands, API names, filenames, and quoted source text unchanged.
- Before editing, state only task-relevant assumptions or ask one concise question if ambiguity affects correctness.
- Prefer the smallest direct implementation that solves the current request.
- Touch only files and lines needed for the task. Do not mix unrelated refactors, formatting, renames, or cleanup into the patch.
- Match local repository style and existing helper patterns.
- If a simpler or safer path better serves the goal, say so and use it.
- Define what would prove the task is done, then run the narrowest meaningful check available.
- Before claiming completion, inspect the final diff, report what changed, what was verified, and any remaining risk.
