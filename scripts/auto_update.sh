#!/usr/bin/env bash
set -euo pipefail

# Auto-update docs.sivert.io without inbound ports.
# - Fetch origin/<branch>
# - If remote commit differs: fast-forward pull + docker compose up -d --build
# Safe for cron/systemd (uses a lock to prevent overlap).

REPO_DIR="${REPO_DIR:-/home/$USER/apps/project-docs}"
BRANCH="${BRANCH:-main}"
COMPOSE_DIR="${COMPOSE_DIR:-$REPO_DIR}"
LOCK_FILE="${LOCK_FILE:-/tmp/project-docs-autoupdate.lock}"

log() {
  echo "[$(date -Is)] $*"
}

if [[ ! -d "$REPO_DIR/.git" ]]; then
  log "ERROR: REPO_DIR is not a git repo: $REPO_DIR"
  exit 1
fi

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  log "Another update is running; exiting."
  exit 0
fi

cd "$REPO_DIR"

log "Fetching origin/$BRANCH..."
git fetch origin "$BRANCH" --prune

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$BRANCH")"

if [[ "$LOCAL" == "$REMOTE" ]]; then
  log "Up to date: $LOCAL"
  exit 0
fi

log "Updating: $LOCAL -> $REMOTE"
git pull --ff-only origin "$BRANCH"

log "Rebuilding + restarting container..."
cd "$COMPOSE_DIR"
docker compose up -d --build

log "Done."
