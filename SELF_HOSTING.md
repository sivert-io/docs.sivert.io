# Self-hosting `docs.sivert.io` (build on commit + Cloudflared)

This repo is a Next.js app. The simplest self-host is:

- Run it as a Docker container on a server (no public ports)
- Expose it with a Cloudflare Tunnel (`cloudflared`)
- Auto-update on a timer (cron/systemd) using `git pull` + `docker compose up -d --build`

## 1) Server prerequisites

On your server (Ubuntu/Debian example):

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin rsync
sudo usermod -aG docker "$USER"
newgrp docker
docker --version
docker compose version
```

Create a deploy directory:

```bash
mkdir -p ~/apps/project-docs
```

## 2) First-time run (manual)

From the server:

```bash
cd ~/apps/project-docs
docker compose up -d --build
```

Verify it is listening locally:

```bash
curl -I http://127.0.0.1:3000
```

## 3) Cloudflared tunnel (no open firewall ports)

This assumes your domain is on Cloudflare DNS.

Install `cloudflared` (Debian/Ubuntu):

```bash
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install -y cloudflared
cloudflared --version
```

Login and create a tunnel:

```bash
cloudflared tunnel login
cloudflared tunnel create project-docs
```

Create config at `~/.cloudflared/config.yml` (replace placeholders). For your setup, the hostname should be `docs.sivert.io`:

```yml
tunnel: <TUNNEL_UUID>
credentials-file: /home/<user>/.cloudflared/<TUNNEL_UUID>.json

ingress:
  - hostname: docs.sivert.io
    service: http://127.0.0.1:3000
  - service: http_status:404
```

Create the DNS record:

```bash
cloudflared tunnel route dns project-docs docs.sivert.io
```

Install and start as a service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared --no-pager
```

## 4) Auto-update on commit (no SSH, no inbound ports)

If you’re using Cloudflared and don’t want any SSH-based deploy, the easiest approach is to let the server pull updates itself on a timer.

See section **5) Optional: self-updating server** below.

## Notes / hardening

- Keep the container bound to `127.0.0.1` and only expose via Cloudflared.
- If you want *zero build work* on the server, we can switch to “build Docker image in CI → push to GHCR → server pulls latest”.

## 5) Optional: self-updating server (no inbound ports)

If you don’t want a “deploy on commit” workflow, you can have the server pull and rebuild on a timer.

This repo includes a safe updater script: `scripts/auto_update.sh`.

### Setup (cron)

On the server:

```bash
cd ~/apps/project-docs
chmod +x scripts/auto_update.sh
```

Edit your crontab:

```bash
crontab -e
```

Add (every 5 minutes):

```cron
*/5 * * * * REPO_DIR=/home/<user>/apps/project-docs BRANCH=main /home/<user>/apps/project-docs/scripts/auto_update.sh >> /var/log/project-docs-autoupdate.log 2>&1
```

### Setup (systemd timer, preferred on Linux servers)

Create `/etc/systemd/system/project-docs-autoupdate.service`:

```ini
[Unit]
Description=Project Docs auto-update

[Service]
Type=oneshot
User=<user>
Environment=REPO_DIR=/home/<user>/apps/project-docs
Environment=BRANCH=main
WorkingDirectory=/home/<user>/apps/project-docs
ExecStart=/home/<user>/apps/project-docs/scripts/auto_update.sh
```

Create `/etc/systemd/system/project-docs-autoupdate.timer`:

```ini
[Unit]
Description=Run project-docs auto-update every 5 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
Persistent=true

[Install]
WantedBy=timers.target
```

Enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now project-docs-autoupdate.timer
systemctl list-timers --all | grep project-docs
```

