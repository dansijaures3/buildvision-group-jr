# BuildVision Group & JR Service

Premium French corporate platform for a West-African engineering & event-production holding (4 pillars: Architecture, Construction, Événementiel, Commerce).

## Stack
- pnpm monorepo (React + Vite frontend, Express API server, PostgreSQL via Drizzle).
- API contract is `lib/api-spec/openapi.yaml` → orval generates `@workspace/api-zod`, `@workspace/api-client-react`, and `@workspace/db` schema types.

## Artifacts
- `artifacts/buildvision` — public site + admin dashboard (preview path `/`).
- `artifacts/api-server` — REST API.

## Admin
- Soft password gate stored in `sessionStorage`. Password: **buildvision2026**.
- Routes under `/admin/*` provide CRUD for hero slides, projects, services, team, events, commerce, blog, partners, testimonials, quotes, contact messages.

## Database
- Provisioned PostgreSQL (`DATABASE_URL`).
- Schema in `lib/db/src/schema/index.ts`. Push with `pnpm --filter @workspace/db run db:push`.
- Seed sample content: `pnpm --filter @workspace/scripts run seed-buildvision`.

## Codegen / typecheck
- After editing `openapi.yaml`: `pnpm --filter @workspace/api-spec run codegen` then `pnpm run typecheck:libs` to rebuild composite libs.
