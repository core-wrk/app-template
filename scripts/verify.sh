#!/usr/bin/env bash
set -euo pipefail

echo "→ typecheck"
pnpm typecheck
echo "→ lint"
pnpm lint
echo "→ test"
pnpm test
echo "→ build"
pnpm build
echo "✓ verification passed"
