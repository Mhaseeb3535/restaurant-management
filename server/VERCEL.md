# Deploying the backend to Vercel

The backend is an Express app in this folder. The frontend is a separate Vite
app at the repository root. Deploy them as **two Vercel projects** connected to
the same GitHub repository; this lets each project use its own package file and
build settings.

This follows Vercel's current zero-configuration Express deployment:
https://vercel.com/docs/frameworks/backend/express

## Backend Vercel project

1. Import the repository into Vercel and create a backend project.
2. Set **Root Directory** to `server`.
3. Let Vercel detect the Express app from `index.js` and `package.json`. Do not
   add a separate `vercel.json`, custom function adapter, or static output
   directory for the backend.
4. Set these environment variables for **Production**, **Preview**, and
   **Development** as appropriate:

   | Variable | Required | Value |
   | --- | --- | --- |
   | `DATABASE_URL` | Yes | Connection string for a hosted PostgreSQL database reachable from Vercel. Prefer the provider's pooled URL if available. Never use `localhost`. |
   | `JWT_SECRET` | Yes | A long, randomly generated private secret. Do not use the example value or commit it. |
   | `CORS_ORIGINS` | Yes for browser access | Comma-separated exact origins of the deployed frontend, for example `https://your-frontend.vercel.app`. Include the required preview origin(s) too. Do not include paths or trailing slashes. |
   | `DATABASE_SSL` | Usually for hosted databases | Set to `true` if required by the database provider; otherwise use its documented connection-string SSL setting. |
   | `DATABASE_SSL_REJECT_UNAUTHORIZED` | Optional | Defaults to `true`. Keep certificate verification enabled unless the provider explicitly documents otherwise. |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Optional | Configure these only if password-reset email should work. Use the SMTP provider's values. |

   Vercel supplies `PORT`; do not add a fixed production port.

5. After setting variables, redeploy. Vercel applies changed environment
   variables to new deployments, not already-built deployments.
6. The backend health URLs should be:
   - `https://<backend-domain>/api/health` — process/application liveness only.
   - `https://<backend-domain>/api/health/db` — performs `SELECT 1`; HTTP 200
     means the database connection succeeded, while HTTP 503 means it did not.

The backend does not run schema changes on startup. Existing schema changes can
be run intentionally with `npm run db:migrate` from this directory, after
confirming the database and taking an appropriate backup. `npm run db:init` is
for initializing an empty development database; do not run it against a
production database without reviewing its seed behavior.

## Frontend Vercel project

1. Import the same repository as a second Vercel project.
2. Set **Root Directory** to the repository root.
3. Use the Vite build command `npm run build` and output directory `dist`.
4. Set `VITE_API_BASE_URL` to the backend URL with `/api` at the end, for
   example `https://<backend-domain>/api`. This is a public API address, not a
   secret. Do not place database, SMTP, or JWT secrets in any `VITE_` variable.
5. Set this variable for Production and for each Preview environment that
   should use the backend, then redeploy the frontend.
6. Add the resulting frontend origin(s) to the backend's `CORS_ORIGINS` and
   redeploy the backend if you changed that variable.

During local development, the frontend calls `http://<current-host>:5000/api`.
For a deployed frontend, configure `VITE_API_BASE_URL`; the backend must also
allow the frontend's exact origin in `CORS_ORIGINS`.

## Database and uploads

`DATABASE_URL` must point to a hosted PostgreSQL service accessible from
Vercel. Configure its SSL requirements according to the provider. The
application uses a one-connection pool per Vercel function instance to reduce
connection pressure; a provider-supported pooled connection URL is still
recommended.

Uploaded files currently use local disk storage. Vercel function filesystems
are not persistent, so `/api/upload` returns HTTP 503 on Vercel instead of
claiming an upload was saved. Configure durable object storage (for example,
the provider supported by your deployment) before enabling production uploads.

## Local checks

From the repository root:

```powershell
npm ci
npm run build
```

From the `server` directory, after creating a private `.env` from
`.env.example` and filling in real local values:

```powershell
npm install
npm run dev
```

In another terminal:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
Invoke-RestMethod http://localhost:5000/api/health/db
Invoke-RestMethod http://localhost:5000/api/menu
```

The database health endpoint must return `database: connected` before
database-backed routes can be considered verified. Keep `.env` private and
never paste secret values into logs, issues, or chat.

## Vercel verification

1. Push the deployment changes to the connected GitHub branch.
2. In Vercel, open the backend project and confirm a new **Preview** deployment
   completes with the root directory set to `server`.
3. Open its deployment logs and check for initialization errors. Never copy
   environment-variable values into a support request.
4. Test `/api/health`, `/api/health/db`, and `/api/menu` on the Preview URL.
5. Open the frontend Preview URL and verify its browser requests use the
   configured backend URL and are not blocked by CORS.
6. Promote/deploy to Production only after the Preview API and database checks
   pass. If Vercel still reports `FUNCTION_INVOCATION_FAILED`, inspect the
   failed function's runtime logs for its invocation ID, timestamp, exception
   name/message, and stack trace. Redact tokens and all environment values.
