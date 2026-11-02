#!/bin/sh
# Point this clone at the versioned hooks in .githooks/.
set -e
cd "$(git rev-parse --show-toplevel)"
git config core.hooksPath .githooks
chmod +x .githooks/* 2>/dev/null || true
echo "Hooks enabled: core.hooksPath=.githooks"
