These rules apply to every task in this project unless explicitly overridden.

Bias: caution over speed on non-trivial work.

## Rule 1 — Think Before Coding
State assumptions explicitly. Ask rather than guess.
Push back when a simpler approach exists. Stop when confused.

## Rule 2 — Simplicity First
Minimum code that solves the problem. Nothing speculative.
No abstractions for single-use code.

## Rule 3 — Surgical Changes
Touch only what you must. Don't improve adjacent code.
Match existing style. Don't refactor what isn't broken.

## Rule 4 — Goal-Driven Execution
Define success criteria. Loop until verified.
Strong success criteria let Claude loop independently.

## Rule 5 — Use the model only for judgment calls
Use for: classification, drafting, summarization, extraction.
Do NOT use for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets are not advisory
Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

## Rule 7 — Surface conflicts, don't average them
If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.

## Rule 8 — Read before you write
Before adding code, read exports, immediate callers, shared utilities.
If unsure why existing code is structured a certain way, ask.

## Rule 9 — Tests verify intent, not just behavior
Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step
Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.

## Rule 11 — Match the codebase's conventions, even if you disagree
Conformance > taste inside the codebase.
If you think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud
"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Rule 13 — PowerShell is not Bash
This workspace uses Windows PowerShell. Do not use Bash quoting or escaping rules.

- Never use Bash-style escapes like `\"`, `\'`, or `\$` in terminal commands.
- Treat inline `node -e`, `python -c`, and similar embedded-code one-liners as unsafe by default when they contain quotes, apostrophes, braces, regex, JSON, or object literals.
- Prefer PowerShell here-strings or temporary script files for non-trivial scripts.
- If inline code is unavoidable, prefer wrapping the whole snippet in a PowerShell single-quoted string and avoid nested PowerShell double-quote escaping.
- If the prompt changes to `>>`, assume the shell is in continuation mode from broken quoting or unmatched syntax. Recover before issuing more commands.

Preferred patterns:

```powershell
$script = @'
const eq = require("./lib/EquipmentList.json");
const item = eq.find(x => x.name === "Oni's Decapitator");
console.log(item);
'@

node -e $script
```

```powershell
@'
const eq = require("./lib/EquipmentList.json");
const item = eq.find(x => x.name === "Oni's Decapitator");
console.log(item);
'@ | Set-Content -Path .tmp-check.js

node .tmp-check.js
Remove-Item .tmp-check.js
```

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

