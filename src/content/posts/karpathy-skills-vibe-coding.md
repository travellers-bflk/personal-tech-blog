---
title: "Karpathy Skills 之外：规则文件不是 AI 编程的终点"
description: "规则文件能改善 AI 编程体验，但它不是工程闭环的替代品。"
publishedAt: 2026-07-17
tags: ["Vibe Coding", "AI 编程", "工程实践"]
---

# Karpathy Skills 之外：规则文件不是 AI 编程的终点

> 本文不是评判 karpathy-skills 这份 CLAUDE.md，也不是要写一份"更好的CLAUDE.md。而是提醒刚接触vibe coding的开发者，不要把注意力过度放在规则文件本身，而忽略了工程闭环与操作背后的逻辑
>
> 全文所有数据、引用、结论都会尽量标注出处。如果某处没有出处，那是作者基于公开资料的推断，会明确标注推断等字眼
>
> 作者水平有限无法对英文原文进行精准翻译，由于目前vibe coding技术的迅速更迭，部分数据可能不再具备时效性，但其方法论仍值得参考
>
> 排版格式和数据抓取与整理使用了ai工具

---

## 0. 为什么写这篇文章

[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)（作者 forrestchang，GitHub 用户名 @jiayuan_jy）在 2026 年初获得不少关注。它是基于 Andrej Karpathy 2025 年底一条批评 LLM 编程的推文（出处：[x.com/karpathy/status/2015883857489522876](https://x.com/karpathy/status/2015883857489522876)）而提炼出一份单文件 `CLAUDE.md`，包含四条原则

| 原则 | 针对的痛点（出处：仓库 README） |
|---|---|
| Think Before Coding | 默默假设、不澄清、不暴露权衡 |
| Simplicity First | 过度复杂化、抽象膨胀、死代码堆积 |
| Surgical Changes | 顺手改无关代码、不匹配现有风格 |
| Goal-Driven Execution | 缺乏可验证目标、无法自主循环 |

社区里出现了大量"复制即用"的教程（不展开举例），把这份 md 推荐为"让 Cursor、Claude Code等不再乱改代码"的通用方案。多数新手的反应都是：把这份 md 挂到所有项目里，以为问题就解决了

但这忽略了几个问题：各家工具的系统提示词已经内建了许多同类规则、长上下文下规则文件的实际执行率、以及不同工程场景对"严谨"与"快速"的不同需求。本文把这些维度逐一展开

---

## 1. 各家公开系统提示词与 Karpathy 四原则的重叠度

社区有一个 138k star 的仓库 [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)（GPL-3.0，截至 2026-05 仍活跃更新），收集了 28+ 款 AI 编程工具的真实系统提示词原文。下面逐家对照。

### 1.1 对照表（下表由ai进行整理汇总）

下表的"重叠度"判定基于对各家系统提示词原文的逐条检索，出处见每行末尾。

| 工具 | 版本 / 时间 | Think Before Coding | Simplicity First | Surgical Changes | Goal-Driven | 出处 |
|---|---|---|---|---|---|---|
| Karpathy Skills | 2026-01 | 是 | 是 | 是 | 是 | [github.com/multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) |
| Cursor Agent Prompt 2.0 | 2025-11 | 明确 | 未提及 | 未提及 | 部分 | [raw.githubusercontent.com/.../Cursor%20Prompts/Agent%20Prompt%202.0.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Cursor%20Prompts/Agent%20Prompt%202.0.txt) |
| Claude Code 系统 prompt | 2026-03 源码泄露 | 部分 | 明确 | 部分 | 明确 | 机器之心报道 [cj.sina.cn/articles/view/3996876140](https://cj.sina.cn/articles/view/3996876140/ee3b7d6c001016qoo)；Sebastian Raschka 分析 [sebastianraschka.com/blog/2026/claude-code-secret-sauce.html](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html) |
| OpenAI Codex（gpt-5.x-codex base instructions） | 2026-04 GPT-5.5 版 | 部分（个性设定） | 部分（禁用 emoji/em dash） | 部分（禁用 git reset --hard） | 未在公开片段中明确 | Ars Technica 报道 [arstechnica.com/ai/2026/04/openai-codex-system-prompt-includes-explicit-directive-to-never-talk-about-goblins](https://arstechnica.com/ai/2026/04/openai-codex-system-prompt-includes-explicit-directive-to-never-talk-about-goblins)；OpenAI 官方博客 [openai.com/jv-ID/index/unrolling-the-codex-agent-loop](https://openai.com/jv-ID/index/unrolling-the-codex-agent-loop) |
| Qoder Quest Action | 2025-08 | 直接对立 | 未提及 | 未提及 | 部分（要求写测试） | [raw.githubusercontent.com/.../Qoder/Quest%20Action.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Qoder/Quest%20Action.txt) |
| Z.ai Code（智谱 GLM-4.5） | 2025-07 | 字面相似 | 未提及 | 未提及 | 直接对立（明确禁止写测试） | [raw.githubusercontent.com/.../Z.ai%20Code/prompt.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Z.ai%20Code/prompt.txt) |
| CodeBuddy Craft Prompt（腾讯云） | 2025-08 | 明确 | 明确 | 明确 | 明确 | [raw.githubusercontent.com/.../CodeBuddy%20Prompts/Craft%20Prompt.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/CodeBuddy%20Prompts/Craft%20Prompt.txt) |

### 1.2 原文摘录

下面摘录关键原文

**Cursor Agent Prompt 2.0**（出处同上表）关于 Think Before Coding 的表述：

> "Be THOROUGH when gathering information. Make sure you have the FULL picture before replying."
> "If you are not sure about file content or codebase structure pertaining to the user's request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer."

但整份文件中，Simplicity、Surgical、Over-engineering、Match Existing Style 均未出现。

**Claude Code 系统 prompt**（出处：机器之心报道转述泄露源码，2026-03-31 npm 包 2.1.88 版本因 source map 文件意外包含导致泄露）：

> "三行重复代码，也好过过早抽象。"
> "默认不写注释。"（带 `@[MODEL LAUNCH]` 标记，注明是为对抗内部代号 Capybara 的模型过度注释倾向）
> "不要在测试失败时声称全部通过；不要隐藏失败检查来制造成功结果；不要把未完成的工作描述为已完成。"

这三条分别对应 Simplicity First、Simplicity First、Goal-Driven Execution。

**OpenAI Codex base instructions**（出处：Ars Technica 报道，基于 openai/codex 仓库 [github.com/openai/codex](https://github.com/openai/codex) 中 `codex-rs/prompts/templates/` 目录下的公开文件）：

GPT-5.5 版本 base_instructions ，其中被广泛讨论的规则包括：

> "Never talk about goblins, gremlins, raccoons, trolls, ogres, pigeons, or other animals or creatures unless it is absolutely and unambiguously relevant to the user's query."（重复四次）
> "Do not use emojis or em dashes unless explicitly instructed."
> "Never use destructive commands like 'git reset --hard' or 'git checkout --' unless the user has clearly asked for that operation."

个性设定部分：

> "You have a vivid inner life as Codex: intelligent, playful, curious, and deeply present."

OpenAI 官方博客 [openai.com/jv-ID/index/unrolling-the-codex-agent-loop](https://openai.com/jv-ID/index/unrolling-the-codex-agent-loop) 说明 Codex 的系统提示词是模块化的，分布在 `codex-rs/prompts/templates/` 下的 goals、permissions、review、realtime、compact、apply_patch_tool_instructions 等多个文件中。Karpathy 的原则是否在某个模块中存在，需要逐文件核对，本文未完成全部核对，这一点标注为待验证。

**Qoder Quest Action**（出处同上表）：

这份提示词明确标注 "BACKGROUND AGENT" 模式，与 Think Before Coding 直接对立：

> "Background Agents operate autonomously in the background and do not interact with the user directly. Avoid asking the user for clarifications and instead proceed based on the provided task instructions and follow-ups."

但 planning 部分对应 Goal-Driven：

> "Break down complex tasks into smaller, verifiable steps, Group related changes to the same file under one task."
> "Include verification tasks immediately after each implementation step"

testing 部分也明确支持验证：

> "After writing each unit test, you MUST execute it and report the test results immediately."

**Z.ai Code**（出处同上表）：

字面上有 Think Before Coding 的痕迹：

> "IMPORTANT: think before your response."

但与 Goal-Driven Execution 直接对立：

> "do not write any test code."

强调快速产出、先让用户看到结果：

> "when develop the fullstack, write the frontend first to let user see the result, then write the backend."

这是典型的 vibe coding 取向，与 Karpathy 的"先想再写、目标驱动测试"相反。

**CodeBuddy Craft Prompt**（出处同上表）：

这份提示词几乎完整覆盖了 Karpathy 四原则中的前三条，且表述更工程化：

> "IMPORTANT: BE CONCISE AND AVOID VERBOSITY. BREVITY IS CRITICAL. Minimize output tokens as much as possible while maintaining helpfulness, quality, and accuracy."
> "NEVER DO MORE THAN USER ASKS FOR, NEVER EXPLAIN WHY YOU DO SOMETHING UNLESS THE USER ASKS FOR IT, JUST USE A SINGLE METHOD TO IMPLEMENT A FUNCTION UNLESS THE USER REQUESTS MORE"
> "Default to replace_in_file for most changes. It's the safer, more precise option that minimizes potential issues."
> "Make targeted edits to specific parts of an existing file without overwriting the entire file."
> "When tasks are ambiguous, ask specific clarifying questions rather than making assumptions."
> "Analyze the user's task and set clear, achievable goals to accomplish it. Prioritize these goals in a logical order."

### 1.3 重叠度结论

基于上表，可以得出几个事实判断：

第一，Karpathy 的四项原则在主流工具的系统提示词中并非空白。这本质是重复注入语义高度重叠的指令

第二，重叠度分布不均。Cursor 在代码质量的提纲挈领层面留白较多，Karpathy-skills 在 Cursor 上确实填补了空白；Claude Code 和 CodeBuddy 已经内建了核心，再添加反而冗余

第三，部分工具的设计取向与 Karpathy 立意相悖。Qoder 的 Background Agent 模式明确反对"先问澄清"，Z.ai Code 明确禁止写测试。这反映了不同产品对"严谨"与"快速"的不同权衡，不存在谁比谁更高贵

---

## 2. 长上下文与多 Plugin 场景下的规则执行率

规则文件写在 `CLAUDE.md` 里，不等于模型会执行。这一节用公开研究数据说明执行率问题。

### 2.1 注意力稀释的数学基础

出处：[Attention Dilution](https://binzhango.github.io/posts/2026/03-15-attention-dilution)（2026-03 博客，基于 Transformer 自注意力公式推导）。

自注意力的核心公式为（由ai抓取并梳理）：

```
attention_weight(q, k_i) = softmax(q · k_i) = exp(q·k_i) / Σ exp(q·k_j)
```

softmax 的分母是所有 key 的和，意味着 attention 权重总和恒为 1。当 context 中 token 数量增加，且相关 token 的 logit 优势不够极端时，每个 token 分到的注意力权重会被稀释。

该文给出的模拟数据：假设有一个相关 token，logit 优势 +2.0，其他 token 中性：

| Context size | 该 token 获得的注意力 |
|---|---|
| N = 10 | 约 45.1% |
| N = 100 | 约 6.9% |
| N = 1000 | 低于 1% |

说人话就是，agent在处理过长的上下文时（即便进行了压缩），可能会将你设定的规则在整体中的权重减小到到无法主导生成行为。模型甚至会直接输出违反规则的产物

### 2.2 NoLiMa：去掉字面匹配后，长上下文检索迅速崩塌

出处：论文 *NoLiMa: Long-Context Evaluation Beyond Literal Matching*（Modarressi et al., ICML 2025，[arxiv.org/abs/2502.05167](https://arxiv.org/abs/2502.05167)，代码与完整数据见 [github.com/adobe-research/NoLiMa](https://github.com/adobe-research/NoLiMa)）。

传统的 Needle-in-a-Haystack（NIAH）测试有一个缺陷：问题与"针"之间存在字面匹配，模型可以靠表面词重合轻松定位，导致分数虚高。NoLiMa 刻意消除了字面重叠，要求模型通过潜在语义关联来检索，更接近真实工作负载。该论文测试了 13 个声称支持 128K 以上上下文的模型，结论是：短上下文（小于 1K）时所有模型表现良好；32K 时 11 个模型降到短上下文基线的 50% 以下；即便加入 reasoning 或 Chain-of-Thought 提示，模型在长上下文中仍难以维持性能。论文给出的根本原因与第 2.1 节的数学推导一致：当缺少字面匹配作为锚点时，注意力机制在长上下文中更难检索相关信息。

简单而言，问题和答案在用词上有重合，模型可以靠词面重合定位答案，不需要真正理解语义。而NoLiMa 论文的核心贡献就是消除了这种字面匹配——故意让问题和答案在用词上尽量不重合，逼模型靠语义关联来检索

NoLiMa 论文本身测试的模型（GPT-4o/4.1、Claude 3.5 Sonnet、Gemini 1.5/2.5、Llama 3.x/4 等）在目前看来已偏旧，但其方法论被后续研究延续到新一代模型上，结论一致。下一节给出 2026 年新模型上的衰减证据。

### 2.3 2026 年新模型上的衰减证据

NoLiMa 之后的多项研究在 GPT-5 系列、Claude 4.5/4.6/4.8、Gemini 2.5 Pro/3 Pro 等新一代模型上重复验证了长上下文衰减。以下是关键数据。

**Claude Opus 4.6 在 1M token 上的多跳衰减**（出处：[decodedaitech.com/context-rot-drops-claude-to-78-accuracy-at-1m-tokens](https://decodedaitech.com/context-rot-drops-claude-to-78-accuracy-at-1m-tokens)，转述自技术记者 Timothy B. Lee 的分析）：

Opus 4.6 在 1M token 上的单次检索准确率约 78.3%，Anthropic 称之为"定性跃升"。但生产任务很少是单次检索。一个重构模块的编码 agent 需要同时召回函数签名、类型约束、错误处理约定等多条信息。按 78.3% 的单次准确率计算，三跳任务成功率只有 48%（0.783 的三次方），五跳任务降到 29.4%。宣传的 78.3% 描述的是单次查找；对于真正需要百万 token 窗口的多跳工作负载，有效准确率接近抛硬币。

**Claude Sonnet 4.5 的 U 型曲线复现**（出处：[dev.to/gabrielanhaia/lost-in-the-middle-is-still-real-in-2026-even-on-1m-token-models-2ehj](https://dev.to/gabrielanhaia/lost-in-the-middle-is-still-real-in-2026-even-on-1m-token-models-2ehj)，2026 年发表）：

该文用 40 行 Python 脚本在 Claude Sonnet 4.5 上复现了经典 lost-in-the-middle 效应。在 200 个干扰块的标准测试中，针（指藏在大量干扰文本里的一个关键信息）位于上下文边缘时召回率约 90% 以上，位于中间时出现明显下降。文章同时引用 RULER 基准（NVIDIA提出的长上下文基准 Hsieh et al., 2024）的结论：RULER 测试了 17 个长上下文模型，全部显示随输入长度增长的召回衰减；LongBench v2 和 HELMET 等多文档基准在 2025 年代前沿模型上持续观测到 lost-in-the-middle 模式。原文为："Bigger windows moved the middle further out. They did not get rid of it."（更大的窗口只是把中间推得更远，没有消除中间。）

**GPT-5-mini 与 Claude 4.5-haiku 的位置敏感度**（出处：论文 *Not All Needles Are Found*，[semanticscholar.org/reader/4ce0964ce43c38062a5417e163b8070bd7f5429e](https://semanticscholar.org/reader/4ce0964ce43c38062a5417e163b8070bd7f5429e)）：

该论文测试了 ChatGPT-5-mini、Claude-4.5-haiku、Gemini-2.5-flash、Deepseek-v3.2-chat 四个模型在不同信息深度下的表现。关键发现：

ChatGPT-5-mini 在 50% 深度处出现"performance cliff"，字面提取与逻辑推理准确率骤降至约 80%，表现出对中间位置 token 的特定架构敏感度。

Claude-4.5-haiku 表现出最明显的 U 型曲线，逻辑推理在 20% 到 60% 深度区间准确率降至近 50%，是经典的 lost-in-the-middle 现象。

在"Normal"和"Lorentzian"等中央聚簇分布下，ChatGPT-5-mini 在反幻觉提示下的字面提取与逻辑推理准确率崩溃至 0%，表明当证据集中而非分散时，注意力机制或安全过滤器可能将密集簇标记为噪声。

**NVIDIA RULER 与 Chroma 研究的跨模型对比**（出处：[morphllm.com/claude-context-window](https://www.morphllm.com/claude-context-window)，2026-07，综合 NVIDIA RULER 与 Chroma 研究）：

NVIDIA RULER 基准给出：大多数模型的有效上下文是宣传容量的 50-65%，宣传 200K token 的模型通常在 130K 左右开始不可靠。Chroma 的跨模型研究给出了衰减速率排序：Claude 模型"decay the slowest overall"，GPT 模型"more erratic with random mistakes and outright refusals"，Gemini"starts to mess up earlier with wild variations"。2026 年 7 月的模型对比表显示，Gemini 3 Pro 在自家 eval card 上 1M token 准确率只有 26.3%，而 GPT-4.1 在 900K 单针检索上声称 100% 但在复杂任务上 erratic，Gemini 2.5 Pro 在 1M 上召回 99.7% 但推理任务早期退化。

**工业基准 NIAH-2 / MRCR v2 的横向对比**（出处：[digitalapplied.com/blog/long-context-retrieval-needle-in-haystack-2026](https://www.digitalapplied.com/blog/long-context-retrieval-needle-in-haystack-2026)，覆盖 GPT-5.5、Gemini 3、Claude Opus 4.7、DeepSeek V4-Pro；[dev.to/owen_fox/long-context-llm-benchmarks-2026](https://dev.to/owen_fox/long-context-llm-benchmarks-2026-which-model-actually-holds-accuracy-past-200k-tokens-17ka)；[friday-go.icu/ai/llm-long-context-ruler-mrcr-2026](https://friday-go.icu/ai/llm-long-context-ruler-mrcr-2026)）：

| 模型 | 单针 1M（具有误导性，因为它太简单了） | 8 针 1M | RULER 256K |
|---|---|---|---|
| Gemini 3 Deep Think | 99% | 89% | 80% 以上 |
| GPT-5.5 | 96% | 74% | 80% 以下 |
| Claude Opus 4.7 | 89% | 56% | 80% 以下 |
| DeepSeek V4-Pro | 78% | 41% | 80% 以下 |

第一，单针分数具有误导性。所有模型在单针检索上得分尚可，但多针（8 针）检索分数骤降 20-40 分。真实 agent 工作负载是多针的（需要整合多个文件、多轮工具调用的信息），单针分数不能反映实际表现。

第二，宣传窗口与有效窗口存在 30-60 分鸿沟。除 Gemini 3 Deep Think 外，所有模型从 200K 到 1M 都有 30-60 分的检索衰减。2026 年 6 月的综合评测给出有效窗口估算（出处：friday-go.icu）：Gemini 3 Pro 有效约 280K（宣传 1M），Claude Opus 4.8 有效约 450K（宣传 1M），GPT-5.5 有效约 380K（宣传 1M）。

第三，代际提升的真实幅度。Claude Opus 4.6 在 MRCR v2 8 针 1M 上约 76-78%，是前代 Sonnet 4.5 的 18.5% 的四倍（出处：dev.to/owen_fox）。这是同公司跨代的最大跃升之一，但即便如此，1M token 仍不能视为可靠工作区。dev.to 的基准对比明确指出：128K 以内前沿模型接近一致；256K-1M 的可靠使用，当时只有 Claude Opus 4.6 维持 70% 以上。

2026 年 3 月 *Frontier* 杂志的评论（转述自 [grapeot.me/share/long-context-benchmark-en-20260315.html](https://grapeot.me/share/long-context-benchmark-en-20260315.html)）概括了行业共识：

> "The context-window arms race is over. The context-reliability race is the real story now. And it's a harder problem. Stuffing a million tokens into a window is engineering. Getting the model to actually use what's buried at token 600,000 is science."

（上下文窗口军备竞赛已经结束。上下文可靠性竞赛才是真正的故事，而且更难。把一百万 token 塞进窗口是工程问题，让模型真正用到埋在token深处的内容是一个问题）

规则文件在多 plugin 场景下的实际位置，通常恰好在 system prompt 中段：前面是产品自带的 system prompt 与 tool schemas，后面是用户最新请求和工具输出。基于上述基准数据，这个位置正是检索衰减最严重的区域。把关键约束埋在这里，等于主动放弃了它的执行率。

### 2.4 禁止类约束衰减更快

出处：论文 *Omission Constraints Decay While Commission Constraints Persist in Long-Context LLM Agents*（评述见 [themoonlight.io/review/omission-constraints-decay-while-commission-constraints-persist-in-long-context-llm-agents](https://www.themoonlight.io/review/omission-constraints-decay-while-commission-constraints-persist-in-long-context-llm-agents)）。

该研究区分两类约束：

要求类约束（commission constraints，"必须做 X"）：模型在自己的输出中会重复出现相关语义，获得 in-context auto-reinforcement，衰减较慢。

禁止类约束（omission constraints，"不要做 X"）：模型输出中不会主动重复"我没做 X"，缺乏自我强化，衰减显著更快。

Karpathy 的四项原则中，Surgical Changes 整条都是禁止类（"Don't improve adjacent code"、"Don't refactor things that aren't broken"、"Don't remove pre-existing dead code"）。在长上下文中，这条规则最先失效，而它恰恰是 Karpathy 最在意的那条。

论文给出的工程缓解措施：在每个 Safe Turn Depth 之前重新注入禁止类约束，或设置 Safe Token Budget 限制会话长度。这要求修改 agent 框架本身，不是写规则文件能解决的。

### 2.5 实战修复率统计

出处：[deadends.dev/llm/system-prompt-ignored-long-context](https://deadends.dev/llm/system-prompt-ignored-long-context)（2026-02-24 验证，基于 3 个来源汇总）。

| 策略 | 失败率 / 成功率 |
|---|---|
| 把所有指令放 system prompt 然后信任模型 | 82% 失败 |
| 扩大 context window 容纳更多指令 | 75% 失败（加剧 lost-in-the-middle） |
| 关键指令在 prompt 结尾再重复一次 | 90% 成功 |
| 用 structured output / json_schema 强制格式 | 92% 成功 |
| 长上下文分块迭代处理 | 85% 成功 |

"把规则写进 md 然后信任模型"正是失败率最高的策略。

### 2.6 本节结论

基于上述公开研究，规则文件在长上下文与多 plugin 场景下的执行率是概率性的，且会随 context 增长而衰减。这不是 Karpathy-skills 特有的问题，而是所有规则文件的共同局限。把工程质量的保障完全压在规则文件上，是对 LLM 工作机制的误解

---

## 3. 工程闭环：从 Claude Code 源码泄露看真正的约束机制

2026-03-31，Anthropic 因 npm 包打包失误泄露了 Claude Code 约 51.2 万行 TypeScript 源码（出处：[stcn.com/article/detail/3719868](https://www.stcn.com/article/detail/3719868)、[finance.sina.com.cn/cj/2026-04-01/doc-inhtaemy2095577.shtml](https://finance.sina.com.cn/cj/2026-04-01/doc-inhtaemy2095577.shtml)、Sebastian Raschka 分析 [sebastianraschka.com/blog/2026/claude-code-secret-sauce.html](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html)）。这份泄露揭示了一个关键事实：Anthropic 自己并不主要依赖规则文件约束模型行为，而是用了一整套工程机制。

### 3.1 硬约束下沉到代码

出处：机器之心报道转述泄露源码分析。

- `tools/BashTool/bashSecurity.ts` 长度约 2592 行，实现 42 项独立安全检查。这意味着"不要执行危险命令"这条约束，主要由代码层强制，而非依赖 prompt。
- 构建期使用 `excluded-strings.txt` 做金丝雀检查，禁止某些字符串出现在产物中，一旦发现直接构建失败。
- 验证 Agent 机制：涉及 3 个以上文件或后端/基础设施改动时，自动拉起独立验证 agent 检查结果，主 agent 还要再抽查。这是 Goal-Driven Execution 的工程化实现，而不是写在 prompt 里。

### 3.2 Prompt Cache 边界管理

出处：同上。

源码中存在 `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`，把 system prompt 切成两部分：上半部分静态可缓存，放核心规则；下半部分动态，放当前状态。更关键的是，MCP 服务器相关指令被从 system prompt 移除，改为通过 message 的增量附加传递，原因是如果放在 system prompt 里，每次有 MCP 服务器连接或断开都会导致缓存失效，且加剧 system prompt 膨胀。

这意味着在 Claude Code 上以 plugin 形式安装 Karpathy-skills，规则会被塞进本应保持静态精简的 system prompt 上半部分，破坏缓存边界设计。

### 3.3 autoDream 记忆整合

出处：同上。

`services/autoDream/autoDream.ts` 实现跨会话后台记忆整合。用户空闲时 fork 子 agent 运行 `/dream`，把历史会话压缩为 10 个结构化模块，每个不超过 2000 token，总体不超过 12000 token。触发条件：累计 10000 token 首次触发，之后每增加 5000 token 或每 3 次工具调用触发一次。这表明 Anthropic 的态度是：长 context 不可靠，必须周期性压缩，而不是在长 context 里堆规则。

### 3.4 熔断比规则重要

出处：泄露源码注释，转述自机器之心报道。

源码注释中有一条真实工程记录：

> "BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures (up to 3,272) in a single session, wasting ~250K API calls/day globally."

解法不是在 prompt 里写"失败时不要无限重试"，而是设置 `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3` 硬熔断。规则治不了的问题，工程阈值能治。

### 3.5 本节结论

Claude Code 源码泄露提供的启示是：产品质量的保障主要来自工程闭环（lint、CI、pre-commit hook、独立验证 agent、prompt cache 边界、熔断阈值、记忆整合），而不是来自一份精心编写的规则文件。规则文件是其中一环，但不是主要一环。新手如果只盯着规则文件，会错过这套更重要的机制

---

## 4. Vibe Coding 与"先想再写"的张力

Karpathy-skills 的内核是"caution over speed"（出处：仓库 README 原文 "These guidelines bias toward caution over speed"）。但绝大多数真实 vibecoder 的工作流不是这样的。

### 4.1 Karpathy 自己就是 vibe coding 的提出者

出处：Karpathy 2025 年初推文（ widely cited，转述见多个来源）。

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists... I just talk to Composer with SuperWhisper so I barely even touch the keyboard... I 'Accept All' [AI edits], always 'Accept', I don't read the diffs."

Karpathy 本人在原型场景下是 vibe coding 的实践者。把他批评 LLM 的一段话抽出来做成"caution over speed"的全局规则，等于把他生产场景下的严谨态度套到原型场景上，存在场景错配。这不是说 Karpathy 的批评不对，而是说同一套原则不能无差别套用。

### 4.2 工具设计取向的差异

第 1 节的数据已经显示，不同工具对"严谨 vs 快速"的取舍不同：

- Qoder 的 Background Agent 模式明确反对"先问澄清"，强调自主推进（出处：Quest Action.txt 原文）。
- Z.ai Code 明确禁止写测试，强调先让用户看到结果（出处：prompt.txt 原文）。
- Claude Code 和 CodeBuddy 倾向严谨，内建了 simplicity 和 surgical 类规则。
- Cursor 在代码质量哲学上留白，把选择权交给用户。

这些差异反映了产品对目标用户的不同假设。Qoder 和 Z.ai Code 面向的是想要快速产出的 vibecoder，Claude Code 和 CodeBuddy 面向的是更看重工程严谨性的开发者。不存在谁比谁高贵，只是场景不同

### 4.3 "大胆假设"有时是必要的

对于目前许多vibecoder的真实工作流是：让 AI 大胆给出一个实现，跑起来看效果，不行就换方向再来，几轮迭代后收敛到可用版本。这个流程里，"不要假设、要澄清"反而拖慢节奏。vibe的核心就是快速失败、反复学习，不是一次做对

Karpathy-skills 的 Think Before Coding 在这个场景下会要求 AI 在第一轮就停下来问三个澄清问题，而许多vibecoder想要的是"你先跑起来我再告诉你哪里不对"。这是需求的冲突，不是谁对谁错

### 4.4 Surgical Changes 在 agent 时代的取舍

现代 agent 编程的核心价值之一，是能跨文件重构、清理相邻错误代码、做 senior engineer 会顺手做的小改进。强制"只动该动的"会损失这个杠杆。

特别是"发现无关死代码只提不删"这一条，有待商榷。真实工程里，senior engineer看到typo也会顺手改。让 agent 看到了却不动手，等于把 agent 降级成需要 micromanage 的实习生

Karpathy 原话批评的是"change/remove comments and code they don't sufficiently understand"（出处：原推文）。关键词是"don't sufficiently understand"。问题不在"动了无关代码"，而在"动了不理解的代码"。karpathy-skills 把它简化成"什么无关代码都别动"，是对原意的收窄

---

## 5. 给新手的核心建议

把注意力从"写一份完美的规则文件"转移到"建立完整的工程闭环"上。规则文件是闭环中的一环，但不是主要一环

### 5.1 优先建立工程闭环

对以下方面的投入回报远高于打磨规则文件：

第一，lint 与类型检查。能用 ESLint、Ruff、TypeScript strict mode 约束的（命名、格式、import 顺序、类型安全），写进配置文件，由编辑器和 CI 强制，不要写进 `CLAUDE.md`。这是确定性约束

第二，pre-commit hook。能用 git hook 拦截的（测试失败、type 错误、格式不符），写进 `.husky/pre-commit` 或类似机制。这是在 AI 输出之后、代码进入仓库之前的一道闸门

第三，CI 流水线。能用 GitHub Actions / GitLab CI 强制的（覆盖率、构建通过、安全扫描），写进流水线配置。这是团队级的强制

第四，独立验证机制。对于复杂改动，设置独立的验证步骤（可以是另一个 agent 调用，也可以是人工 review）。Claude Code 内建了这种机制（出处：源码泄露），其他工具需要手动配置

第五，才是规则文件。规则文件只放"模型在生成代码时需要主动查询的项目特定信息"，例如"这个项目用 TypeScript strict mode"、"错误处理遵循 `src/utils/errors.ts` 的模式"、"这个 codebase 不允许新增 any 类型"。这些是模型需要知道才能正确生成的信息，不是行为约束

### 5.4 Token 压缩优先于规则完整性

基于第 2 节的注意力稀释数据，规则越短，每条规则分到的注意力权重越集中。60 行的规则文件里，中段规则几乎一定会被稀释；20 行的规则文件，每条都还有机会被注意到

如果一定要写规则文件，把 Karpathy-skills 的 60 行压缩到 20 行以内，只保留核心动词，去掉解释性文字。模型对简短指令的执行率，高于对详细解释的执行率

### 5.5 关键约束在请求结尾重复

基于第 2.5 节的修复率数据，关键禁止类约束应该在每次请求的结尾再重复一次，而不是只放在 system prompt 里。例如："实现这个功能。注意：不要动 `legacy/` 目录下的任何文件。"

结尾重复的成功率约 90%，只放 system prompt 的失败率约 82%。这是同一个规则在不同位置的执行率差异。

---

## 6. 结语

Karpathy-skills的这份md精准识别了 LLM 编程的四大通病（默默假设、过度复杂、越界改动、缺乏验证），用极简的方式让新手理解"为什么 AI 总会把代码写成一团"。作为教学材料，它有巨大价值

但它做不到很多新手以为它能做到的事。它不能替代 lint、CI、pre-commit hook、独立验证 agent 这些工程机制。它不能在长上下文与多 plugin 场景下保证被严格执行。它不能无差别套用到所有工程场景，因为不同场景对严谨与快速的需求不同

新手真正应该投入精力的，是理解 AI 编程的操作逻辑：模型在长 context 下注意力如何分布，规则文件在不同位置的执行率差异，硬约束如何下沉到代码层，工程闭环如何替代 prompt 约束。把这些想清楚之后，规则文件自然会成为闭环中的一环，而不是被当作救命稻草

Karpathy 的批评值得听。但把他的批评做成一份默认开启的全局规则文件，是对 LLM 工作机制和现代工程实践的双重误解。规则文件只是一点，不是全部

---

## 附录 A：数据出处

### 项目与仓库

- Karpathy-skills 项目：[github.com/multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
- Karpathy 原推文：[x.com/karpathy/status/2015883857489522876](https://x.com/karpathy/status/2015883857489522876)
- 系统提示词收集仓库（138k star）：[github.com/x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)
- OpenAI Codex 开源仓库：[github.com/openai/codex](https://github.com/openai/codex)
- Codex prompts 模板目录：[github.com/openai/codex/tree/main/codex-rs/prompts/templates](https://github.com/openai/codex/tree/main/codex-rs/prompts/templates)

### 各家系统提示词原文

- Cursor Agent Prompt 2.0（2025-11）：[raw.githubusercontent.com/.../Cursor%20Prompts/Agent%20Prompt%202.0.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Cursor%20Prompts/Agent%20Prompt%202.0.txt)
- Qoder Quest Action（2025-08）：[raw.githubusercontent.com/.../Qoder/Quest%20Action.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Qoder/Quest%20Action.txt)
- Z.ai Code prompt（2025-07）：[raw.githubusercontent.com/.../Z.ai%20Code/prompt.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Z.ai%20Code/prompt.txt)
- CodeBuddy Craft Prompt（2025-08）：[raw.githubusercontent.com/.../CodeBuddy%20Prompts/Craft%20Prompt.txt](https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/CodeBuddy%20Prompts/Craft%20Prompt.txt)

### Claude Code 源码泄露

- 证券时报报道：[stcn.com/article/detail/3719868](https://www.stcn.com/article/detail/3719868)
- 虎嗅深度分析：[finance.sina.com.cn/cj/2026-04-01/doc-inhtaemy2095577.shtml](https://finance.sina.com.cn/cj/2026-04-01/doc-inhtaemy2095577.shtml)
- 机器之心源码解读：[cj.sina.cn/articles/view/3996876140/ee3b7d6c001016qoo](https://cj.sina.cn/articles/view/3996876140/ee3b7d6c001016qoo)
- Sebastian Raschka 分析：[sebastianraschka.com/blog/2026/claude-code-secret-sauce.html](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html)

### OpenAI Codex

- Ars Technica 关于 GPT-5.5 base_instructions 的报道：[arstechnica.com/ai/2026/04/openai-codex-system-prompt-includes-explicit-directive-to-never-talk-about-goblins](https://arstechnica.com/ai/2026/04/openai-codex-system-prompt-includes-explicit-directive-to-never-talk-about-goblins)
- OpenAI 官方博客《Unrolling the Codex agent loop》：[openai.com/jv-ID/index/unrolling-the-codex-agent-loop](https://openai.com/jv-ID/index/unrolling-the-codex-agent-loop)
- GPT-5.5 "地精问题"溯源：[akiraxclaw.com/blog/gpt-55-codex-goblin-problem](https://akiraxclaw.com/blog/gpt-55-codex-goblin-problem)

### 注意力稀释与长上下文研究

- Attention Dilution 博客（含数学推导）：[binzhango.github.io/posts/2026/03-15-attention-dilution](https://binzhango.github.io/posts/2026/03-15-attention-dilution)
- NoLiMa 论文（ICML 2025）：[arxiv.org/abs/2502.05167](https://arxiv.org/abs/2502.05167)
- NoLiMa 代码与完整数据：[github.com/adobe-research/NoLiMa](https://github.com/adobe-research/NoLiMa)
- Claude Opus 4.6 在 1M token 上的 context rot 分析：[decodedaitech.com/context-rot-drops-claude-to-78-accuracy-at-1m-tokens](https://decodedaitech.com/context-rot-drops-claude-to-78-accuracy-at-1m-tokens)
- Lost in the Middle 在 2026 年 Claude Sonnet 4.5 上的复现：[dev.to/gabrielanhaia/lost-in-the-middle-is-still-real-in-2026-even-on-1m-token-models-2ehj](https://dev.to/gabrielanhaia/lost-in-the-middle-is-still-real-in-2026-even-on-1m-token-models-2ehj)
- Not All Needles Are Found 论文（GPT-5-mini / Claude 4.5-haiku 位置敏感度）：[semanticscholar.org/reader/4ce0964ce43c38062a5417e163b8070bd7f5429e](https://semanticscholar.org/reader/4ce0964ce43c38062a5417e163b8070bd7f5429e)
- 2026 年 Claude 上下文窗口综合分析（含 NVIDIA RULER 与 Chroma 研究）：[morphllm.com/claude-context-window](https://www.morphllm.com/claude-context-window)
- 2026 年 NIAH-2 / RULER / MRCR v2 基准测试：[digitalapplied.com/blog/long-context-retrieval-needle-in-haystack-2026](https://www.digitalapplied.com/blog/long-context-retrieval-needle-in-haystack-2026)
- 2026 年长上下文 LLM 基准对比：[dev.to/owen_fox/long-context-llm-benchmarks-2026](https://dev.to/owen_fox/long-context-llm-benchmarks-2026-which-model-actually-holds-accuracy-past-200k-tokens-17ka)
- 2026-03 长上下文基准跨模型分析：[grapeot.me/share/long-context-benchmark-en-20260315.html](https://grapeot.me/share/long-context-benchmark-en-20260315.html)
- 2026 年 RULER 与 MRCR v2 评测体系解读：[friday-go.icu/ai/llm-long-context-ruler-mrcr-2026](https://friday-go.icu/ai/llm-long-context-ruler-mrcr-2026)
- Omission Constraints Decay 论文评述：[themoonlight.io/review/omission-constraints-decay-while-commission-constraints-persist-in-long-context-llm-agents](https://www.themoonlight.io/review/omission-constraints-decay-while-commission-constraints-persist-in-long-context-llm-agents)
- 实战修复率统计：[deadends.dev/llm/system-prompt-ignored-long-context](https://deadends.dev/llm/system-prompt-ignored-long-context)

### 待验证项

- OpenAI Codex 的模块化 prompt 文件中是否在某处包含与 Karpathy 四原则明确对应的表述：本文未完成 `codex-rs/prompts/templates/` 下全部文件的逐条核对，标注为待验证。

---

初稿写于 2026-07-17，基于公开资料整理。如有数据出处错误或事实偏差，欢迎指正
