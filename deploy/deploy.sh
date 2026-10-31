#!/usr/bin/env bash
# First-time setup for Amazon Linux 2023 (EC2).
# Usage (from anywhere, after cloning the repo):
#   bash deploy/deploy.sh                          -> installs local MongoDB on the instance
#   MONGO_URI="mongodb+srv://..." bash deploy/deploy.sh   -> uses MongoDB Atlas instead
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_USER="$(whoami)"
echo ">> Project root: $ROOT"

# 1. Swap file (t3.micro has only 1 GB RAM; Vite build can run out of memory)
if ! swapon --show | grep -q swapfile; then
  echo ">> Creating 2 GB swap"
  sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none
  sudo chmod 600 /swapfile && sudo mkswap /swapfile >/dev/null && sudo swapon /swapfile
fi

# 2. System packages
echo ">> Installing nginx, git, Node.js 22, PM2"
sudo dnf install -y nginx git
if ! command -v node >/dev/null; then
  curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
  sudo dnf install -y nodejs
fi
command -v pm2 >/dev/null || sudo npm install -g pm2

# 3. MongoDB (local) unless an external URI was provided
if [ -z "${MONGO_URI:-}" ]; then
  echo ">> No MONGO_URI given: installing local MongoDB 8.0"
  sudo tee /etc/yum.repos.d/mongodb-org-8.0.repo >/dev/null <<'REPO'
[mongodb-org-8.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/8.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-8.0.asc
REPO
  sudo dnf install -y mongodb-org
  sudo systemctl enable --now mongod
  MONGO_URI="mongodb://127.0.0.1:27017/eventhub"
fi

# 4. Backend: .env + dependencies + PM2
cd "$ROOT/server"
if [ ! -f .env ]; then
  echo ">> Creating server/.env"
  cat > .env <<ENV
PORT=5000
MONGO_URI=$MONGO_URI
JWT_SECRET=$(openssl rand -hex 32)
ENV
  chmod 600 .env
fi
mkdir -p uploads
npm ci --omit=dev
pm2 delete eventhub-api >/dev/null 2>&1 || true
pm2 start server.js --name eventhub-api
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$APP_USER" --hp "$HOME" >/dev/null

# 5. Frontend: build and publish to /var/www/eventhub
cd "$ROOT/client-eventhub"
npm ci
npm run build
sudo mkdir -p /var/www/eventhub
sudo rm -rf /var/www/eventhub/*
sudo cp -r dist/* /var/www/eventhub/
sudo chmod -R a+rX /var/www/eventhub

# 6. Nginx
sudo cp "$ROOT/deploy/nginx.conf" /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx

echo
echo "DONE. Open: http://$(curl -s http://checkip.amazonaws.com)/"
