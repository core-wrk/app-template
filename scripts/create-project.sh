#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

APP_NAME="${1:-}"
if [[ -z "$APP_NAME" ]]; then read -r -p "Application name: " APP_NAME; fi
[[ -n "$APP_NAME" ]] || { echo "Application name is required." >&2; exit 1; }

PACKAGE_NAMESPACE="${2:-@app}"
APP_TITLE="${3:-$APP_NAME}"
API_PORT="${4:-8787}"
WEB_PORT="${5:-5173}"
PACKAGE_SLUG="$(printf '%s' "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//; s/-$//')"

replace_text() {
  local old="$1" new="$2" file="$3"
  OLD_TEXT="$old" NEW_TEXT="$new" perl -0pi -e 's/\Q$ENV{OLD_TEXT}\E/$ENV{NEW_TEXT}/g' "$file"
}

replace_text 'core-wrk-app-starter' "$PACKAGE_SLUG" package.json
replace_text '@core-wrk' "$PACKAGE_NAMESPACE" package.json
replace_text 'Core Wrk App Starter' "$APP_TITLE" README.md
replace_text 'Core Wrk App Starter' "$APP_TITLE" apps/web/index.html
replace_text 'Core Wrk App Starter' "$APP_TITLE" packages/shared/src/config/branding.ts
replace_text 'VITE_APP_TITLE=Core Wrk App Starter' "VITE_APP_TITLE=$APP_TITLE" .env.example
replace_text '8787' "$API_PORT" .env.example
replace_text '5173' "$WEB_PORT" .env.example
replace_text '@core-wrk' "$PACKAGE_NAMESPACE" apps/api/package.json
replace_text '@core-wrk' "$PACKAGE_NAMESPACE" apps/web/package.json
replace_text '@core-wrk' "$PACKAGE_NAMESPACE" packages/db/package.json
replace_text '@core-wrk' "$PACKAGE_NAMESPACE" packages/shared/package.json
replace_text '@core-wrk' "$PACKAGE_NAMESPACE" apps/api/Dockerfile
while IFS= read -r file; do
  replace_text '@core-wrk' "$PACKAGE_NAMESPACE" "$file"
done < <(rg --files apps packages -g '*.ts' -g '*.tsx' -g '*.json')

echo "Created project metadata for $APP_TITLE ($PACKAGE_SLUG)."
echo "Review package names and run pnpm install before starting development."
