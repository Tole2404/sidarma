# AI Coding Instructions

## Goal

Optimize for:

- minimal token usage
- fast iteration
- concise responses
- targeted code edits
- efficient debugging

---

## RTK Usage

Always prefer RTK commands when available.

Preferred commands:

- rtk ls
- rtk read <file>
- rtk grep "<keyword>" .
- rtk git status
- rtk git diff
- rtk npm test
- rtk pytest
- rtk find <symbol>

Never use raw large-output commands unless absolutely necessary.

---

## Repository Access Rules

- Never scan the entire repository.
- Never read large files fully unless required.
- Prefer targeted reads and symbol-based inspection.
- Avoid repeatedly reading unchanged files.
- Ignore:
  - node_modules
  - dist
  - build
  - coverage
  - package-lock
  - yarn.lock
  - generated files

Focus only on files related to the current task.

---

## Debugging Rules

- Identify probable root cause first.
- Avoid exploratory debugging.
- Inspect the smallest possible scope.
- Apply minimal working fixes.
- Re-test only impacted functionality.
- Summarize logs instead of dumping raw output.

---

## Code Change Rules

- Prefer concise patches over full rewrites.
- Reuse existing architecture and patterns.
- Avoid unnecessary refactors.
- Avoid unnecessary dependencies.
- Keep implementations modular and maintainable.
- Only modify related files.

---

## Response Rules

- Keep responses short and direct.
- Avoid long explanations.
- Summarize only important findings.
- Do not repeat known context.
- Focus on execution.

---

## Performance Rules

- Minimize context usage.
- Avoid excessive tool calls.
- Avoid reading unrelated files.
- Avoid generating redundant code.
- Use efficient search before reading files.

---

## Preferred Workflow

1. Understand the task.
2. Identify relevant files.
3. Read minimal context.
4. Explain short plan.
5. Implement focused changes.
6. Validate efficiently.
7. Return concise summary.
