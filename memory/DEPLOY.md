# AXIOM — Production Deploy Guide

## 0. The dual-driver design
- **Local / Emergent preview**: uses `sql.js` (file at `/app/server/data/axiom.db`).
- **Production**: when `DATABASE_URL` is set AND reachable, the backend automatically uses **Aiven/Neon Postgres** via the `pg` driver. If Postgres is unreachable on boot, the backend silently falls back to sql.js so the app stays alive — see `/app/server/config/dbPostgres.js`.

This means **deploy without code changes** — just set the right env vars on the host.

---

## 1. Recommended hosts

| Layer | Host | Cost |
|-------|------|------|
| Frontend (Vite static) | **Vercel** or `axiomdev.free.nf` (InfinityFree) | Free |
| Backend (Express) | **Render** free tier or **Railway** | Free / ~$5mo |
| Database | **Aiven Postgres** (you have this) or **Neon** | Free |
| Error tracking | **Sentry** | Free 5k events/mo |

InfinityFree CANNOT host the backend (PHP-only, no Node) and its MySQL is locked to internal-network access only. Use it for the static frontend if you want, but the backend lives elsewhere.

---

## 2. Backend deploy on Render

1. Push the repo to GitHub via Emergent's "Save to GitHub" feature.
2. Render → New → Web Service → connect repo, select `/app/server` as the root.
3. Build command: `npm install`
4. Start command: `npm start` (or `node index.js`)
5. Environment variables (Settings → Environment):
   ```
   NODE_ENV=production
   PORT=8001
   DATABASE_URL=postgres://user:password@hostname:port/db?sslmode=require
   EMERGENT_LLM_KEY=sk-emergent-...
   PRODUCTION_FRONTEND_URL=https://axiomdev.vercel.app
   FRONTEND_URLS=https://axiomdev.free.nf
   ALLOW_UNAUTHENTICATED_DEV=false
   FIREBASE_PROJECT_ID=madapp-447a2
   SENTRY_DSN=  (paste from Sentry once project is created)
   ```
6. Health check: Render auto-uses `/health`.
7. After first deploy, the backend will:
   - Connect to Aiven Postgres (DNS works on Render's network)
   - Run `migrations/001_initial_schema.sql` to create tables
   - Auto-seed jobs (12), posts (4), interview experiences (15) idempotently

---

## 3. Frontend deploy on Vercel

1. Vercel → Add New → Project → connect repo, select `/app/client` as the root.
2. Framework: Vite (auto-detected).
3. Build command: `yarn build`
4. Output directory: `dist`
5. Environment variables:
   ```
   VITE_API_URL=https://axiom-api.onrender.com   ← your Render backend URL
   VITE_DEV_BYPASS_AUTH=false
   VITE_FIREBASE_API_KEY=AIzaSyAZUBo8e8AuVarqeVg1W4Kn1kXHf1npCZQ
   VITE_FIREBASE_AUTH_DOMAIN=madapp-447a2.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=madapp-447a2
   VITE_FIREBASE_APP_ID=1:660681517019:web:09bb3a6d30b8eb8c85a6ec
   VITE_SENTRY_DSN=  (paste from Sentry frontend project)
   VITE_SENTRY_ENV=production
   ```
6. Custom domain: point your Aiven domain or your `axiomdev.free.nf` record at Vercel's CNAME.

---

## 4. Sentry setup (5 min)

1. sentry.io → New Organization → Create new project for **React** (frontend) and **Node Express** (backend) → 2 separate DSNs.
2. Paste the React DSN into `VITE_SENTRY_DSN` in Vercel.
3. Paste the Node DSN into `SENTRY_DSN` in Render.
4. Test: visit `/an-invalid-route` after deploy → branded 404 page renders. Force a backend error: `curl -X POST your-api/api/ai/polish-story -d '{}'` → 400 returned, no Sentry event (expected — only 5xx pages). Force 5xx by stopping Postgres → first DB query throws → Sentry receives event.

---

## 5. Disable dev-bypass for real users

Once Firebase is verified end-to-end with a fresh signup:

**Frontend** (Vercel env): `VITE_DEV_BYPASS_AUTH=false`
**Backend** (Render env): `ALLOW_UNAUTHENTICATED_DEV=false`

Redeploy both. Now `/app/*` routes require a real Firebase login.

---

## 6. Smoke-test checklist post-deploy

```bash
curl https://axiom-api.onrender.com/health
curl https://axiom-api.onrender.com/api/jobs        # → 12 jobs
curl https://axiom-api.onrender.com/api/dsa/companies # → 26 companies
curl https://axiom-api.onrender.com/api/interviews   # → 15+ experiences
```

Frontend:
- `/` renders landing page with hero
- `/login` and `/signup` accept real Firebase credentials
- `/app` (after login) renders dashboard
- `/u/your-handle` shows your public portfolio
- `/privacy` and `/terms` render
- `/some-fake-route` → branded 404

---

## 7. Cost ceiling for a 100-user month

| Service | Free tier | Hits limit at |
|---------|-----------|---------------|
| Render backend | 750 hrs/mo | Always-on (one instance) |
| Aiven Postgres | 1 GB storage | ~50k user records |
| Sentry | 5k events/mo | 100 daily-active users |
| Emergent LLM | budget on key | Heavy AI use — monitor in dashboard |
| Vercel | unlimited bandwidth | Free for personal projects |

**Estimated $0/mo for the first 100 users.** Scale-up signal: Sentry events approaching 5k/mo or LLM key budget warnings.
