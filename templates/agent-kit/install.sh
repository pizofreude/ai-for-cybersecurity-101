#!/bin/sh
# Installs the agent security kit into your own repository.
#
#   sh templates/agent-kit/install.sh <path-to-your-repo> <claude|cursor|codex|all> [--hooks]
#
# It never overwrites a file you already have. When a file exists, it appends what is
# missing, or prints what to merge by hand.
set -eu

KIT=$(cd "$(dirname "$0")" && pwd)
TARGET=${1:-}
AGENT=${2:-}
HOOKS=${3:-}

if [ -z "$TARGET" ] || [ -z "$AGENT" ]; then
  echo "usage: sh templates/agent-kit/install.sh <path-to-your-repo> <claude|cursor|codex|all> [--hooks]" >&2
  exit 2
fi
if [ ! -d "$TARGET/.git" ]; then
  echo "error: $TARGET is not the root of a git repository" >&2
  exit 2
fi
case "$AGENT" in claude|cursor|codex|all) ;; *) echo "error: agent must be claude, cursor, codex, or all, got: $AGENT" >&2; exit 2 ;; esac
TARGET=$(cd "$TARGET" && pwd)

copy_once() { # src dest
  if [ -e "$2" ]; then
    echo "  kept   ${2#$TARGET/} (already exists)"
  else
    mkdir -p "$(dirname "$2")"
    cp "$1" "$2"
    echo "  added  ${2#$TARGET/}"
  fi
}

append_missing_lines() { # src dest
  mkdir -p "$(dirname "$2")"
  touch "$2"
  added=0
  while IFS= read -r line || [ -n "$line" ]; do
    [ -z "$line" ] && continue
    if ! grep -qxF "$line" "$2"; then
      printf '%s\n' "$line" >> "$2"
      added=$((added + 1))
    fi
  done < "$1"
  echo "  merged ${2#$TARGET/} ($added line(s) added)"
}

append_block_once() { # marker dest blockfile
  touch "$2"
  if grep -qF "$1" "$2"; then
    echo "  kept   ${2#$TARGET/} (kit section already present)"
  else
    { [ -s "$2" ] && printf '\n'; cat "$3"; } >> "$2"
    echo "  merged ${2#$TARGET/} (kit section appended)"
  fi
}

echo "Installing the agent security kit into $TARGET"
copy_once "$KIT/SECURITY-RULES.md" "$TARGET/SECURITY-RULES.md"
copy_once "$KIT/security-review.md" "$TARGET/.agent-kit/security-review.md"

if [ "$AGENT" = claude ] || [ "$AGENT" = all ]; then
  echo "Claude Code:"
  if [ -e "$TARGET/.claude/settings.json" ]; then
    echo "  kept   .claude/settings.json (already exists). Merge the permissions from $KIT/claude/settings.json by hand."
  else
    copy_once "$KIT/claude/settings.json" "$TARGET/.claude/settings.json"
  fi
  append_block_once "@SECURITY-RULES.md" "$TARGET/CLAUDE.md" "$KIT/claude/CLAUDE.md"
  copy_once "$KIT/claude/commands/ship-review.md" "$TARGET/.claude/commands/ship-review.md"
fi

if [ "$AGENT" = cursor ] || [ "$AGENT" = all ]; then
  echo "Cursor:"
  append_missing_lines "$KIT/cursor/cursorignore" "$TARGET/.cursorignore"
  if [ -e "$TARGET/.cursor/rules/security.mdc" ]; then
    echo "  kept   .cursor/rules/security.mdc (already exists)"
  else
    mkdir -p "$TARGET/.cursor/rules"
    { cat "$KIT/cursor/security.mdc.header"; cat "$KIT/SECURITY-RULES.md"; } > "$TARGET/.cursor/rules/security.mdc"
    echo "  added  .cursor/rules/security.mdc"
  fi
fi

if [ "$AGENT" = codex ] || [ "$AGENT" = all ]; then
  echo "Codex:"
  tmp=$(mktemp)
  { cat "$KIT/codex/AGENTS.section.md"; printf '\n'; sed 's/^#/##/' "$KIT/SECURITY-RULES.md"; } > "$tmp"
  append_block_once "<!-- agent-security-kit -->" "$TARGET/AGENTS.md" "$tmp"
  rm -f "$tmp"
fi

if [ "$HOOKS" = "--hooks" ]; then
  echo "Pre-commit hooks:"
  existing=$(git -C "$TARGET" config core.hooksPath || true)
  if [ -n "$existing" ] && [ "$existing" != ".githooks" ]; then
    echo "  kept   core.hooksPath=$existing. Copy $KIT/hooks/ into it by hand."
  else
    copy_once "$KIT/hooks/pre-commit" "$TARGET/.githooks/pre-commit"
    copy_once "$KIT/hooks/check-new-packages.mjs" "$TARGET/.githooks/check-new-packages.mjs"
    chmod +x "$TARGET/.githooks/pre-commit"
    git -C "$TARGET" config core.hooksPath .githooks
    echo "  set    core.hooksPath=.githooks"
  fi
  copy_once "$KIT/hooks/vetted-packages.txt" "$TARGET/.vetted-packages.txt"
fi

echo "Done. Review the changes with: git -C \"$TARGET\" status"
