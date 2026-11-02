# Agent security kit

Files you copy into your own repository so your coding agent works inside security rules.

| File | Purpose |
|---|---|
| [SECURITY-RULES.md](SECURITY-RULES.md) | Rules the agent reads every session: secrets, access control, input and output, AI features, dependencies, commands |
| [claude/settings.json](claude/settings.json) | Claude Code permission deny and ask lists |

## What the deny list does and does not do

- `Read` and `Edit` deny rules block Claude Code's file tools, and shell commands it recognises such as `cat`, `head`, and `sed`, from touching `.env` files and keys.
- They do not stop a script that opens the file itself, such as a Node or Python one-liner.
- Bash rules match the command as written. `Bash(rm -rf *)` stops `rm -rf build`, not `bash -c 'rm -rf build'`.
- For a boundary that holds against any command, turn on Claude Code's sandbox as well. See the Claude Code sandboxing documentation.

Treat the deny list as a seat belt, not a vault. Keep production credentials off your laptop.
