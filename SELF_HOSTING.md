# Self-hosting `docs.sivert.io` (build on commit + Cloudflared)

This repo is a Next.js app. The simplest self-host is:

- Run it as a Docker container on a server (no public ports)
- Expose it with a Cloudflare Tunnel (`cloudflared`)
- Deploy on every commit using GitHub Actions over SSH

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

## 4) GitHub Actions “build on commit” deploy

This repo includes `.github/workflows/deploy-selfhost.yml`.

Add these repo secrets in GitHub:

- `DEPLOY_HOST`: your server IP/hostname
- `DEPLOY_PORT`: SSH port (usually `22`)
- `DEPLOY_USER`: user to SSH as (must be able to run `docker`)
- `DEPLOY_PATH`: deploy directory (example: `/home/<user>/apps/project-docs`)
- `DEPLOY_SSH_KEY`: **private** key for SSH auth (recommended: a deploy key with no passphrase)

### Create a deploy key

On your local machine:

```bash
ssh-keygen -t ed25519 -C "project-docs deploy" -f ./project-docs_deploy_key -N ""
```

- Put the **public** key contents (`project-docs_deploy_key.pub`) into the server’s `~/.ssh/authorized_keys`
- Put the **private** key contents (`project-docs_deploy_key`) into GitHub Actions secret `DEPLOY_SSH_KEY`

After that, pushing to `main` will:

- build the site in CI (fail fast)
- rsync the repo to the server
- run `docker compose up -d --build`

## Notes / hardening

- Keep the container bound to `127.0.0.1` and only expose via Cloudflared.
- If you want *zero build work* on the server, we can switch to “build Docker image in CI → push to GHCR → server pulls latest”.

