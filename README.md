# Andrej Karpathy Skills for Codex

[English](README.md) | [简体中文](README.zh-CN.md)

Codex plugin and npm installer for Karpathy-inspired coding-agent guidelines:
think before coding, keep implementation simple, make surgical changes, and
verify the goal before claiming success.

This is a Codex packaging project based on
[`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills).
It is not an official Andrej Karpathy project.

## Why an opt-in Codex plugin

This package is intentionally a Codex plugin, not a global instruction that
Codex must execute for every task.

- It runs only when you select **Karpathy Guidelines** from the plugin menu or
  explicitly invoke `$karpathy-guidelines`.
- It does not modify Codex's base behavior for unrelated conversations.
- It avoids spending context tokens on Karpathy-style guardrails when the task
  does not need them.
- It keeps the workflow user-controlled: mount the plugin for careful coding,
  review, refactoring, or debugging; leave it off for ordinary tasks.

This is different from copying the guidance into `AGENTS.md` or Custom
Instructions. Those approaches are persistent context. This plugin is an
on-demand task guardrail.

## Install with npm

```bash
npm install -g @autumncry/andrej-karpathy-skills-codex
karpathy-guidelines setup
karpathy-guidelines doctor
```

`setup` registers this package as a Codex plugin marketplace and installs the
`karpathy-guidelines` plugin. It does not run automatically during
`npm install`, so installing the npm package does not silently modify your Codex
configuration.

## Install from GitHub

```bash
codex plugin marketplace add autumncry/andrej-karpathy-skills-codex
codex plugin add karpathy-guidelines@andrej-karpathy-skills-codex
```

## Use

Select **Karpathy Guidelines** from the Codex plugin menu, or invoke it directly:

```text
$karpathy-guidelines "review this diff with the Karpathy guardrails and match my language"
```

The skill is configured for manual use:

```yaml
policy:
  allow_implicit_invocation: false
```

That means it should not silently trigger just because a prompt mentions review,
refactoring, or debugging.

When mounted for a task, Codex loads the short `$karpathy-guidelines` skill and
applies those instructions to that task. When the plugin is not selected or
invoked, the skill is not part of Codex's task instructions.

The loaded skill text is intentionally short and not duplicated in multiple
languages. It tells Codex to respond in the user's language, so Chinese requests
should still receive Chinese clarifications, plans, verification notes, and
final answers unless the user asks otherwise.

## What the skill asks Codex to do

- Surface assumptions and ambiguity before editing.
- Prefer the simplest code that solves the requested problem.
- Touch only files and lines needed for the task.
- Turn the task into verifiable success criteria.
- Run relevant checks before claiming the work is complete.

## Commands

```bash
karpathy-guidelines --help
karpathy-guidelines setup
karpathy-guidelines doctor
karpathy-guidelines --version
```

## Attribution

The skill text is adapted from
[`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills)
and distributed under the MIT License.
