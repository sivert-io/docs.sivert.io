#!/usr/bin/env bash
set -euo pipefail

# Bootstrap self-hosting for docs.sivert.io on a server:
# - Builds + starts Docker container (localhost only)
# - Installs an auto-update cron job (git pull + docker compose up --build when origin/main changes)
# - Prints GitHub Actions secrets needed for optional deploy workflow
#
# Usage:
#   ./scripts/selfhost_bootstrap.sh
#
# Optional env overrides:
#   REPO_DIR=/home/user/apps/project-docs
#   BRANCH=main
#   CRON_EVERY="*/5 * * * *"
#   LOG_FILE=/var/log/project-docs-autoupdate.log

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BRANCH="${BRANCH:-main}"
CRON_EVERY="${CRON_EVERY:-*/5 * * * *}"
LOG_FILE="${LOG_FILE:-/var/log/project-docs-autoupdate.log}"

AUTO_UPDATE_SCRIPT="$REPO_DIR/scripts/auto_update.sh"
CRON_MARKER="# project-docs-autoupdate"

log() {
  echo "[$(date -Is)] $*"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { log "ERROR: missing required command: $1"; exit 1; }
}

log "Repo dir: $REPO_DIR"
cd "$REPO_DIR"

require_cmd git
require_cmd docker
require_cmd flock

if ! docker compose version >/dev/null 2>&1; then
  log "ERROR: docker compose plugin not found. Install docker-compose-plugin."
  exit 1
fi

if [[ ! -x "$AUTO_UPDATE_SCRIPT" ]]; then
  log "Making auto-update script executable: $AUTO_UPDATE_SCRIPT"
  chmod +x "$AUTO_UPDATE_SCRIPT"
fi

if [[ ! -d "$REPO_DIR/.git" ]]; then
  log "ERROR: $REPO_DIR is not a git repo (missing .git)."
  exit 1
fi

log "Starting docs container (docker compose up -d --build)..."
docker compose up -d --build

log "Installing cron job (idempotent)..."
CRON_LINE="$CRON_EVERY REPO_DIR=$REPO_DIR BRANCH=$BRANCH $AUTO_UPDATE_SCRIPT >> $LOG_FILE 2>&1 $CRON_MARKER"

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

if crontab -l >/dev/null 2>&1; then
  crontab -l | grep -vF "$CRON_MARKER" >"$tmp" || true
else
  : >"$tmp"
fi

{
  echo ""
  echo "$CRON_LINE"
} >>"$tmp"

crontab "$tmp"

log "Cron installed."

cat <<EOF

Next steps / verification
-------------------------
1) Verify docs is up locally:
   curl -I http://127.0.0.1:3000

2) Verify cron entry:
   crontab -l | grep project-docs-autoupdate

Optional: GitHub Actions deploy (push-to-main)
----------------------------------------------
This repo includes: .github/workflows/deploy-selfhost.yml

Add these GitHub repo secrets:
- DEPLOY_HOST: <your-server-hostname-or-ip>
- DEPLOY_PORT: 22
- DEPLOY_USER: <ssh-user>
- DEPLOY_PATH: $REPO_DIR
- DEPLOY_SSH_KEY: <private key contents>

Server prerequisites for the workflow:
- rsync installed (Debian/Ubuntu): sudo apt install -y rsync
- docker + docker compose installed and usable by DEPLOY_USER

Create a deploy key (run on your local machine):
  ssh-keygen -t ed25519 -C "project-docs deploy" -f ./project-docs_deploy_key -N ""

Then:
- Put the PUBLIC key (project-docs_deploy_key.pub) into: ~DEPLOY_USER/.ssh/authorized_keys on the server
- Put the PRIVATE key (project-docs_deploy_key) into GitHub secret DEPLOY_SSH_KEY

EOF
