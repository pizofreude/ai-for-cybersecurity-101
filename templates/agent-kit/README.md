# Agent security kit

Files you copy into your own repository so your coding agent works inside security rules.

| File | Purpose |
|---|---|
| [SECURITY-RULES.md](SECURITY-RULES.md) | Rules the agent reads every session: secrets, access control, input and output, AI features, dependencies, commands |
| [claude/settings.json](claude/settings.json) | Claude Code permission deny and ask lists |
| [claude/CLAUDE.md](claude/CLAUDE.md) | Section appended to your `CLAUDE.md` that imports the rules |
| [cursor/cursorignore](cursor/cursorignore) | Lines merged into your `.cursorignore` |
| [cursor/security.mdc.header](cursor/security.mdc.header) | Front matter for the always-on Cursor rule built from the rules file |
| [codex/AGENTS.section.md](codex/AGENTS.section.md) | Section appended to your `AGENTS.md`, followed by the rules |
| [security-review.md](security-review.md) | Pre-commit security review prompt for any agent, installed as `.agent-kit/security-review.md` |
| [claude/commands/ship-review.md](claude/commands/ship-review.md) | The same review as a Claude Code `/ship-review` command |
| [hooks/pre-commit](hooks/pre-commit) | gitleaks on staged changes, then the new-dependency check. Installed with `--hooks` |
| [hooks/check-new-packages.mjs](hooks/check-new-packages.mjs) | Blocks a new dependency until it is listed in `.vetted-packages.txt`, requires a lockfile, and shows package age and repository from the npm registry |
| [hooks/vetted-packages.txt](hooks/vetted-packages.txt) | Starter list of checked packages |
| [install.sh](install.sh) | Copies or merges the files above into your repository without overwriting anything |

## What the deny list does and does not do

- `Read` and `Edit` deny rules block Claude Code's file tools, and shell commands it recognises such as `cat`, `head`, and `sed`, from touching `.env` files and keys.
- They do not stop a script that opens the file itself, such as a Node or Python one-liner.
- Bash rules match the command as written. `Bash(rm -rf *)` stops `rm -rf build`, not `bash -c 'rm -rf build'`.
- For a boundary that holds against any command, turn on Claude Code's sandbox as well. See the Claude Code sandboxing documentation.

Treat the deny list as a seat belt, not a vault. Keep production credentials off your laptop.
