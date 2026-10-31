# Deploying EventHub (React + Node + MongoDB) on Amazon EC2

Same idea as your BookWagon report, with two extra pieces: a Node backend and a database.

```
Browser -> Public IP :80 -> Security Group -> Nginx
                                              |-- /          -> React build (/var/www/eventhub)
                                              |-- /api/*     -> Node/Express (PM2, port 5000)
                                              |-- /uploads/* -> Node/Express (images)
                                                                     |
                                                                  MongoDB
```

## What I changed in your code (already done in this folder)

| File | Change | Why |
|---|---|---|
| `client-eventhub/src/utils/api.js` | `baseURL` `http://localhost:5000/api` -> `/api` | `localhost` on a visitor's PC is not your server |
| `server/routes/eventRoutes.js` | Image URLs `http://localhost:5000/uploads/..` -> `/uploads/..` | Same reason; saved URLs must work on any host |
| `client-eventhub/vite.config.js` | Added dev proxy for `/api` and `/uploads` | Local `npm run dev` keeps working |
| `server/.env` | Removed; `.env.example` added | Never push secrets to GitHub |
| `deploy/` | `nginx.conf`, `deploy.sh`, `update.sh` | Automates the server setup |
| `.gitignore` | Added | Keeps `node_modules`, `.env`, test uploads out of Git |

Old events created locally have `localhost` image URLs saved in your local database. On EC2 you start with a fresh database, so this does not matter.

---

## Step 1: Test locally (2 min)

```bash
cd server && npm install && cp .env.example .env && npm run dev
# new terminal
cd client-eventhub && npm install && npm run dev
```
Open http://localhost:5173. Register, create an event with an image. If it works, continue.

## Step 2: Push to GitHub

Run these from the `eventhub-deploy` folder (the one containing `client-eventhub`, `server`, `deploy`):

```bash
git init
git add .
git commit -m "EventHub deployment-ready"
git branch -M main
git remote add origin https://github.com/<your-username>/EventHub.git
git push -u origin main
```
Create the empty repo on GitHub first. Make it **public** (simplest, as in BookWagon), or use a token if private.

## Step 3: Choose a database

**Option A, no setup (default):** `deploy.sh` installs MongoDB on the same EC2 instance. Fine for a lab/demo.

**Option B, MongoDB Atlas (more robust):**
1. Create a free M0 cluster at mongodb.com/atlas and a database user.
2. Network Access -> Add IP Address -> `0.0.0.0/0` (demo only; better: your EC2 Elastic IP).
3. Copy the connection string, e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/eventhub`.

## Step 4: Launch the EC2 instance

| Setting | Value |
|---|---|
| Name | `EventHub_Deployment` |
| AMI | Amazon Linux 2023 |
| Type | **t3.small** if available (t3.micro works, but slower to build; the script adds swap) |
| Storage | **16 GiB** gp3 (8 GiB is tight with Node + MongoDB) |
| Security group inbound | **HTTP 80** from `0.0.0.0/0`, and **SSH 22** from *My IP* (needed for the browser-based connect during setup) |

## Step 5: Connect and deploy

In the EC2 console, select the instance -> **Connect** -> **EC2 Instance Connect** -> Connect. Then:

```bash
sudo dnf install -y git
git clone https://github.com/<your-username>/EventHub.git
cd EventHub

# Option A (local MongoDB):
bash deploy/deploy.sh

# Option B (Atlas): use your own connection string
MONGO_URI="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/eventhub" bash deploy/deploy.sh
```

It takes about 5-10 minutes. At the end it prints `http://<public-ip>/`.

## Step 6: Verify (screenshots for your report)

```bash
pm2 status                                   # eventhub-api -> online
sudo systemctl status nginx                  # active (running)
sudo systemctl status mongod                 # only for Option A
curl -s http://localhost/api/events | head   # JSON from the API through Nginx
curl -s -o /dev/null -w "%{http_code}\n" http://localhost/          # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost/login     # 200 (SPA fallback)
```
Then open `http://<public-ip>/` in a browser: register an **organizer**, create an event with an image, register an **attendee**, view and join it.

## Step 7: After you are done

- Remove the SSH rule from the security group (as in your BookWagon report). Re-add it only when needed.
- To redeploy after code changes: push to GitHub, connect, then `cd EventHub && bash deploy/update.sh`.
- Public IP changes after stop/start. Attach an **Elastic IP** if you want a fixed address.

## Troubleshooting

| Problem | Fix |
|---|---|
| Page loads, API calls fail | `pm2 logs eventhub-api` (usually a bad `MONGO_URI`) |
| `502 Bad Gateway` | Node is down: `pm2 restart eventhub-api` |
| Blank page after refresh on `/login` | Make sure the `deploy/nginx.conf` was copied (`sudo nginx -t`) |
| Atlas: connection timeout | Atlas Network Access must allow your EC2 IP |
| `npm run build` killed / out of memory | `free -h` should show 2 GB swap; re-run `deploy.sh`, or use t3.small |
| Image upload fails | File must be JPG/PNG/WEBP and under 5 MB each |
| Site unreachable from browser | Security group needs inbound HTTP 80; use `http://` not `https://` |

## Security notes (worth a paragraph in your report)

- HTTP only; add HTTPS (domain + Let's Encrypt/certbot, or an ALB with ACM) for production.
- `JWT_SECRET` is generated randomly on the server; `.env` is `chmod 600` and not in Git.
- `cors()` is open to all origins in `server.js`. Harmless here because Nginx makes everything same-origin, but restrict it in production.
- Local MongoDB has no auth and listens on localhost only. Keep port 27017 closed in the security group.
