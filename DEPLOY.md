# Deploy guide — from scratch to live

Architecture: **Frontend** (static files) on Vercel → calls → **Backend** (Spring Boot, Docker) on Render → **Postgres** on Supabase. Email goes out via Gmail SMTP, falling back to Brevo.

All three have free tiers. Total time: ~30 min.

> ⚠️ **Security first.** The `.env` in your zip contains real DB, JWT and SMTP secrets. Never commit it (the included `.gitignore` blocks it). Since it has been shared, **rotate**: Supabase DB password, a new `JWT_SECRET`, a new Gmail App Password, a new Brevo key.

## 0. Prerequisites
GitHub account, and free accounts on Supabase, Render, Vercel (sign in with GitHub). Optional for local testing: Java 21, Node 18+.

## 1. Push the code to GitHub
```bash
cd Authentication_System_fixed
git init && git add . && git commit -m "Auth system + frontend"
# create an empty repo on github.com (private is fine), then:
git remote add origin https://github.com/<you>/auth-system.git
git branch -M main && git push -u origin main
```
Check `.env` is **not** in the repo on GitHub.

## 2. Database (Supabase)
1. supabase.com → New project → set a strong DB password.
2. Project → **Connect** → copy the **Session pooler** string (Render has no IPv6; the direct host is IPv6-only).
3. Convert to JDBC form:
   - `DB_URL` = `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres`
   - `DB_USERNAME` = `postgres.<project-ref>`
   - `DB_PASSWORD` = the password you set
   
Flyway creates the tables automatically on first boot — no manual SQL.

## 3. Email
- **Gmail:** Google Account → Security → 2-Step Verification on → App passwords → create one. `GMAIL_USERNAME` = your address, `GMAIL_APP_PASSWORD` = the 16 chars (no spaces), `GMAIL_FROM` = same address.
- **Brevo (fallback):** brevo.com → SMTP & API → SMTP keys. `BREVO_SMTP_USERNAME` (login shown there), `BREVO_SMTP_KEY`, `BREVO_FROM` = a sender you verified in Brevo.

Note: Render's free tier blocks Gmail's port 587, so on free Render mail will go through Brevo (port 2525) via the built-in failover. That's fine.

## 4. Deploy the backend (Render)
1. render.com → **New → Web Service** → connect your GitHub repo.
2. Settings: **Root Directory** `Authentication_System` · **Runtime** Docker (it finds the `Dockerfile`) · Instance: Free.
3. **Environment** → add:

| Key | Value |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | from step 2 |
| `JWT_SECRET` | long random: `openssl rand -base64 48` |
| `GMAIL_USERNAME`, `GMAIL_APP_PASSWORD`, `GMAIL_FROM` | from step 3 |
| `BREVO_SMTP_USERNAME`, `BREVO_SMTP_KEY`, `BREVO_FROM` | from step 3 |
| `CORS_ALLOWED_ORIGINS` | *(set after step 5; for now* `http://localhost:5173`*)* |

4. **Health check path:** `/api/v1/health`. Deploy. First build takes ~5 min.
5. When live you get `https://<name>.onrender.com`. Test: open `https://<name>.onrender.com/api/v1/health` → `{"status":"UP"}`.

Free Render services sleep after ~15 min idle; the first request then takes ~30–60 s. Upgrade the instance to avoid that.

## 5. Deploy the frontend (Vercel)
The frontend is React + TypeScript (Vite). The backend URL is read from the `VITE_API_BASE_URL` environment variable at build time.
1. vercel.com → **Add New → Project** → import the repo.
2. **Root Directory** `frontend` · Framework preset **Vite** (auto-detected; build `npm run build`, output `dist`).
3. **Environment Variables** → `VITE_API_BASE_URL` = `https://<name>.onrender.com/api/v1`
4. Deploy. You get `https://<project>.vercel.app`.

(Changing `VITE_API_BASE_URL` later requires a redeploy, because Vite bakes it in at build time.)

## 6. Connect them (CORS)
In Render → Environment, set
`CORS_ALLOWED_ORIGINS=https://<project>.vercel.app`
(comma-separate multiple, no trailing slash, no spaces). Save — Render redeploys. 

## 7. Verify it works
Open the Vercel URL → Sign up → check your inbox for the 6-digit code → verify → you land on the Account page. Also try Sign out, then "Forgot password?".

## Custom domain (optional)
Vercel → Project → Domains → add `app.yourdomain.com` and follow the DNS record. Then update `CORS_ALLOWED_ORIGINS` to include it.

## Run locally
```bash
# backend (needs Java 21 and a filled-in Authentication_System/.env exported to the shell)
cd Authentication_System
set -a; source .env; set +a
./mvnw spring-boot:run          # http://localhost:8080
# frontend (Node 20+)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev                     # http://localhost:5173
```
The backend's default `CORS_ALLOWED_ORIGINS` already allows `http://localhost:5173`.

## Frontend structure
```
frontend/src/
  app/         App.tsx, routes.tsx (one line per screen), router.tsx
  config/      env.ts            (reads VITE_API_BASE_URL)
  lib/         http.ts (fetch client + ApiError), validators.ts, useSubmit.ts, flash.ts
  components/  ui/ (Button, TextField, Alert)   layout/
  features/
    auth/      authApi.ts, AuthContext.tsx, storage.ts, types.ts, pages/*
    account/   AccountPage.tsx
  styles/      global.css
```
To add a feature: create `features/<name>/` with its own `api.ts`, `types.ts` and pages, then register the page in `app/routes.tsx`.

## Troubleshooting
| Symptom | Fix |
|---|---|
| "Can't reach the server" in the UI | Wrong `VITE_API_BASE_URL` (needs redeploy after change), or CORS origin mismatch (exact scheme+host, no trailing `/`). Check browser DevTools → Network. |
| Backend crashes on start | Render logs: usually wrong `DB_URL` (use the Session pooler) or missing env var. |
| No OTP email | Check Render logs for mail errors; verify the Brevo sender address; check spam. |
| 429 "Too many attempts" | Built-in rate limiter (e.g. 3 OTP sends / 10 min). Wait and retry. |
| Login works after a long idle but is slow | Free Render cold start. |

## Known limitations of the backend (worth knowing)
- Rate limiter and token blacklist are **in-memory**: they reset on restart and aren't shared across multiple instances. Fine for one instance.
- Token is stored in `localStorage` on the frontend (the backend returns it in the JSON body). This is simple but exposed to XSS; the frontend escapes all dynamic content to limit that risk.
