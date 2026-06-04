# Andrej Karpathy Skills for Codex

[English](README.md) | [简体中文](README.zh-CN.md)

这是一个 Codex 插件和 npm 安装器，把 Karpathy 风格的编码 Agent 约束包装成可手动调用的 Codex skill：先想清楚再写代码、保持实现简单、只做必要改动，并在声称完成前验证目标。

本项目基于 [`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills) 做 Codex 包装，不是 Andrej Karpathy 官方项目。

## 为什么做成按需挂载的 Codex 插件

这个包刻意做成 Codex 插件，而不是写进 Codex 底层、`AGENTS.md` 或 Custom Instructions 里让它每次都执行。

- 只有当你在插件菜单里选择 **Karpathy Guidelines**，或显式调用 `$karpathy-guidelines` 时，它才会进入当前任务。
- 不会改变 Codex 处理其他普通任务时的默认行为。
- 不需要在每个任务里都消耗 Karpathy guardrails 的上下文 token。
- 控制权在用户手里：需要谨慎写代码、review、重构或 debug 时再挂载；普通任务可以不启用。

这和把规则复制到 `AGENTS.md` 或 Custom Instructions 不一样。后两者更像持久上下文；这个插件是按需启用的任务级约束。

## 通过 npm 安装

```bash
npm install -g @autumncry/andrej-karpathy-skills-codex
karpathy-guidelines setup
karpathy-guidelines doctor
```

`setup` 会把这个包注册为 Codex 插件 marketplace，并安装 `karpathy-guidelines` 插件。它不会在 `npm install` 时自动运行，所以安装 npm 包不会悄悄修改你的 Codex 配置。

## 通过 GitHub 安装

```bash
codex plugin marketplace add autumncry/andrej-karpathy-skills-codex
codex plugin add karpathy-guidelines@andrej-karpathy-skills-codex
```

## 使用方式

在 Codex 插件菜单里选择 **Karpathy Guidelines**，或者在提示词里显式调用：

```text
$karpathy-guidelines "请用中文审查这个 diff，并按 Karpathy guardrails 控制改动范围"
```

这个 skill 配置为手动调用：

```yaml
policy:
  allow_implicit_invocation: false
```

也就是说，它不会因为提示词里出现 review、refactor、debugging 等词就自动触发。

当你为某个任务挂载这个插件时，Codex 会加载短版 `$karpathy-guidelines` skill，并把这些规则应用到当前任务。没有选择或调用插件时，这份 skill 不会进入 Codex 的任务指令。

## 语言执行策略

实际加载进 Codex 的 skill 文本刻意保持短小，不再复制一份中文正文。它只要求 Codex 匹配用户语言：用户用中文提问时，澄清、计划、代码说明、验证报告和最终回答默认使用中文，除非用户明确要求其他语言。

## 这个 skill 会要求 Codex 做什么

- 在编辑前暴露关键假设和不确定点。
- 优先使用能解决当前问题的最简单代码。
- 只触碰任务需要的文件和代码行。
- 把任务转成可验证的成功标准。
- 在声称完成前运行相关检查。

## 命令

```bash
karpathy-guidelines --help
karpathy-guidelines setup
karpathy-guidelines doctor
karpathy-guidelines --version
```

## 致谢

skill 文本改编自 [`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills)，并基于 MIT License 发布。
