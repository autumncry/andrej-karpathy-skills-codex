# Andrej Karpathy Skills for Codex

Codex plugin and npm installer for Karpathy-inspired coding-agent guidelines:
think before coding, keep implementation simple, make surgical changes, and
verify the goal before claiming success.

This is a Codex packaging project based on
[`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills).
It is not an official Andrej Karpathy project.

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
$karpathy-guidelines "review this diff with the Karpathy guardrails"
```

The skill is configured for manual use:

```yaml
policy:
  allow_implicit_invocation: false
```

That means it should not silently trigger just because a prompt mentions review,
refactoring, or debugging.

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
