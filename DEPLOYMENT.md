# Wesplit Deployment

This repo is set up to deploy as a single Node.js service:

- `npm ci` at the repo root installs backend and frontend dependencies with npm lockfiles.
- `npm run build` builds the React frontend.
- `npm start` runs the Express backend.
- In production, the backend serves `frontend/dist`, binds to `0.0.0.0`, and the app uses the same-domain `/api` base URL by default.

## Recommended Root Commands

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check path: `/`

## Required Environment Variables

- `NODE_ENV=production`
- `MONGODB_URI=<your production MongoDB connection string>`
- `JWT_SECRET=<a long random secret>`

## Optional Environment Variables

- `PORT=5000`
- `CLIENT_URLS=https://your-domain.com,https://app.your-domain.com`
- `CLIENT_URL=https://your-domain.com` as a single-origin alias for `CLIENT_URLS`
- `JWT_ACCESS_EXPIRE=15m`
- `JWT_REFRESH_EXPIRE=7d`
- `COOKIE_SAME_SITE=lax`
- `COOKIE_SECURE=false`
- `MONGODB_RETRY_DELAY_MS=5000`
- `MONGODB_MAX_RETRIES=5`
- `TRUST_PROXY=true`

## Same-Domain Deploy

If frontend and backend are deployed together on one service:

- leave `VITE_API_BASE_URL` unset
- `CLIENT_URLS` can be set to your live origin, for example `https://your-domain.com`
- Render can use `/` as the health check path; `/api/health` remains available for deeper checks

## Separate Frontend Deploy

If you deploy frontend and backend separately:

- backend stays on its own Node host
- frontend must define `VITE_API_BASE_URL=https://api.your-domain.com/api`
- `VITE_API_URL` is also supported as a fallback alias, but `VITE_API_BASE_URL` is the preferred name
- if you set only the bare backend origin, for example `https://your-service.onrender.com`, the frontend now normalizes it to `https://your-service.onrender.com/api`
- backend `CLIENT_URLS` or `CLIENT_URL` should include the frontend origin, for example `https://app.your-domain.com`
- for Vercel -> Render deployments, set backend `CLIENT_URLS=https://your-project.vercel.app` and `TRUST_PROXY=true`
- for this deployment, Render should allow `https://we-split-henna.vercel.app` and Vercel should point `VITE_API_BASE_URL` to `https://wesplit-nlwr.onrender.com/api`
- the backend now defaults cross-origin auth cookies to `SameSite=None` and `Secure=true` in production when the configured frontend origin differs from the Render origin, but explicit `COOKIE_SAME_SITE` and `COOKIE_SECURE` values still override that behavior
- if `VITE_API_BASE_URL` is left as `/api` on Vercel, browser requests will go to `https://your-project.vercel.app/api/...` and return 404 unless you add a Vercel rewrite or proxy

## Package Manager

- Use `npm` consistently for local development and Render builds.
- Do not mix `yarn` or `pnpm` lockfiles into this repo.
