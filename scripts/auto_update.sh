#!/usr/bin/env bash
set -euo pipefail

# Auto-update docs.sivert.io without inbound ports.
# - Fetch origin/<branch>
# - If deployed commit differs from remote: (optional pull) + docker compose up -d --build
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

REMOTE="$(git rev-parse "origin/$BRANCH")"

DEPLOYED="$(docker inspect -f '{{ index .Config.Labels "org.opencontainers.image.revision" }}' project-docs 2>/dev/null || true)"
if [[ -z "${DEPLOYED:-}" ]]; then
  DEPLOYED="$(docker exec project-docs cat /app/BUILD_COMMIT 2>/dev/null | tr -d '\r\n' || true)"
fi

if [[ -n "${DEPLOYED:-}" && "$DEPLOYED" == "$REMOTE" ]]; then
  log "Up to date (deployed=$DEPLOYED)"
  exit 0
fi

LOCAL="$(git rev-parse HEAD)"
log "Deploying remote commit: $REMOTE (local=$LOCAL deployed=${DEPLOYED:-none})"

# Only pull if we're not already at the remote commit.
if [[ "$LOCAL" != "$REMOTE" ]]; then
  log "Fast-forwarding repo to origin/$BRANCH..."
  git pull --ff-only origin "$BRANCH"
fi

log "Rebuilding + restarting container..."
cd "$COMPOSE_DIR"
export GIT_COMMIT_SHA="$REMOTE"
docker compose up -d --build

log "Done."
