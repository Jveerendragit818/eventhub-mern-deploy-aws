#!/usr/bin/env bash
# Re-deploy after you push new code to GitHub.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" && git pull

cd "$ROOT/server" && npm ci --omit=dev && pm2 restart eventhub-api

cd "$ROOT/client-eventhub" && npm ci && npm run build
sudo rm -rf /var/www/eventhub/*
sudo cp -r dist/* /var/www/eventhub/
sudo chmod -R a+rX /var/www/eventhub
sudo systemctl reload nginx
echo "Updated."
