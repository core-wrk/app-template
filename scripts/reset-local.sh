#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "${NODE_ENV:-development}" == "production" ]]; then
  echo "Refusing to reset while NODE_ENV=production." >&2
  exit 1
fi

docker compose down -v
docker compose up -d --wait postgres
pnpm db:migrate
pnpm db:seed
echo "Local database reset and seeded."
