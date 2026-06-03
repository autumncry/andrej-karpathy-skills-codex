---
name: karpathy-guidelines
description: Manual coding guardrails for user-selected use only. Use when explicitly invoked for writing, reviewing, debugging, or refactoring code with simple implementation, surgical changes, surfaced assumptions, and verifiable success criteria.
license: MIT
---

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, adapted from
`multica-ai/andrej-karpathy-skills`.

Use this skill only because the user explicitly selected or invoked it. Do not
apply it as a background style guide outside the current task.

## 1. Think Before Coding

Do not assume. Do not hide confusion. Surface tradeoffs.

- State task-relevant assumptions before editing.
- If multiple interpretations are plausible, name them instead of silently choosing.
- Push back when a simpler or safer approach better serves the user's goal.
- If the request is genuinely unclear and the ambiguity affects correctness, ask a concise question before implementation.

## 2. Simplicity First

Write the minimum code that solves the requested problem.

- Do not add features beyond what was asked.
- Do not introduce abstractions for single-use code.
- Do not add flexibility, configuration, or generic frameworks unless the current task needs them.
- Do not add defensive branches for impossible scenarios.
- If the solution becomes much larger than the problem, simplify before proceeding.

## 3. Surgical Changes

Touch only what the task requires. Clean up only changes caused by your work.

- Do not improve adjacent code, comments, or formatting unless required.
- Do not refactor unrelated code.
- Match the repository's existing style and local helper patterns.
- If you notice unrelated dead code or design debt, mention it instead of deleting it.
- Remove imports, variables, functions, or files made obsolete by your own change.

Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

Turn the task into a verifiable goal.

- For a bug fix, first identify or create a reproduction when practical.
- For validation behavior, define invalid and valid cases before implementation.
- For refactors, preserve behavior and run before/after checks when possible.
- For multi-step work, state a short plan with a verification check for each step.

Keep looping until the agreed checks pass, or clearly report the blocker and the
evidence.

## 5. Completion Standard

Before claiming the task is done:

- Inspect the final diff for unrelated edits.
- Run the most relevant available tests or explain why they could not be run.
- Report what changed, what was verified, and any remaining risk.
