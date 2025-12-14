# Iceberg API

Backend service for managing agencies, agents, and transactions with automated commission calculation.

## Live API URL
- [https://iceberg-azure.vercel.app/health](https://iceberg-azure.vercel.app/health)
- Swagger UI: `<baseUrl>/docs`
- OpenAPI JSON: `<baseUrl>/docs-json`
- Healthcheck: `<baseUrl>/health`

## Local Development
```bash
git clone <repo>
cd iceberg
npm install
```

### Environment Variables
Create `.env` in the project root:
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=3000                   # optional, defaults to 3000
```
Uses MongoDB Atlas (required); no local Mongo accepted per task.
Tip: For Vercel/Render set `MONGO_URI` in project env vars; connection fails fast in serverless (5s timeout) if wrong.

### Run
```bash
npm run start:dev   # watch mode
# or
npm run start       # production build not required locally, but available via npm run build && npm run start:prod
```

## Testing
```bash
npm test                 # run all Jest tests
npm test -- <path>       # run a specific test file
npm run test:cov         # coverage
```
Tests use `mongodb-memory-server` with global setup/teardown; no real DB connection needed.

## Endpoints (high level)
- `GET /health` – liveness + DB state
- `GET /docs` – Swagger UI
- Agents: CRUD under `/agents`
- Agencies: CRUD under `/agencies`
- Transactions: CRUD + stage updates under `/transactions/:id/stage`

## Notes
- Validation via Zod pipes per route + global Nest `ValidationPipe`
- Commission rules enforced at transaction completion; breakdown embedded on the transaction
- Swagger configured in `src/main.ts`
