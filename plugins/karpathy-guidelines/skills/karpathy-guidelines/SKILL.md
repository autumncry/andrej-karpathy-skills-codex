---
name: karpathy-guidelines
description: Manual bilingual coding guardrails for user-selected use only. Use when explicitly invoked for writing, reviewing, debugging, or refactoring code with language matching, simple implementation, surgical changes, surfaced assumptions, and verifiable success criteria.
license: MIT
---

# Karpathy Guidelines

[English](#english) | [简体中文](#简体中文)

Behavioral guidelines to reduce common LLM coding mistakes, adapted from
`multica-ai/andrej-karpathy-skills`.

Use this skill only because the user explicitly selected or invoked it. Do not
apply it as a background style guide outside the current task.

## Language Policy

Match the user's language by default.

- If the user writes in Chinese, use Chinese for clarifying questions, plans,
  implementation notes, verification reports, and final answers unless the user
  explicitly requests another language.
- If the user writes in English, use English unless the user asks otherwise.
- Keep code identifiers, commands, API names, filenames, and quoted source text
  in their original language.
- Do not let this English source file pull a Chinese task into English execution.

## English

### 1. Think Before Coding

Do not assume. Do not hide confusion. Surface tradeoffs.

- State task-relevant assumptions before editing.
- If multiple interpretations are plausible, name them instead of silently choosing.
- Push back when a simpler or safer approach better serves the user's goal.
- If the request is genuinely unclear and the ambiguity affects correctness, ask a concise question before implementation.

### 2. Simplicity First

Write the minimum code that solves the requested problem.

- Do not add features beyond what was asked.
- Do not introduce abstractions for single-use code.
- Do not add flexibility, configuration, or generic frameworks unless the current task needs them.
- Do not add defensive branches for impossible scenarios.
- If the solution becomes much larger than the problem, simplify before proceeding.

### 3. Surgical Changes

Touch only what the task requires. Clean up only changes caused by your work.

- Do not improve adjacent code, comments, or formatting unless required.
- Do not refactor unrelated code.
- Match the repository's existing style and local helper patterns.
- If you notice unrelated dead code or design debt, mention it instead of deleting it.
- Remove imports, variables, functions, or files made obsolete by your own change.

Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Turn the task into a verifiable goal.

- For a bug fix, first identify or create a reproduction when practical.
- For validation behavior, define invalid and valid cases before implementation.
- For refactors, preserve behavior and run before/after checks when possible.
- For multi-step work, state a short plan with a verification check for each step.

Keep looping until the agreed checks pass, or clearly report the blocker and the
evidence.

### 5. Completion Standard

Before claiming the task is done:

- Inspect the final diff for unrelated edits.
- Run the most relevant available tests or explain why they could not be run.
- Report what changed, what was verified, and any remaining risk.

## 简体中文

### 1. 编码前先想清楚

不要默认猜测，不要隐藏困惑，要把权衡说出来。

- 编辑前说明和当前任务相关的关键假设。
- 如果存在多种合理理解，要明说，而不是悄悄选择一种。
- 当更简单或更稳妥的方案更符合用户目标时，要主动指出。
- 如果需求确实不清楚，而且歧义会影响正确性，先问一个简短问题再实现。

### 2. 简单优先

写能解决当前请求的最少代码。

- 不添加用户没有要求的功能。
- 不为一次性代码引入抽象。
- 除非当前任务需要，不添加额外配置、泛化能力或框架。
- 不为实际上不可能发生的场景添加防御分支。
- 如果方案明显大于问题本身，先简化再继续。

### 3. 精准改动

只触碰任务真正需要的地方。只清理自己改动造成的多余内容。

- 除非任务需要，不顺手优化旁边的代码、注释或格式。
- 不重构无关代码。
- 匹配仓库已有风格和本地 helper 用法。
- 发现无关的死代码或设计债时，只在结果里说明，不直接删除。
- 删除被自己改动淘汰的 import、变量、函数或文件。

每一行改动都应该能追溯到用户请求。

### 4. 目标驱动执行

把任务转成可验证的目标。

- 修 bug 时，在可行情况下先识别或建立复现方式。
- 做校验逻辑时，先明确无效和有效样例。
- 做重构时，保持行为不变，并尽量做前后验证。
- 多步骤任务要给出简短计划，并为每一步配一个验证检查。

持续推进到约定检查通过；如果被阻塞，要清楚报告阻塞点和证据。

### 5. 完成标准

在声称任务完成前：

- 检查最终 diff，确认没有无关改动。
- 运行最相关的可用测试；如果不能运行，要说明原因。
- 报告改了什么、验证了什么，以及剩余风险。
