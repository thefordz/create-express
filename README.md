# create-expresso ☕

Scaffold an **Express 5 + TypeScript** API in seconds — like a shot of espresso.

> **Note:** this is a scaffolding tool — run it with `pnpm create` / `npm create` / `npx` as shown below. Do **not** `npm i create-expresso` into your project.

## Usage

```bash
# pnpm
pnpm create expresso my-api

# npm
npm create expresso@latest my-api

# bun
bun create expresso my-api

# or run the bin directly
npx create-expresso my-api
```

Also published as [`@thefordz/create-express`](https://www.npmjs.com/package/@thefordz/create-express) — same tool, either name works.

Omit the project name to get an interactive prompt. Use `.` to scaffold into the current directory.

Dependencies are installed automatically with the same package manager you ran the command with (pnpm → pnpm, npm → npm, bun → bun). Pass `--no-install` to skip:

```bash
pnpm create expresso my-api --no-install
```

## What you get

- **Express 5** with TypeScript (strict mode, ESM, NodeNext)
- **tsx watch** dev server with hot reload
- Environment config with validation (`dotenv` + typed `Env` object)
- Global error handler with custom `AppError` exception classes
- CORS + cookie-parser pre-configured
- `/health` endpoint and `.http` REST client test files
- `.env.example` included — copy to `.env` and fill in your values
- Dependencies auto-installed with your package manager (skip with `--no-install`)

## Project structure

```
my-api/
├── src/
│   ├── index.ts                        # Express entry point
│   ├── config/
│   │   ├── env.config.ts               # Typed environment variables
│   │   └── http.config.ts              # HTTP status constants
│   ├── controllers/
│   │   └── health.controller.ts        # Request handlers
│   ├── lib/                            # Shared libraries / clients
│   ├── middlewares/
│   │   └── errorHandler.middleware.ts  # Global error handler
│   ├── routes/
│   │   └── health.route.ts             # Route definitions
│   ├── script/                         # One-off scripts (seed, migrate, ...)
│   ├── services/
│   │   └── health.service.ts           # Business logic
│   ├── types/                          # Shared TypeScript types
│   ├── utils/
│   │   ├── app-error.ts                # AppError + exception classes
│   │   └── get-env.ts                  # Env variable helpers
│   └── validators/                     # Request validation schemas
├── http/                               # REST client test files
├── .env.example
├── package.json
└── tsconfig.json
```

Routes follow a `routes → controllers → services` flow — see the `/health` endpoint for the pattern. Add a `models/` folder alongside when you wire up a database.

## Scripts (inside the generated project)

| Script  | Description                     |
| ------- | ------------------------------- |
| `dev`   | Watch mode with tsx (hot reload)|
| `build` | Compile TypeScript to `dist/`   |
| `start` | Run the compiled server         |

## License

MIT
