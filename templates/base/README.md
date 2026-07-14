# express-ts-starter

Express 5 + TypeScript API, scaffolded with [@thefordz/create-express](https://www.npmjs.com/package/@thefordz/create-express).

## Getting started

```bash
cp .env.example .env   # optional — all values have sensible defaults
pnpm install
pnpm dev
```

Health check: [http://localhost:3000/health](http://localhost:3000/health)

## Scripts

| Script  | Description                      |
| ------- | -------------------------------- |
| `dev`   | Watch mode with tsx (hot reload) |
| `build` | Compile TypeScript to `dist/`    |
| `start` | Run the compiled server          |

## Environment variables

| Variable          | Default                 | Description                  |
| ----------------- | ----------------------- | ---------------------------- |
| `NODE_ENV`        | `development`           | Runtime environment          |
| `PORT`            | `3000`                  | Server port                  |
| `BASE_URL`        | `http://localhost:3000` | Public base URL              |
| `DB_URL`          | _(empty)_               | Database connection string   |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Allowed CORS origin          |

## Structure

Routes follow a `routes → controllers → services` flow — see the `/health` endpoint for the pattern. Add a `models/` folder alongside when you wire up a database.

```
src/
├── config/        # Env + HTTP status config
├── controllers/   # Request handlers
├── lib/           # Shared libraries / clients
├── middlewares/   # Express middlewares (error handler, ...)
├── routes/        # Route definitions
├── script/        # One-off scripts (seed, migrate, ...)
├── services/      # Business logic
├── types/         # Shared TypeScript types
├── utils/         # Helpers (AppError, getEnv, ...)
├── validators/    # Request validation schemas
└── index.ts       # App entry point
```
