# NIKHIL CENTER FOR HEALTH CARE

Patient-facing appointment website built with React and Vite. The backend is configured through `VITE_API_BASE_URL` and is not part of this project.

## Run locally

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend origin (no trailing slash).
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` for a production build.

## Pages

- `/` Home and doctor preview
- `/about` About the hospital
- `/doctors` Live doctor directory and specialty filter
- `/services` Informational services
- `/track` Read-only appointment lookup (supports `?id=APT10001`)
- `/contact` Hospital contact information

## Backend integration

- `GET /api/doctors`
- `GET /api/appointments/{id}` for read-only tracking

Doctor information is read from `GET /api/doctors`. Appointment booking is intentionally not available as a website form; the future Artemis assistant is the planned booking entry point. Connect it to the backend's patient and appointment APIs when that integration is ready.

## Artemis integration point

`src/components/ChatbotWidget.jsx` contains the standalone placeholder UI. Replace its local placeholder submit handler with the future Artemis client/service; no chatbot API is currently connected.
