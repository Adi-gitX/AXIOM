# AXIOM — Test Credentials

## Dev Preview Auth Bypass
The client has an opt-in dev bypass for UI/preview work without real Firebase login.

- **Flag location**: `/app/client/.env` → `VITE_DEV_BYPASS_AUTH=true`
- **Active in current preview**: ✅ true
- **Mock user injected** (UI-only, no Firebase token, no DB write):
  - `email`: `dev@axiom.local`
  - `displayName`: `Dev Preview`
  - `uid`: `dev-preview-uid`
- **Disable**: set `VITE_DEV_BYPASS_AUTH=false` in `client/.env` and restart frontend (`sudo supervisorctl restart frontend`).

## Real Firebase Auth (madapp-447a2)
- **Status**: Not yet end-to-end tested with a real account in this environment.
- **Login route**: `/login` · **Signup route**: `/signup`
- **To test**: create an account via Signup form (uses live Firebase). Backend has `ALLOW_UNAUTHENTICATED_DEV=true` for local dev so DB writes succeed without verifying Firebase ID tokens.

## Server / Admin
- Backend at `localhost:8001` (supervisor-managed). Health: `GET /api/jobs`, `GET /health`.
- SQLite DB at `/app/server/data/axiom.db`.
- **Auto-seeded on cold boot** via `/app/server/config/bootstrapSeeds.js` — runs idempotent seeds for jobs (12) + posts (4) when those tables are empty. No manual seed script needed.

## Routes for testing (frontend)
- Public: `/`, `/docs`, `/pricing`, `/login`, `/signup`, `/u/:username`
- App (protected, dev-bypass auto-fills): `/app`, `/app/dsa`, `/app/oss`, `/app/gsoc`, `/app/education`, `/app/interview`, `/app/jobs`, `/app/posts`, `/app/connect`, `/app/profile`, `/app/settings`
- API (port 8001): `/api/jobs`, `/api/posts`, `/api/progress/*`, `/api/oss/*`, `/api/gsoc/*`, `/api/users/*`, `/api/education/*`, `/api/interview/*`, `/api/chat/*`, `/api/settings/*`

## Quick smoke test
```
curl https://preview-deploy-151.preview.emergentagent.com/api/jobs       # → { jobs: [...12...] }
curl https://preview-deploy-151.preview.emergentagent.com/api/posts      # → [...12...]
```
