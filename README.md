# Nikhil CareOne for healthcare

Patient-facing appointment website built with React and Vite. The backend is configured through `VITE_API_BASE_URL` and is not part of this project.

## Run locally

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend origin (no trailing slash).
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` for a production build.

## Deploy to Vercel

In the Vercel project, add the environment variable `VITE_API_BASE_URL` with value `https://niki-hospital-backend-api.onrender.com` for the environments you deploy (Production and Preview as needed), then redeploy. Vite embeds this public API origin at build time; the local `.env` file is intentionally ignored by Git and is not uploaded to Vercel. Do not add credentials or private secrets to Vite environment variables.

`vercel.json` rewrites app routes such as `/doctor/login` and `/doctor/dashboard` to the SPA entry point so direct links and page refreshes work.

## Pages

- `/` Home and doctor preview
- `/about` About the hospital
- `/doctors` Live doctor directory and specialty filter
- `/services` Informational services
- `/track` Read-only appointment lookup (supports `?id=APT10001`)
- `/contact` Hospital contact information
- `/doctor/login` Doctor login
- `/doctor/dashboard` Protected doctor portal

## Backend integration

- `GET /api/doctors`
- `GET /api/appointments/{id}` for read-only tracking

Doctor information is read from `GET /api/doctors`. Appointment booking is intentionally not available as a website form; the future Artemis assistant is the planned booking entry point. Connect it to the backend's patient and appointment APIs when that integration is ready.

## Hospital staff portal integration

The frontend includes `/login`, `/staff/login`, and role-specific Admin, Reception, and Medical Center workspaces. Staff login and protected profile restoration expect `POST /api/staff/auth/login` and `GET /api/staff/me`; all roles come from the authenticated profile response. Staff tokens are kept in `sessionStorage`, separately from doctor tokens.

The frontend also expects these staff APIs: `/api/admin/dashboard`, `/api/admin/appointments`, `/api/admin/doctors`, `/api/admin/doctors/availability`, `/api/admin/doctors/on-leave`, `/api/admin/staff`, `/api/admin/reports`, `/api/reception/appointments`, `/api/appointments/:id/no-show`, `/api/medical-center/completed-appointments`, and `/api/medical-center/appointments/:id/prescription`. The receptionist check-in action uses the existing `POST /api/appointments/:id/check-in` endpoint. The backend API documentation currently does not list the staff authentication, admin, reception listing, no-show, or medical-center endpoints, so those screens will show backend errors until the separate backend implements them with role authorization. The existing check-in endpoint documents patient check-in, not reception permissions. The frontend's 30-minute no-show timer is only a visibility hint; the server must validate eligibility and persist every status transition.

## Artemis integration point

`src/components/ChatbotWidget.jsx` contains the standalone placeholder UI. Replace its local placeholder submit handler with the future Artemis client/service; no chatbot API is currently connected.
