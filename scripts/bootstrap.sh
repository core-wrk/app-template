#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

command -v node >/dev/null || { echo "Node.js 22+ is required." >&2; exit 1; }
command -v pnpm >/dev/null || { echo "pnpm is required. Enable Corepack with: corepack enable" >&2; exit 1; }

if [[ ! -f .env.local ]]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example."
fi

pnpm install

if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  pnpm db:up
else
  echo "Docker is not available; make sure DATABASE_URL points to a reachable PostgreSQL instance."
fi

set -a
source .env.local
set +a
pnpm db:migrate
pnpm db:seed

echo
echo "Bootstrap complete. Start the application with:"
echo "  pnpm dev"
echo "  web: http://localhost:5173"
echo "  api: http://localhost:${PORT:-8787}/api/health"
