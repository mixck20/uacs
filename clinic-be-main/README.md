# UA Clinic System — Backend (Express + MongoDB)

This is a production-ready backend scaffold for the UA Clinic System with authentication, role-based access control, core modules (patients, EHR, inventory, appointments, announcements), export & backup utilities, and a simple FAQ chatbot (informational only).

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create an `.env` from `.env.example` and set your values:
   ```bash
   cp .env.example .env
   ```

3. Run MongoDB locally (e.g., `mongod`), then start the API:
   ```bash
   npm run dev
   ```

4. Import the provided Postman collection: `postman/UA-Clinic.postman_collection.json`

Default roles:
- **admin**: full access to admin portal.
- **staff**: clinic personnel (doctors/nurses) with broad access.
- **student** and **faculty**: limited access to their own info and public data.

> Registration requires a school email domain (configurable via `ALLOWED_EMAIL_DOMAIN`).

## Project Structure

```
src/
  config/        # env & db
  middleware/    # auth, roles, errors, limiter
  models/        # Mongoose schemas
  controllers/   # route handlers
  routes/        # route modules
  utils/         # helpers (csv export, backup)
  seed/          # seed script for initial admin
  server.js
```

## Security & Compliance

- JWT auth with role-based authorization
- Input validation (Joi)
- CORS + Helmet + Rate limit + Compression
- No diagnostic chatbot; FAQ only, with medical disclaimer
- Export endpoints return CSV only (no PHI leaks by default)
- Backup endpoint exports JSON snapshots of collections as a ZIP for disaster recovery

## Scripts

- `npm run dev` — start with nodemon
- `npm run start` — start normally
- `npm run seed` — create initial admin (uses env credentials if provided)

## Backups & Exports

- `GET /api/export/:type` — CSV for `patients`, `inventory`, `appointments`
- `POST /api/backup/snapshot` — admin-only; generates ZIP file containing JSON of all collections

## License

MIT
